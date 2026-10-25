import { expect, test } from "bun:test";
import { version } from "../package.json";
import {
  Affinity,
  AffinityConnectionError,
  AffinityNotFoundError,
  type OrderCreateParams,
} from "../src";

const order: OrderCreateParams = {
  practiceId: "prac_test",
  patient: {
    firstName: "Test",
    lastName: "Example",
    dateOfBirth: "1990-01-01",
    gender: "female",
    phone: "+15555550100",
    email: "test@example.test",
    address: { line1: "1 Test St", city: "Austin", state: "TX", postalCode: "78701" },
    allergies: [],
  },
  prescriber: { firstName: "Test", lastName: "Prescriber", npi: "1234567893" },
  prescriptions: [
    { medicationId: "med_test", quantity: 1, refills: 0, directions: "Use as directed" },
  ],
  shippingOptionId: "shp_test",
  signatureAttestation: true,
};

test("order creation sends the flat MVP body and caller-owned idempotency key without access preflight", async () => {
  const calls: RequestInit[] = [];
  const api = new Affinity("test", {
    fetch: (async (_url, init) => {
      calls.push(init!);
      return Response.json({ id: "ord_test" });
    }) as typeof fetch,
  });
  await api.orders.create(order, { idempotencyKey: "job-1" });
  expect(calls).toHaveLength(1);
  expect(JSON.parse(String(calls[0].body))).toEqual(order);
  expect(new Headers(calls[0].headers).get("Idempotency-Key")).toBe("job-1");
  expect(new Headers(calls[0].headers).get("User-Agent")).toBe(`affinity-typescript/${version}`);
});
test("safe retries preserve the order body and persisted key", async () => {
  const calls: RequestInit[] = [];
  const api = new Affinity("test", {
    maxNetworkRetries: 1,
    fetch: (async (_url, init) => {
      calls.push(init!);
      if (calls.length === 1) throw new TypeError("offline");
      return Response.json({ id: "ord_test" });
    }) as typeof fetch,
  });
  await api.orders.create(order, { idempotencyKey: "same-job" });
  expect(calls).toHaveLength(2);
  expect(calls[0].body).toBe(calls[1].body);
  expect(new Headers(calls[1].headers).get("Idempotency-Key")).toBe("same-job");
});
for (const [name, path, invoke] of [
  [
    "cancel order",
    "/v1/orders/ord_test/cancel",
    (api: Affinity, options?: { idempotencyKey: string }) => api.orders.cancel("ord_test", options),
  ],
  [
    "create webhook endpoint",
    "/v1/webhook-endpoints",
    (api: Affinity, options?: { idempotencyKey: string }) =>
      api.webhooks.create({ url: "https://example.test/webhook" }, options),
  ],
] as const) {
  test(`${name} generates a per-call key, preserves it on retries, and accepts caller keys`, async () => {
    const calls: { path: string; key: string | null; body: unknown }[] = [];
    const api = new Affinity("test", {
      maxNetworkRetries: 1,
      fetch: (async (url, init) => {
        calls.push({
          path: new URL(String(url)).pathname,
          key: new Headers(init?.headers).get("Idempotency-Key"),
          body: init?.body,
        });
        // Fail the first attempt of every call, exercising the real retry transport.
        if (calls.length % 2 === 1) return Response.json({}, { status: 503 });
        return Response.json({ id: "synthetic" });
      }) as typeof fetch,
    });
    await invoke(api);
    await invoke(api);
    await invoke(api, { idempotencyKey: "caller-key/unchanged:123" });
    expect(calls).toHaveLength(6);
    expect(calls.map((call) => call.path)).toEqual(Array(6).fill(path));
    expect(calls[0].key).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
    expect(calls[1]).toEqual(calls[0]);
    expect(calls[2].key).toBeTruthy();
    expect(calls[2].key).not.toBe(calls[0].key);
    expect(calls[3]).toEqual(calls[2]);
    expect(calls[4].key).toBe("caller-key/unchanged:123");
    expect(calls[5]).toEqual(calls[4]);
  });
}

test("invalid caller keys fail locally and reads stay unkeyed", async () => {
  const keys: (string | null)[] = [];
  const api = new Affinity("test", {
    fetch: (async (_url, init) => {
      keys.push(new Headers(init?.headers).get("Idempotency-Key"));
      return Response.json({});
    }) as typeof fetch,
  });
  for (const key of ["", "has space", "x".repeat(256)])
    await expect(api.orders.cancel("ord_test", { idempotencyKey: key })).rejects.toThrow(
      "printable ASCII",
    );
  await api.orders.get("ord_test");
  expect(keys).toEqual([null]);
});
test("network failures and timeouts are typed, while caller cancellation stays intact", async () => {
  const failure = new TypeError("offline");
  const api = new Affinity("test", {
    fetch: (async () => {
      throw failure;
    }) as typeof fetch,
  });
  await expect(api.medications.list()).rejects.toBeInstanceOf(AffinityConnectionError);
  const slow = new Affinity("test", {
    timeout: 5,
    fetch: (() => new Promise(() => {})) as typeof fetch,
  });
  await expect(slow.medications.list()).rejects.toBeInstanceOf(AffinityConnectionError);
  const c = new AbortController();
  const reason = new DOMException("cancelled", "AbortError");
  c.abort(reason);
  await expect(api.medications.list({}, { signal: c.signal })).rejects.toBe(reason);
});
test("404 and request-id header fallback survive non-JSON errors without exposing detail", async () => {
  const api = new Affinity("test", {
    fetch: (async () =>
      new Response("private data", {
        status: 404,
        headers: { "X-Request-Id": "req_test" },
      })) as typeof fetch,
  });
  try {
    await api.orders.get("ord_test");
    throw new Error("expected failure");
  } catch (error) {
    expect(error).toBeInstanceOf(AffinityNotFoundError);
    expect((error as AffinityNotFoundError).requestId).toBe("req_test");
    expect(String(error)).not.toContain("private data");
  }
});
test("iterators follow server nextCursor and preserve list filters", async () => {
  const calls: URL[] = [];
  const api = new Affinity("test", {
    fetch: (async (url) => {
      calls.push(new URL(String(url)));
      return Response.json(
        calls.length === 1
          ? { data: [{ id: "med_1" }], hasMore: true, nextCursor: "opaque_cursor" }
          : { data: [{ id: "med_2" }], hasMore: false, nextCursor: null },
      );
    }) as typeof fetch,
  });
  const rows = [];
  for await (const m of api.medications.iterate({ name: "test" })) rows.push(m.id);
  expect(rows).toEqual(["med_1", "med_2"]);
  expect(calls[1].searchParams.get("startingAfter")).toBe("opaque_cursor");
  expect(calls[1].searchParams.get("name")).toBe("test");
});
test("all generated methods dispatch to contract paths with encoded IDs", async () => {
  const calls: string[] = [];
  const api = new Affinity("test", {
    fetch: (async (url) => {
      calls.push(String(url));
      return Response.json({});
    }) as typeof fetch,
  });
  await api.practices.get("prac_/one");
  await api.webhooks.remove("whe_/one");
  expect(calls).toEqual([
    "https://api.affinityrx.com/v1/practices/prac_%2Fone",
    "https://api.affinityrx.com/v1/webhook-endpoints/whe_%2Fone",
  ]);
});

test("local serialization errors retain their cause and never reach the network", async () => {
  let calls = 0;
  const api = new Affinity("test", {
    maxNetworkRetries: 1,
    fetch: (async () => {
      calls++;
      return Response.json({ id: "ord_test" });
    }) as typeof fetch,
  });
  const reason = new Error("Synthetic serializer failure");
  const patient = {
    ...order.patient,
    toJSON() {
      throw reason;
    },
  };
  await expect(
    api.orders.create({ ...order, patient }, { idempotencyKey: "serialization-job" }),
  ).rejects.toBe(reason);
  expect(calls).toBe(0);
});

test("cyclic request data fails locally instead of reporting a retryable connection error", async () => {
  let calls = 0;
  const api = new Affinity("test", {
    fetch: (async () => {
      calls++;
      return Response.json({});
    }) as typeof fetch,
  });
  const patient = { ...order.patient };
  Object.assign(patient, { cycle: patient });
  const error = await api.orders
    .create({ ...order, patient }, { idempotencyKey: "cyclic-job" })
    .catch((error: unknown) => error);
  expect(error).toBeInstanceOf(TypeError);
  expect(error).not.toBeInstanceOf(AffinityConnectionError);
  expect(calls).toBe(0);
});

test("order creation generates a fresh key per call and reuses it for automatic retries", async () => {
  const keys: string[] = [];
  const api = new Affinity("test", {
    maxNetworkRetries: 1,
    fetch: (async (_url, init) => {
      keys.push(new Headers(init?.headers).get("Idempotency-Key")!);
      if (keys.length === 1) return new Response(null, { status: 503 });
      return Response.json({ id: "ord_test" });
    }) as typeof fetch,
  });
  await api.orders.create(order);
  await api.orders.create(order, {});
  expect(keys).toHaveLength(3);
  expect(keys[0]).toMatch(/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/);
  expect(keys[1]).toBe(keys[0]);
  expect(keys[2]).not.toBe(keys[0]);
});

test("retrying after a lost order response replays one order with the persisted key", async () => {
  const orders = new Map<string, { id: string }>();
  const keys: string[] = [];
  const api = new Affinity("test", {
    timeout: 5,
    fetch: (async (_url, init) => {
      const key = new Headers(init?.headers).get("Idempotency-Key")!;
      keys.push(key);
      if (!orders.has(key)) orders.set(key, { id: `ord_${orders.size + 1}` });
      if (keys.length === 1) return new Promise(() => {});
      return Response.json(orders.get(key));
    }) as typeof fetch,
  });
  const options = { idempotencyKey: "persisted-review-42" };
  await expect(api.orders.create(order, options)).rejects.toBeInstanceOf(AffinityConnectionError);
  expect(await api.orders.create(order, options)).toEqual({ id: "ord_1" });
  expect(orders.size).toBe(1);
  expect(keys).toEqual([options.idempotencyKey, options.idempotencyKey]);
});
