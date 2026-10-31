// The generated client's behavior on the wire, against a recorded fetch: headers, paths, query
// encoding, bodies, retries, errors and pagination. Synthetic data only.
import { describe, expect, test } from "bun:test";
import { Affinity, AffinityClient, AffinityEnvironment, AffinityError } from "../src";

type Call = { method: string; url: URL; headers: Headers; body: unknown };

/** A client whose fetch answers from `replies` in order and records every request. */
function recorded(
  replies: (Response | ((call: Call) => Response))[],
  options: Partial<AffinityClient.Options> = {},
) {
  const calls: Call[] = [];
  const fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    // Like the real fetch, an aborted signal rejects before anything is sent.
    if (init?.signal?.aborted) throw init.signal.reason;
    const request = new Request(input, init);
    const text = await request.text();
    const call = {
      method: request.method,
      url: new URL(request.url),
      headers: request.headers,
      body: text ? JSON.parse(text) : undefined,
    };
    calls.push(call);
    const reply = replies.shift();
    if (!reply) throw new Error(`Unexpected request ${call.method} ${call.url}`);
    return typeof reply === "function" ? reply(call) : reply;
  }) as typeof globalThis.fetch;
  const client = new AffinityClient({ token: "sk_test_synthetic", fetch, ...options });
  return { client, calls };
}
/** The error a call rejects with; fails the test if it resolves. */
const rejection = (call: PromiseLike<unknown>) =>
  Promise.resolve(call).then(
    () => {
      throw new Error("resolved");
    },
    (error: unknown) => error,
  );
const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": status < 300 ? "application/json" : "application/problem+json",
      ...headers,
    },
  });
const problem = (status: number, code: string, issues?: unknown[]) =>
  json(
    {
      type: "https://docs.affinityrx.com/errors",
      title: code,
      status,
      code,
      detail: `${code} detail`,
      instance: "/v1",
      requestId: "req_synthetic",
      ...(issues ? { issues } : {}),
    },
    status,
  );

const id = (prefix: string, n = 1) => `${prefix}_${String(n).padStart(26, "0")}`;
const order: Affinity.OrderInput = {
  idempotencyKey: "order-key-saved-with-the-reviewed-order",
  patient: {
    externalId: "emr-patient-1",
    firstName: "Test",
    lastName: "Patient",
    dateOfBirth: "1990-01-01",
    sex: "female",
    email: "test.patient@example.test",
    phone: "+15125550101",
    allergies: [],
    address: { line1: "200 Example Ave", city: "Austin", state: "TX", postalCode: "78701" },
  },
  practiceId: id("prac"),
  prescriber: { npi: "1234567893", firstName: "Sam", lastName: "Lee" },
  prescriptions: [
    { medicationId: id("med"), quantity: 1, refills: 0, directions: "Use as directed." },
  ],
  shipping: { optionId: id("shp") },
  signatureAttestation: true,
};

describe("requests", () => {
  test("every request sends the key, the pinned API version and JSON, to production by default", async () => {
    const { client, calls } = recorded([json({ id: id("plat"), type: "platform", mode: "test" })]);
    await client.account.get();
    const [call] = calls;
    expect(call!.url.href).toBe(`${AffinityEnvironment.Default}/v1/account`);
    expect(call!.headers.get("authorization")).toBe("Bearer sk_test_synthetic");
    expect(call!.headers.get("affinity-version")).toBe("2026-10-28");
  });

  test("baseUrl replaces the production URL", async () => {
    const { client, calls } = recorded([json({})], { baseUrl: "https://api-staging.example.test" });
    await client.account.get();
    expect(calls[0]!.url.origin).toBe("https://api-staging.example.test");
  });

  test("orders.create sends idempotencyKey as the Idempotency-Key header, not in the body", async () => {
    const { client, calls } = recorded([json({ id: id("ord"), status: "submitted" })]);
    await client.orders.create(order);
    const [call] = calls;
    expect(call!.method).toBe("POST");
    expect(call!.url.pathname).toBe("/v1/orders");
    expect(call!.headers.get("idempotency-key")).toBe(order.idempotencyKey);
    expect(call!.headers.get("content-type")).toContain("application/json");
    const { idempotencyKey: _, ...body } = order;
    expect(call!.body).toEqual(body);
  });

  test("path parameters are encoded and every write sends its key", async () => {
    const { client, calls } = recorded([
      json({}),
      json({}),
      json({}),
      json({ queued: 0 }),
      json({}),
    ]);
    await client.orders.cancel({ orderId: id("ord"), idempotencyKey: "cancel-1" });
    await client.practices.update({
      practiceId: id("prac"),
      idempotencyKey: "update-1",
      phone: null,
    });
    await client.webhooks.update({
      webhookEndpointId: id("whe"),
      idempotencyKey: "url-1",
      url: "https://example.test/hook",
    });
    await client.webhooks.resendFailed({
      webhookEndpointId: id("whe"),
      idempotencyKey: "resend-1",
    });
    await client.webhooks.remove({ webhookEndpointId: id("whe") });
    expect(
      calls.map((c) => `${c.method} ${c.url.pathname} ${c.headers.get("idempotency-key")}`),
    ).toEqual([
      `POST /v1/orders/${id("ord")}/cancel cancel-1`,
      `PATCH /v1/practices/${id("prac")} update-1`,
      `PATCH /v1/webhook-endpoints/${id("whe")} url-1`,
      `POST /v1/webhook-endpoints/${id("whe")}/resend-failed resend-1`,
      `DELETE /v1/webhook-endpoints/${id("whe")} null`,
    ]);
    // A PATCH sends only the fields given; null clears a field.
    expect(calls[1]!.body).toEqual({ phone: null });
  });

  test("query parameters keep their wire names and values", async () => {
    const page = { object: "list", url: "/v1/orders", data: [], hasMore: false, nextCursor: null };
    const { client, calls } = recorded([json(page), json({})]);
    await client.orders.list({
      limit: 5,
      practiceId: id("prac"),
      externalOrderId: "emr 42/a",
      updatedAfter: "2026-10-21T11:59:59.999999999Z",
      status: "shipped",
      cancelRequested: "true",
      sort: "-created",
    });
    await client.medications.get({
      medicationId: id("med"),
      practiceId: id("prac"),
      expand: "variants",
    });
    expect(Object.fromEntries(calls[0]!.url.searchParams)).toEqual({
      limit: "5",
      practiceId: id("prac"),
      externalOrderId: "emr 42/a",
      updatedAfter: "2026-10-21T11:59:59.999999999Z",
      status: "shipped",
      cancelRequested: "true",
      sort: "-created",
    });
    expect(calls[1]!.url.searchParams.get("expand")).toBe("variants");
    expect(calls[1]!.url.searchParams.get("practiceId")).toBe(id("prac"));
  });

  test("omitted optional query parameters are not sent", async () => {
    const page = {
      object: "list",
      url: "/v1/medications",
      data: [],
      hasMore: false,
      nextCursor: null,
    };
    const { client, calls } = recorded([json(page)]);
    await client.medications.list();
    expect([...calls[0]!.url.searchParams.keys()]).toEqual([]);
  });
});

describe("pagination", () => {
  const list = (ids: number[], next: string | null) =>
    json({
      object: "list",
      url: "/v1/practices",
      data: ids.map((n) => ({ id: id("prac", n) })),
      hasMore: next !== null,
      nextCursor: next,
    });

  test("iterating a list reads every page with the previous page's nextCursor", async () => {
    const { client, calls } = recorded([
      list([1, 2], "cursor-a"),
      list([3], "cursor-b"),
      list([4], null),
    ]);
    const seen: string[] = [];
    for await (const practice of await client.practices.list({ limit: 2 })) seen.push(practice.id);
    expect(seen).toEqual([id("prac", 1), id("prac", 2), id("prac", 3), id("prac", 4)]);
    expect(calls.map((c) => c.url.searchParams.get("startingAfter"))).toEqual([
      null,
      "cursor-a",
      "cursor-b",
    ]);
    // Filters stay the same on every page.
    expect(calls.every((c) => c.url.searchParams.get("limit") === "2")).toBe(true);
  });

  test("a single page can be read without fetching the next one", async () => {
    const { client, calls } = recorded([list([1], "cursor-a")]);
    const page = await client.practices.list();
    expect(page.data.map((p) => p.id)).toEqual([id("prac", 1)]);
    expect(page.hasNextPage()).toBe(true);
    expect(calls).toHaveLength(1);
  });
});

describe("retries", () => {
  test("a 503 is retried with the same Idempotency-Key and body", async () => {
    const { client, calls } = recorded(
      [problem(503, "service_unavailable"), json({ id: id("ord"), status: "submitted" })],
      { maxRetries: 1 },
    );
    const created = await client.orders.create(order);
    expect(created.id).toBe(id("ord"));
    expect(calls).toHaveLength(2);
    expect(calls[1]!.headers.get("idempotency-key")).toBe(order.idempotencyKey);
    expect(calls[1]!.body).toEqual(calls[0]!.body);
  });

  test("a 429 waits for Retry-After before retrying", async () => {
    const started = Date.now();
    const { client, calls } = recorded(
      [
        new Response("{}", {
          status: 429,
          headers: { "retry-after": "1", "content-type": "application/problem+json" },
        }),
        json({}),
      ],
      { maxRetries: 1 },
    );
    await client.account.get();
    expect(calls).toHaveLength(2);
    expect(Date.now() - started).toBeGreaterThanOrEqual(950);
  });

  test("4xx answers are never retried", async () => {
    for (const status of [400, 401, 403, 404, 409, 422]) {
      const { client, calls } = recorded([problem(status, "refused")], { maxRetries: 2 });
      expect(await rejection(client.orders.create(order))).toBeInstanceOf(AffinityError);
      expect(calls).toHaveLength(1);
    }
  });

  test("maxRetries: 0 sends one request", async () => {
    const { client, calls } = recorded([problem(500, "internal_error")], { maxRetries: 0 });
    expect(await rejection(client.account.get())).toBeInstanceOf(Affinity.InternalServerError);
    expect(calls).toHaveLength(1);
  });
});

describe("errors", () => {
  const cases = [
    [400, Affinity.BadRequestError],
    [401, Affinity.UnauthorizedError],
    [403, Affinity.ForbiddenError],
    [404, Affinity.NotFoundError],
    [409, Affinity.ConflictError],
    [422, Affinity.UnprocessableEntityError],
    [429, Affinity.TooManyRequestsError],
    [500, Affinity.InternalServerError],
    [503, Affinity.ServiceUnavailableError],
  ] as const;
  for (const [status, ErrorClass] of cases)
    test(`${status} raises ${ErrorClass.name} with the problem body`, async () => {
      const { client } = recorded([problem(status, `code_${status}`)], { maxRetries: 0 });
      const error = await client.orders.create(order).catch((e: unknown) => e);
      expect(error).toBeInstanceOf(ErrorClass);
      expect(error).toBeInstanceOf(AffinityError);
      const e = error as AffinityError;
      expect(e.statusCode).toBe(status);
      expect((e.body as { code: string }).code).toBe(`code_${status}`);
      expect(e.message).toContain(`code_${status} detail`);
    });

  test("a 422 keeps every issue with its field and path", async () => {
    const issues = [
      {
        code: "required",
        field: "prescriptions[0].compoundingReason",
        path: ["prescriptions", 0, "compoundingReason"],
        message: "This pharmacy requires a compounding reason.",
      },
    ];
    const { client } = recorded([problem(422, "invalid_order", issues)]);
    const error = (await client.orders
      .create(order)
      .catch((e: unknown) => e)) as Affinity.UnprocessableEntityError;
    expect(error).toBeInstanceOf(Affinity.UnprocessableEntityError);
    expect(error.body.issues).toEqual(issues);
  });

  test("the request ID is read from the response", async () => {
    const response = problem(404, "not_found");
    response.headers.set("request-id", "req_header");
    const { client } = recorded([response]);
    const error = (await client.orders
      .get({ orderId: id("ord") })
      .catch((e: unknown) => e)) as AffinityError;
    expect(error.requestId).toBe("req_header");
  });

  test("withRawResponse gives the response headers", async () => {
    const { client } = recorded([json({ id: id("plat") }, 200, { "request-id": "req_ok" })]);
    const { data, rawResponse } = await client.account.get().withRawResponse();
    expect(data.id).toBe(id("plat"));
    expect(rawResponse.headers.get("request-id")).toBe("req_ok");
  });

  test("an aborted request rejects without retrying", async () => {
    const controller = new AbortController();
    controller.abort();
    const { client, calls } = recorded([json({})]);
    expect(await rejection(client.account.get({ abortSignal: controller.signal }))).toBeInstanceOf(
      Error,
    );
    expect(calls).toHaveLength(0);
  });
});

test("the client has a method for every operation in the contract", async () => {
  const generation = (await Bun.file(new URL("../generation.json", import.meta.url)).json()) as {
    operations: Record<string, string>;
  };
  const client = new AffinityClient({ token: "sk_test_synthetic" }) as unknown as Record<
    string,
    Record<string, unknown>
  >;
  const missing = Object.keys(generation.operations).filter((operationId) => {
    const [resource, method] = operationId.split(".");
    return typeof client[resource!]?.[method!] !== "function";
  });
  expect(missing).toEqual([]);
  expect(Object.keys(generation.operations)).toHaveLength(17);
});
