import { describe, expect, test } from "bun:test";
import { Affinity, Configuration, OrdersApi } from "../src";

const apiAccess = {
  apiKey: { id: "key_123", keyPrefix: "sk_test", object: "api_key" },
  livemode: false,
  object: "api_access",
  scopes: ["orders:read"],
  serviceAccount: { id: "sa_123", name: "Test service account", object: "service_account" },
};

describe("generated Affinity client", () => {
  test("configures the production API, dated contract, and bearer key", async () => {
    let request: Request | undefined;
    const affinity = new Affinity("sk_test_example", {
      fetch: async (input, init) => {
        request = new Request(input, init);
        return Response.json(apiAccess);
      },
    });

    const access = await affinity.apiKeys.getApiAccess();

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

    const result = await affinity.catalog.listCatalogItems({
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
        });
      },
    });

    await affinity.orders.createOrder({
      affinityActorId: "integration-user-123",
      affinityActorType: "system",
      createOrderRequest: {
        patientId: "pat_01k123456789abcdefghjkmnp",
        practiceId: "prac_01k123456789abcdefghjkmnp",
        prescriptions: [],
      },
      idempotencyKey: "order-create-123",
    });

    expect(request?.url).toBe("http://api.affinity.localhost/v1/orders");
    expect(request?.headers.get("affinity-actor-id")).toBe("integration-user-123");
    expect(request?.headers.get("affinity-actor-type")).toBe("system");
    expect(request?.headers.get("idempotency-key")).toBe("order-create-123");
    expect(await request?.json()).toEqual({
      patientId: "pat_01k123456789abcdefghjkmnp",
      practiceId: "prac_01k123456789abcdefghjkmnp",
      prescriptions: [],
    });
  });

  test("exposes the generated API classes for custom configuration", () => {
    const orders = new OrdersApi(
      new Configuration({ accessToken: "sk_test_example", basePath: "https://example.test" }),
    );
    expect(orders).toBeInstanceOf(OrdersApi);
  });
});
