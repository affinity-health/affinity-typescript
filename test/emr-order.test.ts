import { expect, test } from "bun:test";
import { Affinity } from "../src";

test("prescriber selectors serialize without userId or actor options, including inheritance", async () => {
  const requests: Request[] = [];
  const affinity = new Affinity("sk_test_example", {
    fetch: async (input, init) => {
      requests.push(new Request(input, init));
      return Response.json(
        {
          object: "order_sign_and_submission",
          orderId: "ord_test",
          signedAt: "2026-09-19T12:00:00Z",
          status: "submitted",
          prescriptions: [],
        },
        { status: 202 },
      );
    },
  });
  for (const prescriber of [
    { npi: "1234567893" },
    { id: "prov_test" },
    { externalId: "emr-clinician" },
    undefined,
  ]) {
    await affinity.orders.signAndSubmit(
      "ord_test",
      {
        practiceId: "prac_test",
        prescriber,
        signatureAttestation: true,
        expectedVersions: [{ prescriptionId: "rx_one", version: 1 }],
      },
      { idempotencyKey: "approval-" + requests.length },
    );
  }
  expect((await requests[0]!.json()).prescriber).toEqual({ npi: "1234567893" });
  expect((await requests[1]!.json()).prescriber).toEqual({ id: "prov_test" });
  expect((await requests[2]!.json()).prescriber).toEqual({ externalId: "emr-clinician" });
  expect(await requests[3]!.json()).toEqual({
    practiceId: "prac_test",
    signatureAttestation: true,
    expectedVersions: [{ prescriptionId: "rx_one", version: 1 }],
  });
  for (const request of requests)
    expect(request.headers.get("Affinity-Actor-Type")).not.toBe("user");
});

test("preview serializes external and inline patient selectors without a patient ID", async () => {
  const requests: Request[] = [];
  const affinity = new Affinity("sk_test_example", {
    fetch: async (input, init) => {
      requests.push(new Request(input, init));
      return Response.json({
        status: "incomplete",
        object: "order_preview",
        livemode: false,
        clinicalRequirementsSatisfied: true,
        clinicalRequirements: [],
        clinicalIssues: [],
        prescriptions: [],
        otcItems: [],
        shippingGroups: [],
        issues: [],
        totals: {
          currency: "USD",
          medicationSubtotalCents: null,
          supplySubtotalCents: 0,
          shippingTotalCents: null,
          estimatedTotalCents: null,
        },
        orderInput: null,
      });
    },
  });
  await affinity.orderPreviews.create({
    practiceId: "prac_test",
    patientExternalId: "emr-123",
    prescriptions: [{ medicationId: "cat_test", preset: "default" }],
  });
  await affinity.orderPreviews.create({
    practiceId: "prac_test",
    patient: { name: { first: "Synthetic", last: "Patient" }, dateOfBirth: "1990-01-01" },
    prescriptions: [{ medicationId: "cat_test" }],
  });
  expect(await requests[0]!.json()).toMatchObject({ patientExternalId: "emr-123" });
  const inline = await requests[1]!.json();
  expect(inline.patient.name.first).toBe("Synthetic");
  expect(inline.patientId).toBeUndefined();
});

test("signAndSubmit carries exact versions, clinician attribution, key, and partial outcomes", async () => {
  let request: Request | undefined;
  const response = {
    object: "order_sign_and_submission",
    orderId: "ord_test",
    signedAt: "2026-09-19T12:00:00Z",
    status: "partially_submitted",
    prescriptions: [
      {
        prescriptionId: "rx_one",
        status: "submitted",
        fulfillmentOrderId: "ord_fulfillment",
        error: null,
      },
      {
        prescriptionId: "rx_two",
        status: "failed",
        fulfillmentOrderId: null,
        error: { code: "conflict", detail: "Delivery needs attention", status: 409 },
      },
    ],
  };
  const affinity = new Affinity("sk_test_example", {
    fetch: async (input, init) => {
      request = new Request(input, init);
      return Response.json(response, { status: 202 });
    },
  });
  const params = {
    practiceId: "prac_test",
    userId: "user_test",
    signatureAttestation: true,
    expectedVersions: [
      { prescriptionId: "rx_one", version: 1 },
      { prescriptionId: "rx_two", version: 3 },
    ],
  };
  expect(
    await affinity.orders.signAndSubmit("ord_test", params, {
      actor: { type: "user", id: "emr-clinician" },
      idempotencyKey: "persisted-approval",
    }),
  ).toEqual(response);
  expect(new URL(request!.url).pathname).toBe("/v1/orders/ord_test/sign-and-submit");
  expect(request!.headers.get("Affinity-Actor-Id")).toBe("emr-clinician");
  expect(request!.headers.get("Idempotency-Key")).toBe("persisted-approval");
  expect(await request!.json()).toEqual(params);
});
