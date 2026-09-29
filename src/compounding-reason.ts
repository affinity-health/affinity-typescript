// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.

export const CompoundingReason = {
  AlcoholFree: "alcohol_free",
  DrugShortage: "drug_shortage",
  CommercialProductDiscontinued: "commercial_product_discontinued",
  ModifiedRelease: "modified_release",
  InactiveIngredientSensitivity: "inactive_ingredient_sensitivity",
  InactiveIngredientToxicity: "inactive_ingredient_toxicity",
  ConcentrationAdjustment: "concentration_adjustment",
  AlternateRoute: "alternate_route",
  DosageFormUnavailable: "dosage_form_unavailable",
  FlavorAdjustment: "flavor_adjustment",
  TabletBurden: "tablet_burden",
  PatientCannotUseCommercialProduct: "patient_cannot_use_commercial_product",
  NoApprovedProductAvailable: "no_approved_product_available",
  NoRationaleRequired: "no_rationale_required",
  OtherPatientSpecificNeed: "other_patient_specific_need",
} as const;
export type CompoundingReason = (typeof CompoundingReason)[keyof typeof CompoundingReason];
