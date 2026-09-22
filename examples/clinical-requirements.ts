// Compile-only example with synthetic identifiers. Never execute against an API.
import { Affinity, ResponseError, affinityErrorFromResponse } from "@affinity-health/sdk";

const affinity = new Affinity("sk_test_example");
const practiceId = "prac_synthetic";
const medicationId = "cat_synthetic";
const options = await affinity.catalog.retrievePrescribingOptions(medicationId, { practiceId });
const requirements = options.catalog.prescriptionRequirements;
// Render requirements before collecting clinician-reviewed information.
void requirements;

const preview = await affinity.orders.preview({
  practiceId,
  patientId: "pat_synthetic",
  prescriptions: [
    {
      medicationId,
      expectedRevision: options.revision,
      overrides: {
        clinical: {
          // Only use none after explicit confirmation by the clinician.
          currentMedications: [],
          medicationReviewStatus: "none",
          diagnoses: [],
          diagnosisReviewStatus: "none",
        },
      },
    },
  ],
});
for (const issue of preview.clinicalIssues) {
  // Render issue.message beside issue.path in the authenticated clinical UI.
  void issue;
}
if (preview.status === "complete") {
  // Draft creation is allowed even if clinicalRequirementsSatisfied is false.
  // Signing must use the reviewed versions and satisfy current requirements.
  void preview.orderInput;
}

// Use this in the signing error handler. Never log clinical issue bodies.
async function handleSigningError(error: unknown) {
  if (error instanceof ResponseError) {
    const parsed = await affinityErrorFromResponse(error.response);
    if (parsed.code !== "clinical_requirements_unmet") throw parsed;
    const issues = parsed.problem?.data?.issues;
    if (Array.isArray(issues)) return issues;
  }
  throw error;
}
void handleSigningError;
