import { expect, spyOn, test } from "bun:test";
import { Affinity } from "@affinity-health/sdk";
import { createTestWorkflow } from "../examples/emr-order";

test("EMR example records explicit allergy review before draft creation", async () => {
  const client = new Affinity("sk_test_example");
  const events: string[] = [];
  const history = { reviewStatus: "not_reviewed", allergies: [] };
  const previewResult = {
    status: "complete",
    orderInput: { practiceId: "prac_test", patientId: "pat_test", prescriptions: [] },
  };
  const spies = [
    spyOn(Object.getPrototypeOf(client.apiKeys), "retrieve").mockResolvedValue({ livemode: false }),
    spyOn(Object.getPrototypeOf(client.patients), "create").mockImplementation(async () => {
      events.push("patient");
      return { id: "pat_test" };
    }),
    spyOn(Object.getPrototypeOf(client.patients), "retrieveAllergies").mockImplementation(
      async () => {
        events.push("history");
        return history;
      },
    ),
    spyOn(Object.getPrototypeOf(client.orders), "preview").mockImplementation(async () => {
      events.push("preview");
      return previewResult;
    }),
    spyOn(Object.getPrototypeOf(client.patients), "replaceAllergies").mockImplementation(
      async () => {
        events.push("review");
        return { reviewStatus: "no_known", allergies: [] };
      },
    ),
    spyOn(Object.getPrototypeOf(client.orders), "create").mockImplementation(async () => {
      events.push("draft");
      return { id: "ord_test" };
    }),
    spyOn(Object.getPrototypeOf(client.orders), "retrieve").mockResolvedValue({ id: "ord_test" }),
  ];
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
    expect(spies[3]).toHaveBeenCalledWith(
      expect.objectContaining({
        patientId: "pat_test",
        prescriptions: [{ medicationId: "cat_test", preset: "default" }],
        shipping: { selection: "lowest_cost" },
      }),
    );
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
    expect(spies[4]).toHaveBeenCalledWith(
      "prac_test",
      "pat_test",
      { reviewStatus: "no_known", allergies: [] },
      { idempotencyKey: "review-key" },
    );
    expect(spies[5]).toHaveBeenCalledWith(previewResult.orderInput, {
      idempotencyKey: "order-key",
    });
    spies[4]!.mockRejectedValueOnce(new Error("Review failed"));
    await expect(
      workflow.saveDraft(preview, "other-order-key", {
        reviewedAllergies: { reviewStatus: "no_known", allergies: [] },
        persistedReviewKey: "other-review-key",
      }),
    ).rejects.toThrow("Review failed");
    expect(spies[5]).toHaveBeenCalledTimes(1);
  } finally {
    for (const spy of spies) spy.mockRestore();
  }
});
