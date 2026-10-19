import { expect, test } from "bun:test";
import { Affinity } from "../src";

test("MVP medication lookup sends one request with the current version", async () => {
  const calls: [string, RequestInit | undefined][] = [];
  const api = new Affinity("test", {
    fetch: (async (url, init) => {
      calls.push([String(url), init]);
      return Response.json({ data: [], hasMore: false, nextCursor: null });
    }) as typeof fetch,
  });
  await api.medications.list({ name: "test" });
  expect(calls).toHaveLength(1);
  expect(calls[0][0]).toBe("https://api.affinityrx.com/v1/medications?name=test");
  expect(new Headers(calls[0][1]?.headers).get("Affinity-Version")).toBe("2026-10-20");
  expect("catalog" in api).toBe(false);
  expect("patients" in api).toBe(false);
});
