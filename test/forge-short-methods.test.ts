import { expect, test } from "bun:test";
import { AffinityApiClient, AffinityApiError } from "../src/index";

test("generated client sends auth, version, actor, and pagination", async () => {
  const client = new AffinityApiClient({
    apiKey: "synthetic-key",
    affinityVersion: "2026-09-28",
    baseUrl: "https://sdk-test.invalid",
    maxRetries: 0,
    fetch: (async (input, init) => {
      const request = new Request(input, init);
      expect(request.headers.get("x-affinity-api-key")).toBe("synthetic-key");
      expect(request.headers.get("Affinity-Version")).toBe("2026-09-28");
      expect(request.headers.get("Affinity-Actor-Id")).toBe("user-synthetic");
      const url = new URL(request.url);
      expect(url.pathname).toBe("/v1/orders");
      expect(url.searchParams.get("startingAfter")).toBe("ord_cursor");
      expect(url.searchParams.get("limit")).toBe("2");
      return Response.json({ data: [], hasMore: false, object: "list", url: "/v1/orders" });
    }) as typeof fetch,
  });
  const page = await client.orders.list({
    startingAfter: "ord_cursor",
    limit: 2,
    "Affinity-Actor-Id": "user-synthetic",
  });
  expect(page.data).toEqual([]);
  expect(page.hasMore).toBe(false);
});

test("generated client serializes keyed writes and surfaces API failures", async () => {
  let calls = 0;
  const client = new AffinityApiClient({
    apiKey: "synthetic-key",
    affinityVersion: "2026-09-28",
    baseUrl: "https://sdk-test.invalid",
    maxRetries: 0,
    fetch: (async (input, init) => {
      calls++;
      const request = new Request(input, init);
      expect(request.headers.get("Idempotency-Key")).toBe("stable-key");
      expect(await request.json()).toEqual({ practiceId: "prac_synthetic", prescriptions: [] });
      return Response.json({ detail: "Synthetic validation failure" }, { status: 503 });
    }) as typeof fetch,
  });
  await expect(
    Promise.resolve(
      client.orders.create({
        "Idempotency-Key": "stable-key",
        practiceId: "prac_synthetic",
        prescriptions: [],
      }),
    ),
  ).rejects.toBeInstanceOf(AffinityApiError);
  expect(calls).toBe(1);
});

test("routine keys are fresh per call and stable across retries; signing preserves caller key", async () => {
  const keys: string[] = [];
  const bodies: unknown[] = [];
  const client = new AffinityApiClient({
    apiKey: "synthetic-key",
    baseUrl: "https://sdk-test.invalid",
    maxRetries: 1,
    fetch: (async (input, init) => {
      const request = new Request(input, init);
      keys.push(request.headers.get("Idempotency-Key")!);
      bodies.push(await request.json());
      return Response.json(
        { detail: "Synthetic failure" },
        { status: 503, headers: { "Retry-After": "0" } },
      );
    }) as typeof fetch,
  });
  const patient = {
    practiceId: "prac_synthetic",
    name: { first: "Alex", last: "Example" },
    dateOfBirth: "1990-01-01",
  };
  await expect(Promise.resolve(client.patients.create(patient))).rejects.toBeInstanceOf(
    AffinityApiError,
  );
  await expect(Promise.resolve(client.patients.create(patient))).rejects.toBeInstanceOf(
    AffinityApiError,
  );
  expect(keys).toHaveLength(4);
  expect(keys[0]).toMatch(/^[0-9a-f-]{36}$/);
  expect(keys[0]).toBe(keys[1]);
  expect(keys[2]).toBe(keys[3]);
  expect(keys[0]).not.toBe(keys[2]);
  expect(bodies[0]).toEqual(bodies[1]);
  await expect(
    Promise.resolve(
      client.patients.update({
        practiceId: "prac_synthetic",
        patientId: "pat_synthetic",
        email: "alex@example.com",
        "Idempotency-Key": "explicit-edit",
      }),
    ),
  ).rejects.toBeInstanceOf(AffinityApiError);
  expect(keys.slice(4)).toEqual(["explicit-edit", "explicit-edit"]);
  await expect(
    Promise.resolve(
      client.orders.sign({
        orderId: "ord_synthetic",
        practiceId: "prac_synthetic",
        signatureAttestation: true,
        expectedRevision: "reviewed-revision",
        "Idempotency-Key": "sign-job-1",
      }),
    ),
  ).rejects.toBeInstanceOf(AffinityApiError);
  expect(keys.slice(6)).toEqual(["sign-job-1", "sign-job-1"]);
  expect(bodies[6]).toEqual(bodies[7]);
});
