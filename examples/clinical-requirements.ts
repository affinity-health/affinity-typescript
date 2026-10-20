import type { Affinity, Medication } from "@affinity-health/sdk";

// Compile-only helper. Show the current medication requirements to the clinician.
// Requirements do not constitute clinician approval or authorization to prescribe.
export async function medicationReview(affinity: Affinity, medicationId: string) {
  const medication: Medication = await affinity.medications.get(medicationId);
  return {
    requirements: medication.requirements,
    compoundingReasons: medication.compoundingReasons,
    quantities: medication.quantities,
    restrictedStates: medication.restrictedStates,
    shippingOptions: medication.shippingOptions,
  };
}
