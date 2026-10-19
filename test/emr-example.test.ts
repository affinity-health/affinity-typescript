import { expect, spyOn, test } from "bun:test";
import { createTestWorkflow } from "../examples/emr-order";
import type { OrderCreateParams } from "../src";

const reviewedInput: OrderCreateParams = {
  practiceId: "prac_01j2y8m6jcc9tt24af5pw9x1bc",
  patient: {
    firstName: "Synthetic",
    lastName: "Patient",
    dateOfBirth: "1990-01-01",
    gender: "unknown",
    email: "patient@example.test",
    phone: "+12025550199",
    address: { line1: "100 Test St", city: "Austin", state: "TX", postalCode: "78701" },
    allergies: [{ category: "drug", display: "Synthetic reviewed allergy" }],
  },
  prescriber: { firstName: "Synthetic", lastName: "Prescriber", npi: "1234567893" },
  prescriptions: [
    {
      medicationId: "med_01j2y8m6jcc9tt24af5pw9x1bc",
      directions: "Synthetic Test directions",
      quantity: 1,
      refills: 0,
    },
  ],
  shippingOptionId: "shp_01j2y8m6jcc9tt24af5pw9x1bc",
  signatureAttestation: true,
};

test("EMR sends exact reviewed patient and order in one idempotent request", async () => {
  const writes: { path: string; method: string; key: string | null; body: unknown }[] = [];
  const fetchSpy = spyOn(globalThis, "fetch").mockImplementation(async (input, init) => {
    const path = new URL(String(input)).pathname;
    if (path === "/v1/account") return Response.json({ mode: "test" });
    writes.push({
      path,
      method: init?.method ?? "GET",
      key: new Headers(init?.headers).get("Idempotency-Key"),
      body: init?.body ? JSON.parse(String(init.body)) : undefined,
    });
    return Response.json({ id: "ord_fixture", status: "submitted", mode: "test" });
  });
  try {
    const workflow = await createTestWorkflow("synthetic-test-key");
    const approval = {
      reviewedInput,
      persistedCreationKey: "durable-order-key",
      attested: true as const,
    };
    await workflow.sendReviewedOrder(approval);
    await workflow.sendReviewedOrder(approval);
    expect(writes).toEqual(
      [0, 1].map(() => ({
        path: "/v1/orders",
        method: "POST",
        key: "durable-order-key",
        body: reviewedInput,
      })),
    );
    await workflow.cancelOrder("ord_fixture");
    expect(writes.at(-1)).toMatchObject({
      path: "/v1/orders/ord_fixture/cancel",
      method: "POST",
      key: null,
    });
  } finally {
    fetchSpy.mockRestore();
  }
});

test("EMR refuses Live or missing account mode before any mutation", async () => {
  for (const mode of ["live", undefined]) {
    const paths: string[] = [];
    const fetchSpy = spyOn(globalThis, "fetch").mockImplementation(async (input) => {
      paths.push(new URL(String(input)).pathname);
      return Response.json({ mode });
    });
    try {
      await expect(createTestWorkflow("synthetic-key")).rejects.toThrow("only accepts a Test key");
      expect(paths).toEqual(["/v1/account"]);
    } finally {
      fetchSpy.mockRestore();
    }
  }
});

test("EMR rejects missing runtime attestation without sending an order", async () => {
  const paths: string[] = [];
  const fetchSpy = spyOn(globalThis, "fetch").mockImplementation(async (input) => {
    paths.push(new URL(String(input)).pathname);
    return Response.json({ mode: "test" });
  });
  try {
    const workflow = await createTestWorkflow("synthetic-key");
    await expect(
      workflow.sendReviewedOrder({
        reviewedInput: { ...reviewedInput, signatureAttestation: false as unknown as true },
        persistedCreationKey: "durable-key",
        attested: true,
      }),
    ).rejects.toThrow("explicit clinician attestation");
    expect(paths).toEqual(["/v1/account"]);
  } finally {
    fetchSpy.mockRestore();
  }
});

test("MVP webhook receiver verifies the raw body and acknowledges only after enqueue", async () => {
  const { createHmac } = await import("node:crypto");
  const { receiveWebhook } = await import("../examples/emr-order");
  const secret = "whsec_test_synthetic_endpoint_secret";
  const timestamp = Math.floor(Date.now() / 1000);
  const body = JSON.stringify({
    id: "evt_01j2y8m6jcc9tt24af5pw9x1bc",
    type: "order.submitted",
    createdAt: new Date().toISOString(),
    data: {
      order: {
        id: "ord_01j2y8m6jcc9tt24af5pw9x1bc",
        status: "submitted",
        cancelRequestedAt: null,
        externalOrderId: null,
        failureReason: null,
        shipments: [],
        updatedAt: new Date().toISOString(),
      },
    },
  });
  const signature = `t=${timestamp},v1=${createHmac("sha256", secret).update(`${timestamp}.${body}`).digest("hex")}`;
  const request = (payload = body) =>
    new Request("https://example.test/webhook", {
      method: "POST",
      headers: { "affinity-signature": signature },
      body: payload,
    });
  const events: [string, string][] = [];
  await expect(
    receiveWebhook(request(), "whsec_live_synthetic_endpoint_secret", async () => {
      throw new Error("must not enqueue");
    }),
  ).rejects.toThrow("Test endpoint signing secret");
  const response = await receiveWebhook(request(), secret, async (eventId, orderId) => {
    events.push([eventId, orderId]);
  });
  expect(response.status).toBe(204);
  expect(events).toEqual([["evt_01j2y8m6jcc9tt24af5pw9x1bc", "ord_01j2y8m6jcc9tt24af5pw9x1bc"]]);
  await expect(
    receiveWebhook(request(body + " "), secret, async () => {
      throw new Error("must not enqueue");
    }),
  ).rejects.toThrow();
  await expect(
    receiveWebhook(request(), secret, async () => {
      throw new Error("durable queue unavailable");
    }),
  ).rejects.toThrow("durable queue unavailable");
});
