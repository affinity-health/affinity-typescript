import { expect, test } from "bun:test";
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
  expect(new Headers(calls[0].headers).get("User-Agent")).toBe("affinity-typescript/2.0.0-beta.1");
  await expect(api.orders.create(order, {} as any)).rejects.toThrow("persisted idempotencyKey");
  expect(calls).toHaveLength(1);
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
test("unkeyed cancel is never retried", async () => {
  let calls = 0;
  const api = new Affinity("test", {
    maxNetworkRetries: 1,
    fetch: (async () => {
      calls++;
      throw new TypeError("offline");
    }) as typeof fetch,
  });
  await expect(api.orders.cancel("ord_test")).rejects.toBeInstanceOf(AffinityConnectionError);
  expect(calls).toBe(1);
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
