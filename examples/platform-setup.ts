import { Affinity } from "@affinity-health/sdk";

// Inviting people and assigning NPI are dashboard workflows in the MVP.
export async function createTestPractice(api: Affinity, name: string, persistedKey: string) {
  if ((await api.account.get()).mode !== "test") throw new Error("Use a Test API key");
  return api.practices.create({ name }, { idempotencyKey: persistedKey });
}
