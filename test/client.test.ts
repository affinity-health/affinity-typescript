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

  test("keeps generated transport and models behind the raw escape hatch", async () => {
    const affinity = new Affinity("sk_test_example");
    expect(typeof affinity.raw.orders.getOrder).toBe("function");
    expect(typeof affinity.raw.orders.getOrderRaw).toBe("function");
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

  test("uses the client transport configuration for raw generated calls", async () => {
    let request: Request | undefined;
    const affinity = new Affinity("sk_test_example", {
      baseUrl: "https://api.affinity.localhost",
      fetch: async (input, init) => {
        request = new Request(input, init);
        return Response.json({
          practiceMedicationTotalCents: null,
          externalOrderId: null,
          metadata: null,
          createdAt: null,
          fulfillments: [],
          id: "ord_01k123456789abcdefghjkmnpq",
          lifecycleEvents: [],
          livemode: false,
          object: "order",
          patientId: "pat_01k123456789abcdefghjkmnpq",
          patientExternalId: null,
          patientName: null,
          patientState: null,
          practiceId: "prac_01k123456789abcdefghjkmnpq",
          prescriberName: null,
          prescriberNpi: null,
          review: null,
          prescriptions: [],
          status: "draft",
          updatedAt: null,
        });
      },
    });

    await affinity.raw.orders.getOrder({
      orderId: "ord_01k123456789abcdefghjkmnpq",
      affinityActorId: "raw-check",
      affinityActorType: "system",
    });

    expect(request?.url).toBe(
      "https://api.affinity.localhost/v1/orders/ord_01k123456789abcdefghjkmnpq",
    );
    expect(request?.headers.get("authorization")).toBe("Bearer sk_test_example");
    expect(request?.headers.get("affinity-version")).toBe("2026-08-11");
    expect(request?.headers.get("affinity-actor-id")).toBe("raw-check");
  });
});
