import { expect, test } from "bun:test";
import { Affinity, AffinityError } from "../src";
function fixture(subjectType = "platform", maxNetworkRetries = 0) {
  const requests: { url: URL; method: string; headers: Headers; body: any }[] = [];
  let fail = false;
  const api = new Affinity("test-key", {
    baseUrl: "https://api.example.test",
    maxNetworkRetries,
    fetch: async (input, init) => {
      const url = new URL(String(input)),
        headers = new Headers(init?.headers),
        body = init?.body ? JSON.parse(String(init.body)) : undefined;
      requests.push({ url, method: init?.method ?? "GET", headers, body });
      if (url.pathname === "/v1/auth/access")
        return Response.json({
          serviceAccount: {
            subjectType,
            subjectId: subjectType === "practice" ? "prac_a" : "acct_a",
          },
        });
      if (fail) {
        fail = false;
        return Response.json(
          {
            type: "about:blank",
            title: "Rate limited",
            status: 429,
            instance: "/v1",
            code: "rate_limited",
            requestId: "req_a",
            detail: "private",
          },
          { status: 429, headers: { "Retry-After": "0" } },
        );
      }
      if (url.pathname === "/v1/orders/ord_a" && init?.method === "GET")
        return Response.json({ id: "ord_a", practiceId: "prac_a" });
      if (url.pathname.endsWith("/patients") && init?.method === "GET")
        return Response.json({
          data: [{ id: url.searchParams.get("startingAfter") ? "pat_b" : "pat_a" }],
          hasMore: !url.searchParams.get("startingAfter"),
        });
      return Response.json({ id: "pat_a" });
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
test("practice credentials resolve context once and keep params separate", async () => {
  const { api, requests } = fixture("practice");
  const data = { name: { first: "Alex", last: "Example" }, dateOfBirth: "1990-01-01" };
  await api.patients.create(data);
  await api.patients.update("pat_a", { email: null });
  await api.patients.delete("pat_a");
  expect(requests.filter((r) => r.url.pathname === "/v1/auth/access")).toHaveLength(1);
  expect(requests[1]!.url.pathname).toBe("/v1/practices/prac_a/patients");
  expect(requests[1]!.body).toEqual(data);
  expect(requests[2]!.body).toEqual({ email: null });
  expect(requests[3]!.headers.has("Idempotency-Key")).toBe(true);
  expect(new Set(requests.slice(1).map((r) => r.headers.get("Idempotency-Key"))).size).toBe(3);
});
test("scoped clients are isolated and reject conflicting practice IDs", async () => {
  const { api, requests } = fixture();
  const a = api.forPractice("prac_a"),
    b = api.forPractice("prac_b");
  await Promise.all([a.patients.get("pat_a"), b.patients.get("pat_b")]);
  expect(requests.map((r) => r.url.pathname)).toContain("/v1/practices/prac_a/patients/pat_a");
  expect(requests.map((r) => r.url.pathname)).toContain("/v1/practices/prac_b/patients/pat_b");
  await expect(a.patients.get("pat_a", { practiceId: "prac_b" })).rejects.toThrow("Conflicting");
  await expect(api.patients.get("pat_a")).rejects.toThrow("requires practiceId");
  await expect(a.practices.list()).rejects.toThrow("root client");
});
test("important actions require persisted keys before any network request", async () => {
  const { api, requests } = fixture();
  await expect(api.orders.submit("ord_a", {} as any)).rejects.toThrow("persisted");
  expect(requests).toHaveLength(0);
  await api
    .forPractice("prac_a")
    .orders.sign(
      "ord_a",
      {
        prescriber: { id: "prov_a" },
        expectedRevision: "rev_reviewed",
        signatureAttestation: true,
      },
      { idempotencyKey: "job_sign" },
    );
  expect(requests.at(-1)!.body).toEqual({
    practiceId: "prac_a",
    prescriber: { id: "prov_a" },
    expectedRevision: "rev_reviewed",
    signatureAttestation: true,
  });
  expect(requests.at(-1)!.headers.get("Idempotency-Key")).toBe("job_sign");
});
test("iterators load lazily and preserve practice and filters", async () => {
  const { api, requests } = fixture();
  const iterator = api
    .forPractice("prac_a")
    .patients.iterate({ limit: 1, query: "Alex" })
    [Symbol.asyncIterator]();
  expect(requests).toHaveLength(0);
  expect((await iterator.next()).value.id).toBe("pat_a");
  expect(requests).toHaveLength(2);
  expect((await iterator.next()).value.id).toBe("pat_b");
  expect(requests.at(-1)!.url.searchParams.get("query")).toBe("Alex");
  expect((await iterator.next()).done).toBe(true);
});
test("retries reuse the same key and errors expose safe metadata", async () => {
  const { api, requests, fail } = fixture("practice", 1);
  await api.patients.get("pat_a");
  fail();
  await api.patients.update("pat_a", { email: "alex@example.com" });
  const writes = requests.filter((r) => r.method === "PATCH");
  expect(writes).toHaveLength(2);
  expect(writes[0]!.headers.get("Idempotency-Key")).toBe(writes[1]!.headers.get("Idempotency-Key"));
  const f = fixture("practice");
  await f.api.patients.get("pat_a");
  f.fail();
  try {
    await f.api.patients.get("pat_a");
    throw new Error("expected error");
  } catch (e) {
    expect(e).toBeInstanceOf(AffinityError);
    const error = e as AffinityError;
    expect(error.status).toBe(429);
    expect(error.code).toBe("rate_limited");
    expect(error.requestId).toBe("req_a");
    expect(error.retryAfter).toBe(0);
    expect(error.message).not.toContain("private");
  }
});

test("archive alias uses the API inactive status", async () => {
  const { api, requests } = fixture("practice");
  await api.patients.update("pat_a", { status: "archived" });
  expect(requests.at(-1)!.body).toEqual({ status: "inactive" });
});
