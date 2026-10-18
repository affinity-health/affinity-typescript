import { expect, test } from "bun:test";
import {
  Affinity,
  AffinityError,
  AffinityInvalidRequestError,
  AffinityNotFoundError,
  type OrderCreateParams,
} from "../src";

function fixture(maxNetworkRetries = 0) {
  const requests: { url: URL; method: string; headers: Headers; body: unknown }[] = [];
  let fail = false;
  const api = new Affinity("synthetic-test-key", {
    baseUrl: "https://api.example.test",
    maxNetworkRetries,
    fetch: async (input, init) => {
      const url = new URL(String(input));
      requests.push({
        url,
        method: init?.method ?? "GET",
        headers: new Headers(init?.headers),
        body: init?.body ? JSON.parse(String(init.body)) : undefined,
      });
      if (fail) {
        fail = false;
        return Response.json(
          {
            type: "about:blank",
            instance: "/v1/orders",
            title: "Rate limited",
            status: 429,
            code: "rate_limited",
            requestId: "req_a",
            detail: "private",
          },
          { status: 429, headers: { "Retry-After": "0" } },
        );
      }
      if (url.pathname === "/v1/orders" && init?.method === "GET")
        return Response.json({
          object: "list",
          url: url.pathname,
          data: [{ id: url.searchParams.has("startingAfter") ? "ord_b" : "ord_a" }],
          hasMore: !url.searchParams.has("startingAfter"),
          nextCursor: url.searchParams.has("startingAfter") ? null : "opaque:cursor+token=",
        });
      return Response.json({ id: "ord_a" });
    },
  });
  return {
    api,
    requests,
    fail: () => {
      fail = true;
    },
  };
}
export const reviewed: OrderCreateParams = {
  practiceId: "prac_synthetic",
  prescriber: { npi: "1234567893", firstName: "Sam", lastName: "Example" },
  signatureAttestation: true,
  shippingOptionId: "shp_synthetic",
  patient: {
    firstName: "Synthetic",
    lastName: "Patient",
    dateOfBirth: "1990-01-01",
    gender: "unknown",
    phone: "+12025550199",
    email: "patient@example.test",
    allergies: [],
    address: {
      line1: "100 Test St",
      line2: null,
      city: "Austin",
      state: "TX",
      postalCode: "78701",
    },
  },
  prescriptions: [
    { medicationId: "med_synthetic", quantity: 1, refills: 0, directions: "Use as reviewed" },
  ],
};
test("order creation sends the complete reviewed body and persisted key in one request", async () => {
  const { api, requests } = fixture();
  await api.orders.create(reviewed, { idempotencyKey: "saved-job" });
  expect(requests).toHaveLength(1);
  expect(requests[0]!.url.pathname).toBe("/v1/orders");
  expect(requests[0]!.body).toEqual(reviewed);
  expect(requests[0]!.headers.get("Idempotency-Key")).toBe("saved-job");
  expect(requests[0]!.headers.get("Affinity-Version")).toBe("2026-10-20");
  expect(requests[0]!.headers.has("Affinity-Actor-Id")).toBe(false);
});
test("consequential creates require persisted printable keys before any request", async () => {
  const { api, requests } = fixture();
  for (const key of [undefined, "", "bad\nkey", "has space", "x".repeat(256)]) {
    await expect(api.orders.create(reviewed, { idempotencyKey: key as string })).rejects.toThrow(
      "persisted",
    );
    await expect(
      api.practices.create({ name: "Synthetic" }, { idempotencyKey: key as string }),
    ).rejects.toThrow("persisted");
  }
  expect(requests).toHaveLength(0);
});
test("iterators load lazily, preserve filters and pass opaque nextCursor unchanged", async () => {
  const { api, requests } = fixture();
  const iterator = api.orders
    .iterate({ practiceId: "prac_a", query: "Alex", limit: 1 })
    [Symbol.asyncIterator]();
  expect(requests).toHaveLength(0);
  expect((await iterator.next()).value.id).toBe("ord_a");
  expect(requests).toHaveLength(1);
  expect(requests[0]!.url.searchParams.get("limit")).toBe("1");
  expect((await iterator.next()).value.id).toBe("ord_b");
  expect(requests[1]!.url.searchParams.get("startingAfter")).toBe("opaque:cursor+token=");
  expect(requests[1]!.url.searchParams.get("practiceId")).toBe("prac_a");
  expect(requests[1]!.url.searchParams.get("query")).toBe("Alex");
  expect((await iterator.next()).done).toBe(true);
  await expect(
    api.orders.iterate({ endingBefore: "previous" })[Symbol.asyncIterator]().next(),
  ).rejects.toThrow("forward pagination");
});
test("iterators reject a nonadvancing server cursor", async () => {
  const api = new Affinity("synthetic", {
    fetch: async () => Response.json({ data: [], hasMore: true, nextCursor: "same" }),
  });
  await expect(
    api.orders.iterate({ startingAfter: "same" })[Symbol.asyncIterator]().next(),
  ).rejects.toThrow("did not advance");
});
test("retries reuse the caller's key; unkeyed cancellation is not retried", async () => {
  const { api, requests, fail } = fixture(1);
  fail();
  await api.orders.create(reviewed, { idempotencyKey: "saved-job" });
  expect(requests).toHaveLength(2);
  expect(requests.map((r) => r.headers.get("Idempotency-Key"))).toEqual(["saved-job", "saved-job"]);
  fail();
  await expect(api.orders.cancel("ord_a")).rejects.toBeInstanceOf(AffinityError);
  expect(requests).toHaveLength(3);
});
test("errors expose safe metadata and withhold private detail from messages", async () => {
  const { api, fail } = fixture();
  fail();
  const error = await api.orders.get("ord_a").catch((e) => e);
  expect(error).toBeInstanceOf(AffinityError);
  expect(error.status).toBe(429);
  expect(error.code).toBe("rate_limited");
  expect(error.requestId).toBe("req_a");
  expect(error.retryAfter).toBe(0);
  expect(error.message).not.toContain("private");
  expect(error.problem.detail).toBe("private");
});
test("network failures, timeouts and 404s retain typed errors", async () => {
  const offline = new Affinity("synthetic", {
    fetch: async () => {
      throw new TypeError("fetch failed");
    },
  });
  await expect(offline.account.get()).rejects.toMatchObject({
    name: "AffinityConnectionError",
    code: "connection_error",
    retryable: true,
  });
  const timeout = new Affinity("synthetic", {
    timeout: 5,
    fetch: async () => new Promise<Response>(() => {}),
  });
  await expect(timeout.account.get()).rejects.toMatchObject({ name: "AffinityConnectionError" });
  const missing = new Affinity("synthetic", {
    fetch: async () =>
      new Response("gateway", { status: 404, headers: { "x-request-id": "req_gateway" } }),
  });
  const error = await missing.account.get().catch((e) => e);
  expect(error).toBeInstanceOf(AffinityNotFoundError);
  expect(error).toBeInstanceOf(AffinityInvalidRequestError);
  expect(error.requestId).toBe("req_gateway");
});
test("caller cancellation reaches the transport and makes no request when already aborted", async () => {
  const { api, requests } = fixture();
  const controller = new AbortController();
  controller.abort(new DOMException("Cancelled", "AbortError"));
  await expect(api.orders.get("ord_a", { signal: controller.signal })).rejects.toMatchObject({
    name: "AbortError",
  });
  expect(requests).toHaveLength(0);
});
