import { expect, test } from "bun:test";
import { Affinity } from "../src";

const practiceId = "prac_01k123456789abcdefghjkmnpq";
const patientId = "pat_01k123456789abcdefghjkmnpq";
const medicationId = "cat_01k123456789abcdefghjkmnpq";
const shippingOptionId = "ship_01k123456789abcdefghjkmnpq";

test("prescribing options serialize the item and practice scope", async () => {
  let request: Request | undefined;
  const affinity = new Affinity("sk_test_example", {
    fetch: async (input, init) => {
      request = new Request(input, init);
      return Response.json({
        catalog: { ingredients: [], shippingOptions: [] },
        presets: [],
        templates: [],
        pharmacyDirections: [],
        options: { doseUnits: [], doses: [], frequencies: [], routes: [] },
      });
    },
  });
  await affinity.catalog.retrievePrescribingOptions(medicationId, { practiceId });
  expect(new URL(request!.url).pathname).toBe(
    `/v1/catalog/items/${medicationId}/prescribing-options`,
  );
  expect(new URL(request!.url).searchParams.get("practiceId")).toBe(practiceId);
});

test("preview preserves custom SIGs and returns a directly creatable payload", async () => {
  const requests: Request[] = [];
  const orderInput = {
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
              issues: [],
              orderInput,
            }
          : { prescriptions: [], fulfillments: [] },
      );
    },
  });
  const preview = await affinity.orders.preview({
    practiceId,
    patientId,
    prescriptions: [
      {
        medicationId,
        overrides: {
          sig: { format: "free_text", text: "Take 1 tablet by mouth once daily." },
          daysSupply: 30,
        },
      },
    ],
  });
  expect(preview.status).toBe("complete");
  expect(requests[0]!.headers.has("Idempotency-Key")).toBe(false);
  expect(new URL(requests[0]!.url).pathname).toBe("/v1/order-previews");
  expect((await requests[0]!.clone().json()).prescriptions[0].overrides.sig).toEqual({
    format: "free_text",
    text: "Take 1 tablet by mouth once daily.",
  });
  if (preview.status !== "complete") throw new Error("Expected complete preview");
  await affinity.orders.create(preview.orderInput, { idempotencyKey: "reviewed-preview" });
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
