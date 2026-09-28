import { expect, test } from "bun:test";
import { AffinityApiClient, AffinityApiError } from "../src";

test("generated client sends auth, version, actor, and pagination", async () => {
  const client = new AffinityApiClient({ apiKey: "synthetic-key", affinityVersion: "2026-09-28",
    baseUrl: "https://sdk-test.invalid", fetch: (async (input, init) => {
      const request = new Request(input, init);
      expect(request.headers.get("x-affinity-api-key")).toBe("synthetic-key");
      expect(request.headers.get("Affinity-Version")).toBe("2026-09-28");
      expect(request.headers.get("Affinity-Actor-Id")).toBe("user-synthetic");
      const url = new URL(request.url);
      expect(url.pathname).toBe("/v1/orders");
      expect(url.searchParams.get("startingAfter")).toBe("ord_cursor");
      expect(url.searchParams.get("limit")).toBe("2");
      return Response.json({ data: [], hasMore: false, object: "list", url: "/v1/orders" });
    }) as typeof fetch });
  const page = await client.orders.listOrders({ startingAfter: "ord_cursor", limit: 2, "Affinity-Actor-Id": "user-synthetic" });
  expect(page.data).toEqual([]);
  expect(page.hasMore).toBe(false);
});

test("generated client serializes keyed writes and surfaces API failures", async () => {
  let calls = 0;
  const client = new AffinityApiClient({ apiKey: "synthetic-key", affinityVersion: "2026-09-28",
    baseUrl: "https://sdk-test.invalid", fetch: (async (input, init) => {
      calls++;
      const request = new Request(input, init);
      expect(request.headers.get("Idempotency-Key")).toBe("stable-key");
      expect(await request.json()).toEqual({ practiceId: "prac_synthetic", prescriptions: [] });
      return Response.json({ detail: "Synthetic validation failure" }, { status: 503 });
    }) as typeof fetch });
  await expect(Promise.resolve(client.orders.createOrder({ "Idempotency-Key": "stable-key", practiceId: "prac_synthetic", prescriptions: [] }))).rejects.toBeInstanceOf(AffinityApiError);
  expect(calls).toBe(1);
});
