import type {
  Affinity,
  Practice,
  Patient,
  Order,
  Medication,
  MedicationGetResponse,
  MedicationListParams,
  OrderCreateParams,
} from "@affinity-health/sdk";

// Compile-only examples. Patient is order input, not a standalone API resource.
export async function verifyPublicTypes(affinity: Affinity, practiceId: string) {
  const practice: Practice = await affinity.practices.get(practiceId);
  const id: string = practice.id;
  const enabled: boolean = practice.liveEnabled;
  const phone: string | null = practice.phone;
  // @ts-expect-error Required response IDs cannot be null.
  const invalid: Practice["id"] = null;
  // @ts-expect-error Live enablement is a boolean, not a nullable value.
  affinity.practices.update(id, { liveEnabled: null });
  const params: MedicationListParams = { limit: "10" };
  const page = await affinity.medications.list(params);
  const medication: MedicationGetResponse | undefined = page.data[0];
  const alias: Medication | undefined = medication;
  return { id, enabled, phone, invalid, alias };
}
export function patientInput(patient: Patient): OrderCreateParams["patient"] {
  return patient;
}
export type PublicTypes = [Order, Medication, Practice, Patient];
