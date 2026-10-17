import type {
  Affinity,
  Practice,
  Medication,
  Order,
  CreatedOrder,
  Patient,
  Prescription,
} from "@affinity-health/sdk";

export async function verifyPublicTypes(api: Affinity, practiceId: string) {
  const practice: Practice = await api.practices.get(practiceId);
  const medication: Medication = await api.medications.get("med_synthetic");
  const enabled: boolean = practice.liveEnabled;
  // @ts-expect-error Required IDs cannot be null.
  const invalid: Practice["id"] = null;
  for await (const order of api.orders.iterate({ practiceId, limit: 10 })) {
    const typed: Order = order;
    void typed;
  }
  return { practice, medication, enabled, invalid };
}
export type PublicTypes = [Order, CreatedOrder, Patient, Prescription];
