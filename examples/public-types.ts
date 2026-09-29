import type {
  Affinity,
  Practice,
  Patient,
  Order,
  CreatedOrder,
  CatalogItem,
  PracticeLocation,
} from "@affinity-health/sdk";

// Compile-only examples, never executed against an API.
export async function verifyPublicTypes(affinity: Affinity, practiceId: string) {
  const practice: Practice = await affinity.practices.get(practiceId);
  const id: string = practice.id;
  const enabled: boolean = practice.liveEnabled;
  const name: string | null = practice.legalName;
  // @ts-expect-error Required response IDs cannot be null.
  const invalid: Practice["id"] = null;
  // @ts-expect-error Live enablement is a boolean, not a nullable value.
  affinity.practices.update(id, { liveEnabled: null });
  const page = affinity.practices.iterate();
  for await (const item of page) {
    const typed: Practice = item;
    void typed;
  }
  const patients: Patient[] = [];
  for await (const patient of affinity.forPractice(id).patients.iterate({ limit: 10 })) {
    patients.push(patient);
    if (patients.length === 10) break;
  }
  return { id, enabled, name, invalid, patients };
}
export type PublicTypes = [Order, CreatedOrder, CatalogItem, PracticeLocation];
