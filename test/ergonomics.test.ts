import { expect, test } from "bun:test";
import { Affinity } from "../src";
import { createTransport } from "../src/resources/transport";
import { paginate } from "../src/resources/pagination";
import { generatorContract } from "../scripts/generator-contract";

const practice = {
  id: "prac_example",
  liveEnabled: false,
  livemode: true,
  prescribers: [],
  contacts: { primary: null, compliance: null },
  metadata: {},
};
test("practice writes omit idempotency by default and serialize explicit Live changes", async () => {
  const requests: Request[] = [];
  const affinity = new Affinity("test", {
    fetch: async (url, init) => {
      requests.push(new Request(url, init));
      return Response.json(practice);
    },
  });
  const created = await affinity.practices.create({
    name: "Example",
    address: {
      city: "Austin",
      country: "US",
      line1: "1 Test St",
      state: "TX",
      postalCode: "78701",
    },
    attestations: {
      authorizedPracticeRelationship: true,
      authorizedPhiTransfer: true,
      minimumNecessaryPhi: true,
      providerDataAccuracy: true,
    },
  });
  expect(created.id).toBe(practice.id);
  expect(requests[0]!.headers.has("Idempotency-Key")).toBe(false);
  await affinity.practices.update(created.id, { liveEnabled: false });
  expect(await requests[1]!.json()).toEqual({ liveEnabled: false });
  await affinity.practices.update(
    created.id,
    { liveEnabled: true },
    { idempotencyKey: "retry-operation" },
  );
  expect(requests[2]!.headers.get("Idempotency-Key")).toBe("retry-operation");
  expect(await requests[2]!.json()).toEqual({ liveEnabled: true });
});

test("list facade iterates real cursor requests and retains filters", async () => {
  const urls: URL[] = [];
  const affinity = new Affinity("test", {
    fetch: async (url) => {
      const parsed = new URL(String(url));
      urls.push(parsed);
      return Response.json({
        object: "list",
        data: [{ ...practice, id: urls.length === 1 ? "first" : "second" }],
        hasMore: urls.length === 1,
        url: "/v1/practices",
      });
    },
  });
  const list = affinity.practices.list({ search: "Example", limit: 1 });
  expect((await list).data[0]!.id).toBe("first");
  const ids: string[] = [];
  for await (const item of list) ids.push(item.id);
  expect(ids).toEqual(["first", "second"]);
  expect(urls).toHaveLength(2);
  expect(urls[1]!.searchParams.get("startingAfter")).toBe("first");
  expect(urls[1]!.searchParams.get("search")).toBe("Example");
});

test("pagination is bounded, reverses backward pages, and detects stalled cursors", async () => {
  let calls = 0;
  const page = () => {
    calls++;
    return Promise.resolve({ data: [{ id: "a" }, { id: "b" }], hasMore: true });
  };
  expect(await paginate(page, {}).autoPagingToArray({ limit: 1 })).toEqual([{ id: "a" }]);
  expect(calls).toBe(1);
  expect(await paginate(page, { endingBefore: "c" }).autoPagingToArray({ limit: 2 })).toEqual([
    { id: "b" },
    { id: "a" },
  ]);
  await expect(paginate(page, {}).autoPagingToArray({ limit: 9 })).rejects.toThrow(
    "did not advance",
  );
  await expect(paginate(page, {}).autoPagingToArray({ limit: 0 })).rejects.toThrow(
    "positive integer",
  );
});

test("retries reads and keyed writes but never an unkeyed mutation", async () => {
  for (const [method, key, expected] of [
    ["GET", false, 2],
    ["PATCH", true, 2],
    ["POST", false, 1],
  ] as const) {
    let attempts = 0;
    const transport = createTransport(
      async () => {
        attempts++;
        return Response.json({}, { status: attempts === 1 ? 503 : 200 });
      },
      { maxNetworkRetries: 1 },
    );
    const response = await transport("https://example.test", {
      method,
      headers: key ? { "Idempotency-Key": "same-operation" } : {},
    });
    expect(attempts).toBe(expected);
    expect(response.status).toBe(expected === 1 ? 503 : 200);
  }
});

test("does not retry authorization failures and honors disabled retries", async () => {
  for (const [status, retries] of [
    [403, 2],
    [503, 0],
  ] as const) {
    let attempts = 0;
    const transport = createTransport(
      async () => {
        attempts++;
        return new Response(null, { status });
      },
      { maxNetworkRetries: retries },
    );
    expect((await transport("https://example.test")).status).toBe(status);
    expect(attempts).toBe(1);
  }
});

test("timeout aborts pending transport and caller cancellation stops retries", async () => {
  let attempts = 0;
  const fetcher: typeof fetch = async (_input, init) => {
    attempts++;
    return new Promise((_resolve, reject) => {
      init?.signal?.addEventListener("abort", () => reject(init.signal?.reason), { once: true });
    });
  };
  const transport = createTransport(fetcher, { timeout: 10, maxNetworkRetries: 0 });
  await expect(transport("https://example.test")).rejects.toThrow("timed out");
  const controller = new AbortController();
  const pending = createTransport(fetcher, { timeout: 1000 })("https://example.test", {
    signal: controller.signal,
  });
  controller.abort(new Error("Canceled by caller"));
  await expect(pending).rejects.toThrow("Canceled by caller");
  expect(attempts).toBe(2);
});

test("generator preserves explicit nullability without making ordinary IDs nullable", () => {
  const normalized = generatorContract({
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "string" },
      legalName: { anyOf: [{ anyOf: [{ type: "string" }, { type: "null" }] }, { type: "null" }] },
      version: { type: "integer", allOf: [{ minimum: 1 }] },
    },
  });
  expect(normalized.properties.id).toEqual({ type: "string" });
  expect(normalized.properties.legalName).toEqual({ type: "string", nullable: true });
  expect(normalized.properties.version).toEqual({ type: "integer", minimum: 1 });
});

test("required endpoint generates one key per call and preserves it across retries", async () => {
  const keys: string[] = [];
  const affinity = new Affinity("test", {
    maxNetworkRetries: 1,
    fetch: async (_url, init) => {
      keys.push(new Headers(init?.headers).get("Idempotency-Key")!);
      return Response.json(
        {
          id: "patient",
          externalIdentities: [],
          addresses: [],
          allergies: [],
          allergySummary: [],
          encounters: [],
          measurements: [],
          programs: [],
        },
        { status: keys.length === 1 ? 503 : 200 },
      );
    },
  });
  await affinity.patients.create("practice", {
    name: { first: "Synthetic", last: "Patient" },
    dateOfBirth: "1990-01-01",
  });
  await affinity.patients.create("practice", {
    name: { first: "Synthetic", last: "Patient" },
    dateOfBirth: "1990-01-01",
  });
  expect(keys[0]).toMatch(/^[0-9a-f-]{36}$/);
  expect(keys[1]).toBe(keys[0]);
  expect(keys[2]).not.toBe(keys[0]);
});

test("timeout includes a stalled response body", async () => {
  const transport = createTransport(async () => new Response(new ReadableStream()), {
    timeout: 10,
    maxNetworkRetries: 0,
  });
  await expect(transport("https://example.test")).rejects.toThrow("timed out");
});

test("cancellation during retry delay prevents another attempt", async () => {
  let attempts = 0;
  const controller = new AbortController();
  const transport = createTransport(async () => {
    attempts++;
    return new Response(null, { status: 503, headers: { "Retry-After": "30" } });
  }, {});
  const request = transport("https://example.test", { signal: controller.signal });
  setTimeout(() => controller.abort(new Error("Stop retrying")), 10);
  await expect(request).rejects.toThrow("Stop retrying");
  expect(attempts).toBe(1);
});
