import { describe, expect, test } from "bun:test";
import { Affinity } from "../src";

describe("Affinity client", () => {
  test("uses the production API, dated contract, and bearer key by default", async () => {
    let request: Request | undefined;
    const affinity = new Affinity("sk_test_example", {
      fetch: async (input, init) => {
        request = new Request(input, init);
        return Response.json({ apiKey: {}, livemode: false, scopes: [], serviceAccount: {} });
      },
    });

    await affinity.account.retrieveAccess();

    expect(request?.url).toBe("https://api.joinaffinityai.com/v1/auth/access");
    expect(request?.headers.get("authorization")).toBe("Bearer sk_test_example");
    expect(request?.headers.get("affinity-version")).toBe("2026-07-29");
  });

  test("retries safe reads and preserves list filters", async () => {
    const requests: Request[] = [];
    const affinity = new Affinity("sk_test_example", {
      fetch: async (input, init) => {
        requests.push(new Request(input, init));
        if (requests.length === 1) return new Response(null, { status: 503 });
        return Response.json({
          data: [],
          hasMore: false,
          object: "list",
          url: "/v1/catalog/items",
        });
      },
      maxRetries: 1,
    });

    await affinity.catalog.list({ limit: 10, query: "semaglutide", route: "injectable" });

    expect(requests).toHaveLength(2);
    expect(requests[1]?.url).toContain("limit=10");
    expect(requests[1]?.url).toContain("query=semaglutide");
    expect(requests[1]?.url).toContain("route=injectable");
  });

  test("lists only the compounders available to the authenticated account", async () => {
    let request: Request | undefined;
    const affinity = new Affinity("sk_test_example", {
      fetch: async (input, init) => {
        request = new Request(input, init);
        return Response.json({
          data: [],
          hasMore: false,
          object: "list",
          url: "/v1/compounders",
        });
      },
    });

    await affinity.compounders.list({ query: "example" });

    expect(request?.url).toBe("https://api.joinaffinityai.com/v1/compounders?query=example");
    expect(request?.headers.get("affinity-version")).toBe("2026-07-29");
  });

  test("validates retry and timeout options", () => {
    expect(() => new Affinity("sk_test_example", { maxRetries: -1 })).toThrow();
    expect(() => new Affinity("sk_test_example", { timeout: 0 })).toThrow();
  });

  test("creates hosted identity resources with idempotency", async () => {
    const requests: Request[] = [];
    const affinity = new Affinity("sk_test_example", {
      baseUrl: "http://api.affinity.localhost",
      fetch: async (input, init) => {
        requests.push(new Request(input, init));
        return Response.json({
          createdAt: new Date().toISOString(),
          email: null,
          externalId: "customer_123",
          id: "usr_01k123456789abcdefghjkmnp",
          livemode: false,
          metadata: {},
          name: "Jordan Lee",
          object: "user",
          status: "active",
          updatedAt: new Date().toISOString(),
        });
      },
    });

    await affinity.users.create(
      { email: null, externalId: "customer_123", metadata: {}, name: "Jordan Lee" },
      { idempotencyKey: "provision-customer-123" },
    );

    expect(requests[0]?.url).toBe("http://api.affinity.localhost/v1/users");
    expect(requests[0]?.headers.get("idempotency-key")).toBe("provision-customer-123");
    expect(await requests[0]?.json()).toMatchObject({ externalId: "customer_123" });
  });

  test("creates component and hosted sessions through separate resources", async () => {
    const requests: Request[] = [];
    const affinity = new Affinity("sk_test_example", {
      fetch: async (input, init) => {
        requests.push(new Request(input, init));
        return Response.json({});
      },
    });
    const consent = {
      authorizedProviderAccess: true as const,
      minimumNecessaryPhi: true as const,
      recordedAt: new Date("2026-07-29T12:00:00.000Z"),
    };

    await affinity.componentSessions.create(
      {
        allowedOrigin: "https://platform.example.com",
        components: {
          prescriptionComposer: {
            enabled: true,
            features: {
              changePatient: false,
              createDraft: true,
              sign: false,
              viewHistory: true,
            },
          },
        },
        consent,
        context: { patientSelection: "search" },
        practiceId: "prac_01k123456789abcdefghjkmnp",
        providerMappingId: "pmap_01k123456789abcdefghjkmnp",
        userId: "usr_01k123456789abcdefghjkmnp",
      },
      { idempotencyKey: "component-example" },
    );
    await affinity.hostedSessions.create(
      {
        consent,
        flow: "provider_verification",
        practiceId: "prac_01k123456789abcdefghjkmnp",
        returnUrl: "https://platform.example.com/affinity/return",
        userId: "usr_01k123456789abcdefghjkmnp",
      },
      { idempotencyKey: "hosted-example" },
    );

    expect(requests.map((request) => new URL(request.url).pathname)).toEqual([
      "/v1/component-sessions",
      "/v1/hosted-sessions",
    ]);
    expect(requests.map((request) => request.headers.get("idempotency-key"))).toEqual([
      "component-example",
      "hosted-example",
    ]);
  });
});
