import { expect, test } from "bun:test";
import { client } from "./workflow.server";

test("requires explicit server configuration and refuses Live or ambiguous mode before writes", async () => {
  const previousKey = process.env.AFFINITY_EXAMPLE_API_KEY;
  const previousPractice = process.env.AFFINITY_EXAMPLE_PRACTICE_ID;
  const originalFetch = globalThis.fetch;
  try {
    delete process.env.AFFINITY_EXAMPLE_API_KEY;
    delete process.env.AFFINITY_EXAMPLE_PRACTICE_ID;
    await expect(client()).rejects.toThrow("Set AFFINITY_EXAMPLE_API_KEY");
    process.env.AFFINITY_EXAMPLE_API_KEY = "synthetic-test-not-a-real-key";
    process.env.AFFINITY_EXAMPLE_PRACTICE_ID = "prac_fixture";
    for (const livemode of [true, undefined, false]) {
      const calls: string[] = [];
      globalThis.fetch = (async (input: RequestInfo | URL) => {
        calls.push(String(input));
        return Response.json({ livemode, apiKey: {}, serviceAccount: {}, scopes: [] });
      }) as typeof fetch;
      if (livemode === false) expect((await client()).practiceId).toBe("prac_fixture");
      else await expect(client()).rejects.toThrow("refuses Live-mode");
      expect(calls).toHaveLength(1);
      expect(calls[0]).toContain("https://api.joinaffinityai.com/");
    }
  } finally {
    globalThis.fetch = originalFetch;
    if (previousKey === undefined) delete process.env.AFFINITY_EXAMPLE_API_KEY;
    else process.env.AFFINITY_EXAMPLE_API_KEY = previousKey;
    if (previousPractice === undefined) delete process.env.AFFINITY_EXAMPLE_PRACTICE_ID;
    else process.env.AFFINITY_EXAMPLE_PRACTICE_ID = previousPractice;
  }
});
