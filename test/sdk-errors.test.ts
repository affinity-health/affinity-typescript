import { describe, expect, test } from "bun:test";
import {
  Affinity,
  AffinityApiError,
  AffinityAuthenticationError,
  AffinityConnectionError,
  AffinityError,
  AffinityIdempotencyError,
  AffinityInvalidRequestError,
  AffinityPermissionError,
  AffinityRateLimitError,
  isAffinityError,
} from "../src";

const baseUrl = "https://sdk-1-17.example.test";

function client(
  fetcher: typeof fetch,
  options: { timeout?: number; maxNetworkRetries?: number } = {},
) {
  return new Affinity("sdk-1-17-test-key", { baseUrl, fetch: fetcher, ...options });
}

describe("public SDK error contract", () => {
  test.each([
    [400, "invalid_request", AffinityInvalidRequestError],
    [401, "unauthorized", AffinityAuthenticationError],
    [403, "forbidden", AffinityPermissionError],
    [404, "not_found", AffinityInvalidRequestError],
    [409, "idempotency_conflict", AffinityIdempotencyError],
    [422, "validation_failed", AffinityInvalidRequestError],
    [429, "rate_limited", AffinityRateLimitError],
    [500, "internal_error", AffinityApiError],
  ] as const)(
    "throws the typed %s error through a public resource",
    async (status, code, ErrorClass) => {
      const problem = {
        code,
        detail: "sdk-1-17 private patient detail",
        instance: "/v1/account",
        requestId: "req_sdk-1-17",
        status,
        title: "Request failed",
        type: "about:blank",
      };
      const api = client(async () => Response.json(problem, { status }));
      const error = await api.account.get().catch((error: unknown) => error);
      expect(error).toBeInstanceOf(ErrorClass);
      expect(error).toBeInstanceOf(AffinityError);
      expect(error).toBeInstanceOf(Error);
      expect(isAffinityError(error)).toBe(true);
      if (!isAffinityError(error)) throw new Error("Expected AffinityError");
      expect(error.code).toBe(code);
      expect(error.message).toContain(String(status));
      expect(error.message).toContain(code);
      expect(error.requestId).toBe(problem.requestId);
      expect(error.problem).toEqual(problem);
      expect(error.response?.status).toBe(status);
      expect(JSON.stringify(error)).not.toContain(problem.detail);
      expect(error.retryable).toBe([429, 500].includes(status));
    },
  );

  test("keeps request IDs when an edge returns non-JSON", async () => {
    const api = client(
      async () =>
        new Response("sdk-1-17 upstream unavailable", {
          status: 502,
          headers: { "X-Request-Id": "req_sdk-1-17-edge" },
        }),
    );
    await expect(api.account.get()).rejects.toMatchObject({
      name: "AffinityApiError",
      code: "http_502",
      statusCode: 502,
      requestId: "req_sdk-1-17-edge",
      retryable: true,
    });
  });

  test("wraps terminal connection failures and keeps the original cause", async () => {
    const cause = new TypeError("sdk-1-17 connection refused");
    const api = client(async () => {
      throw cause;
    });
    await expect(api.account.get()).rejects.toMatchObject({
      name: "AffinityConnectionError",
      category: "connection",
      code: "connection_error",
      cause,
      retryable: true,
    });
    await expect(api.account.get()).rejects.toBeInstanceOf(AffinityConnectionError);
  });

  test("wraps access-discovery failures before a scoped request", async () => {
    const cause = new TypeError("sdk-1-17 discovery failed");
    let attempts = 0;
    const api = client(async () => {
      attempts++;
      throw cause;
    });
    await expect(
      api.forPractice("prac_sdk-1-17").patients.get("pat_sdk-1-17"),
    ).rejects.toMatchObject({ name: "AffinityConnectionError", cause });
    expect(attempts).toBe(1);
  });

  test("wraps the final failure after exhausting configured retries", async () => {
    let attempts = 0;
    const cause = new TypeError("sdk-1-17 still offline");
    const api = client(
      async () => {
        attempts++;
        throw cause;
      },
      { maxNetworkRetries: 1 },
    );
    await expect(api.account.get()).rejects.toMatchObject({
      name: "AffinityConnectionError",
      cause,
    });
    expect(attempts).toBe(2);
  });

  test.each(["headers", "body"] as const)(
    "wraps a timeout while waiting for response %s",
    async (phase) => {
      let signal: AbortSignal | undefined;
      const api = client(
        async (_input, init) => {
          signal = init?.signal ?? undefined;
          if (phase === "headers") return new Promise<Response>(() => {});
          return new Response(new ReadableStream({ start() {} }));
        },
        { timeout: 10 },
      );
      await expect(api.account.get()).rejects.toMatchObject({
        name: "AffinityConnectionError",
        code: "request_timeout",
        retryable: true,
        cause: expect.objectContaining({ name: "TimeoutError" }),
      });
      expect(signal?.aborted).toBe(true);
    },
  );

  test("keeps caller cancellation reasons and does not retry them", async () => {
    const controller = new AbortController();
    const reason = new Error("sdk-1-17 caller canceled");
    let attempts = 0;
    const api = client(
      async () => {
        attempts++;
        controller.abort(reason);
        throw reason;
      },
      { maxNetworkRetries: 2 },
    );
    await expect(api.account.get({}, { signal: controller.signal })).rejects.toBe(reason);
    expect(attempts).toBe(1);
  });
});
