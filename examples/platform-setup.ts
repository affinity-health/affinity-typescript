import { AffinityClient } from "@affinity-health/sdk";

// Server-side only. Save `creationKey` before the first request and reuse it on every retry of
// this creation, so a timeout or restart never creates a second practice.
export async function createSyntheticPractice(token: string, creationKey: string) {
  const affinity = new AffinityClient({ token });
  const account = await affinity.account.get();
  if (account.mode !== "test" || account.type !== "platform")
    throw new Error("Use a platform Test key for this example");
  const practice = await affinity.practices.create({
    idempotencyKey: creationKey,
    name: "Synthetic SDK Practice",
    phone: "+12025550199",
    address: { line1: "200 Example Ave", city: "Austin", state: "TX", postalCode: "78701" },
  });
  return affinity.practices.get({ practiceId: practice.id });
}
