import { describe, expect, test } from "bun:test";
import { Affinity } from "../src";

describe("Affinity client", () => {
  test("uses the production API, dated contract, and bearer key by default", async () => {
    let request: Request | undefined;
    const affinity = new Affinity("sk_test_example", {
      fetch: async (input, init) => {
        request = new Request(input, init);
        return Response.json({ apiKey: {}, livemode: false, scopes: [], serviceAccount: {} });
      },
    });

    await affinity.account.retrieveAccess();

    expect(request?.url).toBe("https://api.joinaffinityai.com/v1/auth/access");
    expect(request?.headers.get("authorization")).toBe("Bearer sk_test_example");
    expect(request?.headers.get("affinity-version")).toBe("2026-07-09");
  });

  test("retries safe reads and preserves list filters", async () => {
    const requests: Request[] = [];
    const affinity = new Affinity("sk_test_example", {
      fetch: async (input, init) => {
        requests.push(new Request(input, init));
        if (requests.length === 1) return new Response(null, { status: 503 });
        return Response.json({ items: [] });
      },
      maxRetries: 1,
    });

    await affinity.catalog.list({ limit: 10, query: "semaglutide", route: "injectable" });

    expect(requests).toHaveLength(2);
    expect(requests[1]?.url).toContain("limit=10");
    expect(requests[1]?.url).toContain("query=semaglutide");
    expect(requests[1]?.url).toContain("route=injectable");
  });

  test("validates retry and timeout options", () => {
    expect(() => new Affinity("sk_test_example", { maxRetries: -1 })).toThrow();
    expect(() => new Affinity("sk_test_example", { timeout: 0 })).toThrow();
  });
});
