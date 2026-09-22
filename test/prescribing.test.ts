import { expect, test } from "bun:test";
import { Affinity, CompoundingReason, ResponseError, affinityErrorFromResponse } from "../src";

const practiceId = "prac_01k123456789abcdefghjkmnpq";
const patientId = "pat_01k123456789abcdefghjkmnpq";
const medicationId = "cat_01k123456789abcdefghjkmnpq";
const shippingOptionId = "ship_01k123456789abcdefghjkmnpq";

test("supplies share the catalog resource and serialize the kind filter", async () => {
  let request: Request | undefined;
  const affinity = new Affinity("sk_test_example", {
    fetch: async (input, init) => {
      request = new Request(input, init);
      return Response.json({ object: "list", data: [], hasMore: false, url: "/v1/catalog/items" });
    },
  });
  await affinity.catalog.list({ catalogKind: "otc", limit: 10 });
  expect(new URL(request!.url).pathname).toBe("/v1/catalog/items");
  expect(new URL(request!.url).searchParams.get("catalogKind")).toBe("otc");
});

test("prescribing options serialize the item and practice scope", async () => {
  let request: Request | undefined;
  const affinity = new Affinity("sk_test_example", {
    fetch: async (input, init) => {
      request = new Request(input, init);
      return Response.json({
        catalog: {
          ingredients: [],
          shippingOptions: [],
          fulfillmentInclusions: [],
          ordering: {
            requiresPrescription: true,
            requiresAccompanyingPrescription: false,
            shipping: "prescription",
          },
        },
        compoundingReason: {
          required: false,
          categoryRequired: false,
          context: "not_supported",
          contextPrompt: null,
          choices: [
            {
              category: "concentration_adjustment",
              label: "Concentration adjustment",
              contextRequired: false,
              contextPrompt: null,
            },
          ],
        },
        presets: [],
        templates: [],
        pharmacyDirections: [],
        options: { doseUnits: [], doses: [], frequencies: [], routes: [] },
      });
    },
  });
  const options = await affinity.catalog.retrievePrescribingOptions(medicationId, { practiceId });
  expect(options.compoundingReason.choices[0]?.category).toBe(
    CompoundingReason.ConcentrationAdjustment,
  );
  expect(options.compoundingReason.context).toBe("not_supported");
  expect(new URL(request!.url).pathname).toBe(
    `/v1/catalog/items/${medicationId}/prescribing-options`,
  );
  expect(new URL(request!.url).searchParams.get("practiceId")).toBe(practiceId);
});

test("preview preserves custom SIGs and returns a directly creatable payload", async () => {
  const requests: Request[] = [];
  const orderInput = {
    otcItems: [{ catalogItemId: "cat_supply", quantity: 2 }],
    practiceId,
    patientId,
    prescriptions: [
      {
        medicationId,
        directions: "Take 1 tablet by mouth once daily.",
        quantity: 30,
        quantityUnit: "tablet",
        daysSupply: 30,
        refills: 0,
        dispensing: { shippingOptionId },
        clinical: { currentMedications: [], diagnoses: [], observations: [] },
      },
    ],
  };
  const affinity = new Affinity("sk_test_example", {
    fetch: async (input, init) => {
      requests.push(new Request(input, init));
      return Response.json(
        requests.length === 1
          ? {
              object: "order_preview",
              livemode: false,
              status: "complete",
              prescriptions: [],
              otcItems: [],
              shippingGroups: [
                {
                  key: "opaque-preview-group",
                  pharmacy: "Synthetic Pharmacy",
                  label: "Ground",
                  temperature: "ambient",
                  amountCents: 0,
                  itemCount: 1,
                  prescriptionIndexes: [0],
                },
              ],
              totals: {
                currency: "USD",
                medicationSubtotalCents: 1000,
                supplySubtotalCents: 300,
                shippingTotalCents: 500,
                estimatedTotalCents: 1800,
              },
              issues: [],
              clinicalRequirementsSatisfied: false,
              clinicalRequirements: [
                {
                  field: "prescriptions.0.clinical.medicationReviewStatus",
                  label: "Current medications",
                  type: "medication_review",
                  required: true,
                  status: "missing",
                },
              ],
              clinicalIssues: [
                {
                  code: "medication_review_required",
                  path: "prescriptions.0.clinical.medicationReviewStatus",
                  message: "Review current medications or confirm the patient takes none.",
                },
              ],
              orderInput,
            }
          : { prescriptions: [], fulfillments: [], otcItems: [] },
      );
    },
  });
  const preview = await affinity.orders.preview({
    otcItems: orderInput.otcItems,
    practiceId,
    patientId,
    prescriptions: [
      {
        medicationId,
        overrides: {
          sig: { format: "free_text", text: "Take 1 tablet by mouth once daily." },
          daysSupply: 30,
          clinical: {
            currentMedications: [],
            medicationReviewStatus: "none",
            diagnoses: [],
            diagnosisReviewStatus: "none",
          },
        },
      },
    ],
  });
  expect(preview.status).toBe("complete");
  expect(preview.clinicalRequirementsSatisfied).toBe(false);
  expect(preview.clinicalRequirements[0]?.required).toBe(true);
  expect(preview.clinicalIssues[0]?.code).toBe("medication_review_required");
  expect((await requests[0]!.clone().json()).prescriptions[0].overrides.clinical).toEqual({
    currentMedications: [],
    medicationReviewStatus: "none",
    diagnoses: [],
    diagnosisReviewStatus: "none",
  });
  expect(preview.totals.estimatedTotalCents).toBe(1800);
  expect(preview.shippingGroups[0]!.prescriptionIndexes).toEqual([0]);
  expect((await requests[0]!.clone().json()).otcItems).toEqual(orderInput.otcItems);
  expect(requests[0]!.headers.has("Idempotency-Key")).toBe(false);
  expect(new URL(requests[0]!.url).pathname).toBe("/v1/order-previews");
  expect((await requests[0]!.clone().json()).prescriptions[0].overrides.sig).toEqual({
    format: "free_text",
    text: "Take 1 tablet by mouth once daily.",
  });
  if (preview.status !== "complete") throw new Error("Expected complete preview");
  await affinity.orders.create(preview.orderInput, { idempotencyKey: "reviewed-preview" });
  expect((await requests[1]!.clone().json()).otcItems).toEqual(orderInput.otcItems);
  expect((await requests[1]!.clone().json()).prescriptions[0].dispensing.shippingOptionId).toBe(
    shippingOptionId,
  );
});

test("incomplete previews preserve null payload and actionable issues", async () => {
  const issues = [
    {
      code: "days_supply_required",
      path: "prescriptions.0.daysSupply",
      message: "Enter days supply.",
    },
  ];
  const affinity = new Affinity("sk_test_example", {
    fetch: async () =>
      Response.json({
        object: "order_preview",
        livemode: false,
        status: "incomplete",
        clinicalRequirementsSatisfied: true,
        clinicalRequirements: [],
        clinicalIssues: [],
        otcItems: [],
        shippingGroups: [],
        totals: {
          currency: "USD",
          medicationSubtotalCents: null,
          supplySubtotalCents: 0,
          shippingTotalCents: null,
          estimatedTotalCents: null,
        },
        prescriptions: [],
        issues,
        orderInput: null,
      }),
  });
  const preview = await affinity.orders.preview({
    practiceId,
    patientId,
    prescriptions: [{ medicationId }],
  });
  expect(preview.status).toBe("incomplete");
  expect(preview.orderInput).toBeNull();
  expect(preview.issues).toEqual(issues);
});

test("typed compounding reasons serialize without a dummy context or vendor code", async () => {
  let request: Request | undefined;
  const affinity = new Affinity("sk_test_example", {
    fetch: async (input, init) => {
      request = new Request(input, init);
      return Response.json({ prescriptions: [], fulfillments: [], otcItems: [] });
    },
  });
  await affinity.orders.create(
    {
      practiceId,
      patientId,
      prescriptions: [
        {
          medicationId,
          directions: "Use as directed in this synthetic test.",
          daysSupply: 30,
          quantity: 1,
          quantityUnit: "vial",
          refills: 0,
          dispensing: {},
          clinical: { compoundingReason: { category: CompoundingReason.ConcentrationAdjustment } },
        },
      ],
    },
    { idempotencyKey: "synthetic-reason-example" },
  );
  expect((await request!.json()).prescriptions[0].clinical.compoundingReason).toEqual({
    category: "concentration_adjustment",
  });
});

test("clinical 422 errors preserve field issues and are not retried", async () => {
  let calls = 0;
  const issues = [
    {
      code: "diagnosis_review_required",
      path: "prescriptions.0.clinical.diagnosisReviewStatus",
      message: "Review diagnoses.",
      prescriptionId: "rx_synthetic",
      pharmacy: "Synthetic Pharmacy",
    },
  ];
  const affinity = new Affinity("sk_test_example", {
    fetch: async () => {
      calls++;
      return Response.json(
        {
          type: "https://api.joinaffinityai.com/problems/clinical-requirements-unmet",
          title: "Clinical requirements unmet",
          instance: "urn:affinity:request:req_synthetic",
          requestId: "req_synthetic",
          status: 422,
          code: "clinical_requirements_unmet",
          detail: "Review clinical information before signing.",
          data: { issues },
        },
        { status: 422 },
      );
    },
  });
  try {
    await affinity.orders.retrieve("ord_synthetic");
    throw new Error("Expected a clinical error");
  } catch (error) {
    expect(error).toBeInstanceOf(ResponseError);
    if (!(error instanceof ResponseError)) throw error;
    const parsed = await affinityErrorFromResponse(error.response);
    expect(parsed.statusCode).toBe(422);
    expect(parsed.code).toBe("clinical_requirements_unmet");
    expect(parsed.problem?.data?.issues).toEqual(issues);
    expect(parsed.retryable).toBe(false);
  }
  expect(calls).toBe(1);
});
