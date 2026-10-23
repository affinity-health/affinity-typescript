import { Affinity } from "@affinity-health/sdk";

// Server-side only. Call with a persisted key for this exact creation operation.
export async function createSyntheticPractice(apiKey: string, persistedCreationKey: string) {
  const affinity = new Affinity(apiKey);
  const account = await affinity.account.get();
  if (account.mode !== "test" || account.type !== "platform")
    throw new Error("Use a platform Test key for this example");
  const practice = await affinity.practices.create(
    {
      name: "Synthetic SDK Practice",
      phone: "+12025550199",
      address: { line1: "200 Example Ave", city: "Austin", state: "TX", postalCode: "78701" },
    },
    { idempotencyKey: persistedCreationKey },
  );
  return affinity.practices.get(practice.id);
}
