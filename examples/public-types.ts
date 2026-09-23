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
  const practice: Practice = await affinity.practices.retrieve(practiceId);
  const id: string = practice.id;
  const enabled: boolean = practice.liveEnabled;
  const name: string | null = practice.legalName;
  // @ts-expect-error Required response IDs cannot be null.
  const invalid: Practice["id"] = null;
  // @ts-expect-error Live enablement is a boolean, not a nullable value.
  affinity.practices.update(id, { liveEnabled: null });
  const page = affinity.practices.list();
  for await (const item of page) {
    const typed: Practice = item;
    void typed;
  }
  const patients: Patient[] = await affinity.practices.patients
    .list(id)
    .autoPagingToArray({ limit: 10 });
  return { id, enabled, name, invalid, patients };
}
export type PublicTypes = [Order, CreatedOrder, CatalogItem, PracticeLocation];
