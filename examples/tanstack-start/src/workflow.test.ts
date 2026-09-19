import { expect, test } from "bun:test";
import { client, practices } from "./workflow.server";

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
        return Response.json({
          livemode,
          apiKey: {},
          serviceAccount: { subjectType: "platform" },
          scopes: [],
        });
      }) as typeof fetch;
      if (livemode === false) expect((await client()).affinity).toBeDefined();
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

test("Live directory requires the same platform and only practices:read", async () => {
  const previousKey = process.env.AFFINITY_EXAMPLE_API_KEY;
  const previousDirectory = process.env.AFFINITY_EXAMPLE_DIRECTORY_KEY;
  const originalFetch = globalThis.fetch;
  try {
    process.env.AFFINITY_EXAMPLE_API_KEY = "test-fixture-key";
    process.env.AFFINITY_EXAMPLE_DIRECTORY_KEY = "directory-fixture-key";
    for (const variant of ["other-platform", "write-scope", "valid"] as const) {
      const paths: string[] = [];
      globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
        const path = String(input);
        paths.push(path);
        const live =
          new Headers(init?.headers).get("authorization") === "Bearer directory-fixture-key";
        if (path.endsWith("/v1/auth/access"))
          return Response.json({
            livemode: live,
            apiKey: {},
            scopes:
              live && variant === "write-scope"
                ? ["practices:read", "orders:write"]
                : ["practices:read"],
            serviceAccount: {
              subjectType: "platform",
              subjectId: live && variant === "other-platform" ? "other" : "same",
            },
          });
        return Response.json({ object: "list", hasMore: false, data: [] });
      }) as typeof fetch;
      if (variant === "valid") expect((await practices(undefined, "live")).data).toEqual([]);
      else {
        await expect(practices(undefined, "live")).rejects.toThrow("Directory key must");
        expect(paths.some((path) => path.includes("/v1/practices"))).toBe(false);
      }
    }
  } finally {
    globalThis.fetch = originalFetch;
    if (previousKey === undefined) delete process.env.AFFINITY_EXAMPLE_API_KEY;
    else process.env.AFFINITY_EXAMPLE_API_KEY = previousKey;
    if (previousDirectory === undefined) delete process.env.AFFINITY_EXAMPLE_DIRECTORY_KEY;
    else process.env.AFFINITY_EXAMPLE_DIRECTORY_KEY = previousDirectory;
  }
});
