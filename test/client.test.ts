import { describe, expect, test } from "bun:test";
import * as sdk from "../src";
import { Affinity } from "../src";

const apiAccess = {
  apiKey: { id: "key_123", keyPrefix: "sk_test", object: "api_key" },
  livemode: false,
  object: "api_access",
  scopes: ["orders:read"],
  serviceAccount: { id: "sa_123", name: "Test service account", object: "service_account" },
};

const prescription = {
  daysSupply: 30,
  dispensing: {},
  directions: "Take one tablet by mouth daily",
  medicationId: "cat_01k123456789abcdefghjkmnpq",
  quantity: 30,
  quantityUnit: "tablet",
  refills: 0,
  structuredSig: {
    dose: "1",
    doseUnit: "tablet",
    frequency: "once daily",
    route: "oral",
  },
};

describe("Affinity client", () => {
  test("configures the production API, dated contract, and bearer key", async () => {
    let request: Request | undefined;
    const affinity = new Affinity("sk_test_example", {
      fetch: async (input, init) => {
        request = new Request(input, init);
        return Response.json(apiAccess);
      },
    });

    const access = await affinity.apiKeys.retrieve();

    expect(access.livemode).toBe(false);
    expect(request?.url).toBe("https://api.joinaffinityai.com/v1/auth/access");
    expect(request?.headers.get("authorization")).toBe("Bearer sk_test_example");
    expect(request?.headers.get("affinity-version")).toBe("2026-08-11");
  });

  test("preserves generated list filters and parses typed responses", async () => {
    let request: Request | undefined;
    const affinity = new Affinity("sk_test_example", {
      fetch: async (input, init) => {
        request = new Request(input, init);
        return Response.json({
          data: [],
          hasMore: false,
          object: "list",
          updatedAt: null,
          url: "/v1/catalog/items",
        });
      },
    });

    const result = await affinity.catalog.list({
      limit: 10,
      practiceId: "prac_01k123456789abcdefghjkmnp",
      query: "semaglutide",
      routes: ["injectable"],
    });

    const url = new URL(request!.url);
    expect(result.data).toEqual([]);
    expect(url.pathname).toBe("/v1/catalog/items");
    expect(url.searchParams.get("limit")).toBe("10");
    expect(url.searchParams.get("practiceId")).toBe("prac_01k123456789abcdefghjkmnp");
    expect(url.searchParams.get("query")).toBe("semaglutide");
    expect(url.searchParams.get("routes")).toBe("injectable");
  });

  test("serializes generated mutation bodies and required audit headers", async () => {
    let request: Request | undefined;
    const affinity = new Affinity("sk_test_example", {
      baseUrl: "http://api.affinity.localhost",
      fetch: async (input, init) => {
        request = new Request(input, init);
        return Response.json({
          id: "ord_01k123456789abcdefghjkmnp",
          livemode: false,
          object: "order",
          patientId: "pat_01k123456789abcdefghjkmnp",
          practiceId: "prac_01k123456789abcdefghjkmnp",
          prescriptions: [],
          otcItems: [],
        });
      },
    });

    await affinity.orders.create(
      {
        patientId: "pat_01k123456789abcdefghjkmnp",
        practiceId: "prac_01k123456789abcdefghjkmnp",
        prescriptions: [prescription],
      },
      {
        actor: { id: "integration-user-123", type: "system" },
        idempotencyKey: "order-create-123",
      },
    );

    expect(request?.url).toBe("http://api.affinity.localhost/v1/orders");
    expect(request?.headers.get("affinity-actor-id")).toBe("integration-user-123");
    expect(request?.headers.get("affinity-actor-type")).toBe("system");
    expect(request?.headers.get("idempotency-key")).toBe("order-create-123");
    expect(await request?.json()).toEqual({
      patientId: "pat_01k123456789abcdefghjkmnp",
      practiceId: "prac_01k123456789abcdefghjkmnp",
      prescriptions: [prescription],
    });
  });

  test("keeps generated transport and models private", async () => {
    const affinity = new Affinity("sk_test_example");
    expect("raw" in affinity).toBe(false);
    expect(typeof affinity.rawRequest).toBe("function");
    for (const name of [
      "OrdersApi",
      "Configuration",
      "CreateOrderRequestToJSON",
      "CreateOrderRequestFromJSON",
    ]) {
      expect(name in sdk).toBe(false);
    }
    for (const name of ["ResponseError", "FetchError", "RequiredError"]) {
      expect(typeof sdk[name as keyof typeof sdk]).toBe("function");
    }
  });

  test("uses client and request configuration for raw requests", async () => {
    let request: Request | undefined;
    const affinity = new Affinity("sk_test_example", {
      baseUrl: "https://api.affinity.localhost",
      actor: { id: "default-actor", type: "system" },
      organizationId: "org_default",
      headers: { "X-Client-Header": "client" },
      fetch: async (input, init) => {
        request = new Request(input, init);
        return Response.json({ object: "preview", received: true });
      },
    });

    const result = await affinity.rawRequest<{ object: string; received: boolean }>(
      "POST",
      "/v1/beta_endpoint",
      { value: 123 },
      {
        actor: { id: "raw-check", type: "user" },
        apiVersion: "2026-09-01.preview",
        organizationId: "org_request",
        idempotencyKey: "raw-request-123",
        headers: { "X-Request-Header": "request" },
      },
    );

    expect(result).toEqual({ object: "preview", received: true });
    expect(request?.url).toBe("https://api.affinity.localhost/v1/beta_endpoint");
    expect(request?.method).toBe("POST");
    expect(request?.headers.get("authorization")).toBe("Bearer sk_test_example");
    expect(request?.headers.get("affinity-version")).toBe("2026-09-01.preview");
    expect(request?.headers.get("affinity-actor-id")).toBe("raw-check");
    expect(request?.headers.get("affinity-actor-type")).toBe("user");
    expect(request?.headers.get("x-affinity-organization-id")).toBe("org_request");
    expect(request?.headers.get("idempotency-key")).toBe("raw-request-123");
    expect(request?.headers.get("x-client-header")).toBe("client");
    expect(request?.headers.get("x-request-header")).toBe("request");
    expect(request?.headers.get("content-type")).toBe("application/json");
    expect(await request?.json()).toEqual({ value: 123 });
  });

  test("supports query strings and rejects unsafe raw request inputs", async () => {
    let request: Request | undefined;
    const affinity = new Affinity("sk_test_example", {
      fetch: async (input, init) => {
        request = new Request(input, init);
        return Response.json({ data: [] });
      },
    });

    await affinity.rawRequest("GET", "/v1/beta_endpoint?limit=10", {});
    expect(request?.url).toBe("https://api.joinaffinityai.com/v1/beta_endpoint?limit=10");

    await expect(affinity.rawRequest("GET", "/v1/beta_endpoint", { limit: 10 })).rejects.toThrow(
      /only supports params on POST, PUT, and PATCH/,
    );
    for (const path of [
      "https://evil.example/v1/leak",
      "//evil.example/v1/leak",
      "/\\evil.example/v1/leak",
    ])
      await expect(affinity.rawRequest("GET", path)).rejects.toThrow(/single forward slash/);
    await expect(
      affinity.rawRequest("GET", "/v1/beta_endpoint", undefined, {
        headers: { Authorization: "Bearer leaked" },
      }),
    ).rejects.toThrow(/typed Affinity options/);
  });

  test("preserves transport errors for raw requests", async () => {
    const failedResponse = Response.json(
      { code: "preview_failed", detail: "Preview failed" },
      { status: 422 },
    );
    const rejected = new Affinity("sk_test_example", {
      fetch: async () => failedResponse,
    });
    try {
      await rejected.rawRequest("POST", "/v1/beta_endpoint", {});
      throw new Error("Expected raw request to fail");
    } catch (error) {
      expect(error).toBeInstanceOf(sdk.ResponseError);
      expect((error as InstanceType<typeof sdk.ResponseError>).response.status).toBe(
        failedResponse.status,
      );
    }

    const disconnected = new Affinity("sk_test_example", {
      fetch: async () => {
        throw new TypeError("fetch failed");
      },
    });
    await expect(disconnected.rawRequest("GET", "/v1/beta_endpoint")).rejects.toBeInstanceOf(
      sdk.FetchError,
    );
  });
});
