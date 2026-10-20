import type { Medication, OrderCreateParams } from "@affinity-health/sdk";

// Compile-only example. compoundingReason is an optional string, not an enum.
// Display medication.compoundingReasons and record the clinician's reviewed text.
export function reviewedPrescription(
  medication: Medication,
  approved: Omit<OrderCreateParams["prescriptions"][number], "medicationId">,
): OrderCreateParams["prescriptions"][number] {
  return { ...approved, medicationId: medication.id };
}
