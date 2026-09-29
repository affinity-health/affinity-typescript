// Compile-only example. Never execute this file against an API.
import { Affinity, type CompoundingReason, type OrderCreateParams } from "@affinity-health/sdk";

const affinity = new Affinity(process.env.AFFINITY_API_KEY!);

type Prescription = OrderCreateParams["prescriptions"][number] & { quantity: number };
declare const prescription: Prescription;
declare const practiceId: string;
declare const patientId: string;
declare const selectedCategory: CompoundingReason | undefined;
declare const clinicianEnteredExplanation: string;
declare const persistedOrderCreationKey: string;

const options = await affinity.catalog.prescribingOptions.get(prescription.medicationId, {
  practiceId,
});
const context = clinicianEnteredExplanation.trim();
const compoundingReason =
  selectedCategory || context
    ? {
        ...(selectedCategory ? { category: selectedCategory } : {}),
        ...(context ? { context } : {}),
      }
    : undefined;

const preview = await affinity.forPractice(practiceId).orders.preview({
  patientId,
  prescriptions: [
    {
      medicationId: prescription.medicationId,
      expectedRevision: options.revision,
      overrides: {
        sig: { format: "free_text", text: prescription.directions },
        quantity: { value: prescription.quantity, unit: prescription.quantityUnit },
        daysSupply: prescription.daysSupply,
        refills: prescription.refills,
        dispensing: prescription.dispensing,
        clinical: { ...prescription.clinical, compoundingReason },
      },
    },
  ],
});

if (preview.status === "incomplete") {
  // Display preview.issues beside the affected fields. Nothing has been created.
} else {
  // After the clinician reviews these exact values:
  if (!preview.orderInput) throw new Error("Complete preview is missing order input");
  const { practiceId: resolvedPracticeId, ...params } = preview.orderInput;
  const order = await affinity.forPractice(resolvedPracticeId).orders.create(params, {
    idempotencyKey: persistedOrderCreationKey,
  });
}
