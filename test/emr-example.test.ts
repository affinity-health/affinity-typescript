import { expect, spyOn, test } from "bun:test";
import { createTestWorkflow } from "../examples/emr-order";

test("EMR example records explicit allergy review before draft creation", async () => {
  const events: string[] = [];
  const bodies: Record<string, unknown>[] = [];
  const history = { reviewStatus: "not_reviewed", allergies: [] };
  const prescription = { medicationId: "cat_test", quantity: 1 };
  const orderInput = {
    practiceId: "prac_test",
    patientId: "pat_test",
    prescriptions: [prescription],
  };
  let failReview = false;
  const fetchSpy = spyOn(globalThis, "fetch").mockImplementation(async (input, init) => {
    const path = new URL(String(input)).pathname;
    const method = init?.method ?? "GET";
    const body = init?.body ? JSON.parse(String(init.body)) : undefined;
    if (body) bodies.push(body);
    if (path === "/v1/auth/access") return Response.json({ livemode: false });
    if (path === "/v1/practices/prac_test/patients") {
      events.push("patient");
      return Response.json({
        id: "pat_test",
        allergySummary: [],
        externalIdentities: [],
        addresses: [],
        encounters: [],
        measurements: [],
        programs: [],
      });
    }
    if (path.endsWith("/allergies") && method === "GET") {
      events.push("history");
      return Response.json(history);
    }
    if (path === "/v1/order-previews") {
      events.push("preview");
      return Response.json({
        object: "order_preview",
        livemode: false,
        status: "complete",
        orderInput,
        prescriptions: [],
        otcItems: [],
        shippingGroups: [],
        totals: {
          currency: "USD",
          medicationSubtotalCents: 1000,
          supplySubtotalCents: 0,
          shippingTotalCents: 0,
          estimatedTotalCents: 1000,
        },
        issues: [],
        clinicalRequirementsSatisfied: true,
        clinicalRequirements: [],
        clinicalIssues: [],
      });
    }
    if (path.endsWith("/allergies") && method === "PUT") {
      if (failReview) return Response.json({ message: "Review failed" }, { status: 422 });
      events.push("review");
      expect(new Headers(init?.headers).get("Idempotency-Key")).toBe("review-key");
      return Response.json(body);
    }
    if (path === "/v1/orders" && method === "POST") {
      events.push("draft");
      expect(new Headers(init?.headers).get("Idempotency-Key")).toBe("order-key");
      return Response.json({
        id: "ord_test",
        otcItems: [],
        prescriptions: [],
        fulfillments: [],
        lifecycleEvents: [],
      });
    }
    if (path === "/v1/orders/ord_test" && method === "GET")
      return Response.json({
        id: "ord_test",
        otcItems: [],
        prescriptions: [],
        fulfillments: [],
        lifecycleEvents: [],
      });
    throw new Error(`Unexpected request: ${method} ${path}`);
  });
  try {
    const workflow = await createTestWorkflow("sk_test_example");
    const prepared = await workflow.preparePatient({
      practiceId: "prac_test",
      patientExternalId: "synthetic-test",
      persistedCreationKey: "patient-key",
    });
    expect(prepared.allergies).toEqual(history);
    expect(events).toEqual(["patient", "history"]);
    const preview = await workflow.preview({
      practiceId: "prac_test",
      patientId: prepared.patient.id,
      medicationId: "cat_test",
      supplyId: "cat_supply",
    });
    expect(bodies.at(-1)).toMatchObject({
      patientId: "pat_test",
      prescriptions: [{ medicationId: "cat_test", preset: "default" }],
      shipping: { selection: "lowest_cost" },
    });
    await expect(
      workflow.saveDraft(preview, "order-key", {
        reviewedAllergies: { reviewStatus: "recorded", allergies: [] },
        persistedReviewKey: "invalid-key",
      }),
    ).rejects.toThrow("explicit allergy review");
    expect(events).toEqual(["patient", "history", "preview"]);
    await workflow.saveDraft(preview, "order-key", {
      reviewedAllergies: { reviewStatus: "no_known", allergies: [] },
      persistedReviewKey: "review-key",
    });
    expect(events).toEqual(["patient", "history", "preview", "review", "draft"]);
    expect(bodies.at(-2)).toEqual({ reviewStatus: "no_known", allergies: [] });
    expect(bodies.at(-1)).toMatchObject(orderInput);
    failReview = true;
    await expect(
      workflow.saveDraft(preview, "other-order-key", {
        reviewedAllergies: { reviewStatus: "no_known", allergies: [] },
        persistedReviewKey: "other-review-key",
      }),
    ).rejects.toThrow();
    expect(events.filter((event) => event === "draft")).toHaveLength(1);
  } finally {
    fetchSpy.mockRestore();
  }
});
