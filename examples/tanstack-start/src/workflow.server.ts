import { AffinityClient, AffinityError } from "@affinity-health/sdk";

export async function client() {
  const key = process.env.AFFINITY_EXAMPLE_API_KEY;
  if (!key) throw new Error("Set AFFINITY_EXAMPLE_API_KEY on the server.");
  const affinity = new AffinityClient({
    token: key,
    ...(process.env.AFFINITY_EXAMPLE_API_URL
      ? { baseUrl: process.env.AFFINITY_EXAMPLE_API_URL }
      : {}),
  });
  const account = await affinity.account.get();
  if (account.mode !== "test") throw new Error("This example refuses Live-mode API keys.");
  if (account.type !== "platform")
    throw new Error("Use a platform Test key to list its practices.");
  return { affinity, account };
}

export async function safely<T>(action: () => Promise<T>) {
  try {
    return { ok: true as const, value: await action() };
  } catch (error) {
    // Serialize only error metadata. Never send credentials or request bodies to the browser.
    return {
      ok: false as const,
      error:
        error instanceof AffinityError
          ? `Affinity request failed${error.statusCode ? ` (${error.statusCode})` : ""}${error.requestId ? `; request ${error.requestId}` : ""}`
          : error instanceof Error
            ? error.message
            : "Request failed.",
    };
  }
}

// Each read returns one page as the API sent it, so it can cross to the browser.
export async function practices(startingAfter?: string) {
  const { affinity } = await client();
  return (await affinity.practices.list({ limit: 25, startingAfter })).response;
}

export async function medications(startingAfter?: string) {
  const { affinity } = await client();
  return (await affinity.medications.list({ limit: 25, startingAfter })).response;
}
