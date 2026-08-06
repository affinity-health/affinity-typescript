import { describe, expect, test } from "bun:test";
import {
  Affinity,
  AffinityConnectionError,
  AffinityInvalidRequestError,
  isAffinityError,
} from "../src";

describe("Affinity errors", () => {
  test("throws a parsed typed API error without requiring response.json()", async () => {
    const fetchApi: typeof fetch = async () =>
      Response.json(
        {
          code: "invalid_cursor",
          data: { parameter: "startingAfter" },
          detail: "The pagination cursor is invalid.",
          instance: "urn:affinity:request:req_test_123",
          requestId: "req_test_123",
          status: 400,
          title: "Invalid request",
          traceId: "trace_test_123",
          type: "https://api.joinaffinityai.com/problems/invalid-cursor",
        },
        { status: 400 },
      );
    const affinity = new Affinity("aff_test_example", { fetch: fetchApi, maxRetries: 0 });

    try {
      await affinity.catalog.list({ startingAfter: "invalid" });
      throw new Error("Expected catalog.list to reject");
    } catch (error) {
      expect(error).toBeInstanceOf(AffinityInvalidRequestError);
      expect(isAffinityError(error)).toBe(true);
      if (!isAffinityError(error)) throw error;

      expect(error.category).toBe("invalid_request");
      expect(error.code).toBe("invalid_cursor");
      expect(error.message).toBe("The pagination cursor is invalid.");
      expect(error.problem?.data).toEqual({ parameter: "startingAfter" });
      expect(error.requestId).toBe("req_test_123");
      expect(error.statusCode).toBe(400);
      expect(error.toJSON()).toEqual({
        category: "invalid_request",
        code: "invalid_cursor",
        message: "The pagination cursor is invalid.",
        requestId: "req_test_123",
        retryable: false,
        statusCode: 400,
      });
    }
  });

  test("wraps terminal network failures", async () => {
    const networkFailure = new TypeError("fetch failed");
    const affinity = new Affinity("aff_test_example", {
      fetch: async () => Promise.reject(networkFailure),
      maxRetries: 0,
    });

    await expect(Promise.resolve(affinity.catalog.list())).rejects.toBeInstanceOf(
      AffinityConnectionError,
    );
  });
});
