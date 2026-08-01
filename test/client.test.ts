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
    expect(() => new Affinity("sk_test_example").withActor({ id: "", type: "user" })).toThrow();
  });

  test("requires and sends traceable actor context for PHI-capable requests", async () => {
    let request: Request | undefined;
    const affinity = new Affinity("sk_test_example", {
      fetch: async (input, init) => {
        request = new Request(input, init);
        return Response.json({ data: [], hasMore: false, object: "list", url: "/v1/orders" });
      },
    });

    expect(() => affinity.orders.list()).toThrow("call affinity.withActor(...) first");
    await affinity.withActor({ id: "sync-job-4821", type: "system" }).orders.list();

    expect(request?.headers.get("affinity-actor-id")).toBe("sync-job-4821");
    expect(request?.headers.get("affinity-actor-type")).toBe("system");
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

  test("manages practice patients with scoped paths and idempotency", async () => {
    const requests: Request[] = [];
    const practiceId = "prac_01k123456789abcdefghjkmnp";
    const patientId = "pat_01k123456789abcdefghjkmnp";
    const patient = {
      address: {
        city: "Detroit",
        country: "US",
        line1: "100 Test Avenue",
        line2: null,
        postalCode: "48201",
        state: "MI",
      },
      allergies: "NKDA",
      createdAt: "2026-07-31T12:00:00.000Z",
      dateOfBirth: "1990-01-01",
      email: null,
      externalId: "patient_4821",
      gender: "u",
      id: patientId,
      livemode: false,
      metadata: {},
      name: { first: "Jordan", last: "Lee", middle: null, preferred: null },
      object: "patient",
      phone: "+13135550100",
      practiceId,
      status: "active",
      updatedAt: "2026-07-31T12:00:00.000Z",
    };
    const affinity = new Affinity("sk_test_example", {
      fetch: async (input, init) => {
        const request = new Request(input, init);
        requests.push(request);
        if (request.method === "GET" && new URL(request.url).pathname.endsWith("/patients")) {
          return Response.json({ data: [], hasMore: false, object: "list", url: request.url });
        }
        return Response.json(patient);
      },
    }).withActor({ id: "platform-user-4821", type: "user" });

    await affinity.patients.list(practiceId, { limit: 10, query: "Jordan" });
    await affinity.patients.retrieve(practiceId, patientId);
    await affinity.patients.create(
      practiceId,
      {
        address: {
          city: "Detroit",
          country: "US",
          line1: "100 Test Avenue",
          postalCode: "48201",
          state: "MI",
        },
        dateOfBirth: new Date("1990-01-01"),
        externalId: "patient_4821",
        name: { first: "Jordan", last: "Lee" },
        phone: "+13135550100",
      },
      { idempotencyKey: "patient-create-4821" },
    );
    await affinity.patients.update(
      practiceId,
      patientId,
      { status: "inactive" },
      { idempotencyKey: "patient-update-4821" },
    );

    expect(requests.map((request) => `${request.method} ${new URL(request.url).pathname}`)).toEqual(
      [
        `GET /v1/practices/${practiceId}/patients`,
        `GET /v1/practices/${practiceId}/patients/${patientId}`,
        `POST /v1/practices/${practiceId}/patients`,
        `PATCH /v1/practices/${practiceId}/patients/${patientId}`,
      ],
    );
    const patientListUrl = new URL(requests[0]?.url ?? "https://invalid.example");
    expect(patientListUrl.searchParams.get("limit")).toBe("10");
    expect(patientListUrl.searchParams.get("query")).toBe("Jordan");
    expect(requests[2]?.headers.get("idempotency-key")).toBe("patient-create-4821");
    expect(requests[3]?.headers.get("idempotency-key")).toBe("patient-update-4821");
    expect(requests.map((request) => request.headers.get("affinity-actor-id"))).toEqual([
      "platform-user-4821",
      "platform-user-4821",
      "platform-user-4821",
      "platform-user-4821",
    ]);
    expect(requests.map((request) => request.headers.get("affinity-actor-type"))).toEqual([
      "user",
      "user",
      "user",
      "user",
    ]);
    expect(await requests[3]?.json()).toEqual({ status: "inactive" });
  });

  test("creates and completes practice payment setup without exposing card data", async () => {
    const requests: Request[] = [];
    const affinity = new Affinity("sk_test_example", {
      fetch: async (input, init) => {
        const request = new Request(input, init);
        requests.push(request);
        if (new URL(request.url).pathname.endsWith("/setup")) {
          return Response.json({
            clientSecret: "seti_test_4821_secret_example",
            consentVersion: "2026-07-31",
            publishableKey: "pk_test_example",
          });
        }
        return Response.json({
          consentVersion: "2026-07-31",
          environment: "sandbox",
          paymentMethod: null,
          paymentMethods: [],
          portalAvailable: true,
          status: "ready",
        });
      },
    });
    const practiceId = "prac_01k123456789abcdefghjkmnp";

    await affinity.billing.retrievePaymentProfile(practiceId);
    await affinity.billing.createPaymentSetup(
      practiceId,
      { consentAccepted: true },
      { idempotencyKey: "billing-create-4821" },
    );
    await affinity.billing.completePaymentSetup(
      practiceId,
      { setupIntentId: "seti_test_4821" },
      { idempotencyKey: "billing-complete-4821" },
    );

    expect(requests.map((request) => `${request.method} ${new URL(request.url).pathname}`)).toEqual(
      [
        `GET /v1/practices/${practiceId}/payment-profile`,
        `POST /v1/practices/${practiceId}/payment-profile/setup`,
        `POST /v1/practices/${practiceId}/payment-profile/setup/complete`,
      ],
    );
    expect(requests[1]?.headers.get("idempotency-key")).toBe("billing-create-4821");
    expect(await requests[1]?.json()).toEqual({ consentAccepted: true });
    expect(requests[2]?.headers.get("idempotency-key")).toBe("billing-complete-4821");
    expect(await requests[2]?.json()).toEqual({ setupIntentId: "seti_test_4821" });
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
        providerMappingId: "pmap_01k123456789abcdefghjkmnp",
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

  test("revokes provider mappings with an idempotent mutation", async () => {
    let request: Request | undefined;
    const affinity = new Affinity("sk_test_example", {
      fetch: async (input, init) => {
        request = new Request(input, init);
        return Response.json({});
      },
    });

    await affinity.providerMappings.revoke("pmap_01k123456789abcdefghjkmnp", {
      idempotencyKey: "provider-revoke-example",
    });

    expect(request?.method).toBe("PATCH");
    expect(new URL(request?.url ?? "").pathname).toBe(
      "/v1/provider-mappings/pmap_01k123456789abcdefghjkmnp",
    );
    expect(request?.headers.get("idempotency-key")).toBe("provider-revoke-example");
    expect(await request?.json()).toEqual({ status: "revoked" });
  });

  test("lists provider mappings with platform identity filters", async () => {
    let request: Request | undefined;
    const affinity = new Affinity("sk_test_example", {
      fetch: async (input, init) => {
        request = new Request(input, init);
        return Response.json({
          data: [],
          hasMore: false,
          object: "list",
          url: "/v1/provider-mappings",
        });
      },
    });

    await affinity.providerMappings.list({
      externalId: "provider_4821",
      practiceId: "prac_01k123456789abcdefghjkmnp",
      status: "verified",
    });

    expect(request?.url).toBe(
      "https://api.joinaffinityai.com/v1/provider-mappings" +
        "?externalId=provider_4821" +
        "&practiceId=prac_01k123456789abcdefghjkmnp" +
        "&status=verified",
    );
  });

  test("creates an unsigned prescription and a provider-bound signing session", async () => {
    const requests: Request[] = [];
    const affinity = new Affinity("sk_test_example", {
      fetch: async (input, init) => {
        requests.push(new Request(input, init));
        return Response.json({});
      },
    });
    const actingAffinity = affinity.withActor({ id: "platform-user-4821", type: "user" });

    await actingAffinity.prescriptions.create(
      {
        clinical: { currentMedications: [], observations: [] },
        daysSupply: 30,
        dispensing: { dispenseUponAcceptance: true, substitutionPermitted: false },
        directions: "Inject 0.25 mL subcutaneously once weekly",
        medicationId: "cat_01k123456789abcdefghjkmnp",
        patientId: "pat_01k123456789abcdefghjkmnp",
        practiceId: "prac_01k123456789abcdefghjkmnp",
        providerMappingId: "pmap_01k123456789abcdefghjkmnp",
        quantity: 1,
        quantityUnit: "mL",
        refills: 0,
        structuredSig: {
          dose: "0.25",
          doseUnit: "mL",
          frequency: "once weekly",
          prn: false,
          route: "subcutaneous",
        },
      },
      { idempotencyKey: "prescription-example" },
    );
    await affinity.prescriptionSigningSessions.create(
      {
        consent: {
          authorizedProviderAccess: true,
          minimumNecessaryPhi: true,
          recordedAt: new Date("2026-08-01T12:00:00.000Z"),
        },
        practiceId: "prac_01k123456789abcdefghjkmnp",
        prescriptionId: "rx_01k123456789abcdefghjkmnp",
        providerMappingId: "pmap_01k123456789abcdefghjkmnp",
        userId: "usr_01k123456789abcdefghjkmnp",
      },
      { idempotencyKey: "prescription-signing-example" },
    );

    expect(requests.map((request) => new URL(request.url).pathname)).toEqual([
      "/v1/prescriptions",
      "/v1/prescription-signing-sessions",
    ]);
    expect(requests[0]?.headers.get("affinity-actor-id")).toBe("platform-user-4821");
    expect(requests[0]?.headers.get("affinity-actor-type")).toBe("user");
    expect(requests.map((request) => request.headers.get("idempotency-key"))).toEqual([
      "prescription-example",
      "prescription-signing-example",
    ]);
  });
});
