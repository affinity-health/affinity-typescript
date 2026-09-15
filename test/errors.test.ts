import { describe, expect, test } from "bun:test";
import {
  AffinityConnectionError,
  AffinityInvalidRequestError,
  affinityConnectionError,
  affinityErrorFromResponse,
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
    const error = await affinityErrorFromResponse(await fetchApi("https://example.test"));
    expect(error).toBeInstanceOf(AffinityInvalidRequestError);
    expect(isAffinityError(error)).toBe(true);
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
  });

  test("wraps terminal network failures", async () => {
    const networkFailure = new TypeError("fetch failed");
    const error = affinityConnectionError(networkFailure, { timedOut: false });
    expect(error).toBeInstanceOf(AffinityConnectionError);
    expect(error.cause).toBe(networkFailure);
  });
});
