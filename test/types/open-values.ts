// Compiled by `bun run test:types`, never run. The contract lists response values open
// (`x-extensible-enum`); the SDK still types the known values, and test/client.test.ts proves an
// unknown value decodes at runtime.
import type { Affinity } from "../../src";

export const knownStatus: Affinity.Order.Status = "awaiting_approval";
export const knownCategory: Affinity.Allergy.Category = "drug";
export const knownPrescriptionStatus: Affinity.Prescription.Status = "shipped";
// @ts-expect-error a value the SDK does not know is not typed as a status
export const unknownStatus: Affinity.Order.Status = "on_hold";
// @ts-expect-error a value the SDK does not know is not typed as a category
export const unknownCategory: Affinity.Allergy.Category = "dust";
// @ts-expect-error response objects are closed for typing: no index signature for added fields
export const added: Affinity.Order["addedField"] = undefined;
