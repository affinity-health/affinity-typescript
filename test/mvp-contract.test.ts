import { expect, test } from "bun:test";
import { Affinity } from "../src";

test("MVP medications send the current version without retired access requests", async () => {
  const requests: { path: string; version: string | null }[] = [];
  const api = new Affinity("synthetic-test-key", {
    fetch: async (input, init) => {
      requests.push({
        path: new URL(String(input)).pathname,
        version: new Headers(init?.headers).get("Affinity-Version"),
      });
      return Response.json({
        object: "list",
        url: "/v1/medications",
        data: [],
        hasMore: false,
        nextCursor: null,
      });
    },
  });
  await api.medications.list({ query: "synthetic" });
  expect(requests).toEqual([{ path: "/v1/medications", version: "2026-10-20" }]);
});
