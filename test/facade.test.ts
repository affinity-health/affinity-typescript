import { describe, expect, test } from "bun:test";
import { Affinity } from "../src";

const baseUrl = "https://api.affinity.test";
const practiceId = "prac_01k123456789abcdefghjkmnpq";
const patientId = "pat_01k123456789abcdefghjkmnpq";
const orderId = "ord_01k123456789abcdefghjkmnpq";
const catalogItemId = "cat_01k123456789abcdefghjkmnpq";
const endpointId = "whe_01k123456789abcdefghjkmnpq";
const actor = { id: "system-sync", type: "system" } as const;

const validPrescription = {
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
} as const;

const minimalResponse = {
  otcItems: [],
  addresses: [],
  allergies: [],
  allergySummary: [],
  allowedQuantities: [],
  attempts: [],
  cancellations: [],
  certifications: [],
  conditions: [],
  data: [],
  deliveries: [],
  diagnoses: [],
  endpoints: [],
  encounters: [],
  exceptions: [],
  expectedVersions: [],
  externalIdentities: [],
  facilityLocations: [],
  fulfillments: [],
  identifiers: [],
  ingredients: [],
  licenses: [],
  lifecycleEvents: [],
  measurements: [],
  medications: [],
  observations: [],
  orders: [],
  otherNames: [],
  prescribers: [],
  prescriptions: [],
  programs: [],
  quantities: [],
  reactions: [],
  roles: [],
  shipments: [],
  shippingOptions: [],
  specialties: [],
  subscribedEvents: [],
  hasMore: false,
  object: "list",
  updatedAt: null,
  url: "/v1/test",
};

type CapturedRequest = Request & { capturedSignal?: AbortSignal | null };

function client(options: ConstructorParameters<typeof Affinity>[1] = {}) {
  const requests: CapturedRequest[] = [];
  const affinity = new Affinity("sk_test_example", {
    baseUrl,
    fetch: async (input, init) => {
      requests.push(Object.assign(new Request(input, init), { capturedSignal: init?.signal }));
      return Response.json(minimalResponse);
    },
    ...options,
  });
  return { affinity, requests };
}

async function issue(operation: Promise<unknown>) {
  await operation;
}

async function requestBody(request: Request) {
  return request.clone().json();
}

async function expectFailure(action: () => unknown, message: RegExp) {
  let failure: unknown;
  try {
    await action();
  } catch (error) {
    failure = error;
  }
  expect(failure).toBeInstanceOf(Error);
  expect((failure as Error).message).toMatch(message);
}

function header(request: Request, name: string) {
  return request.headers.get(name);
}

describe("Affinity public facade", () => {
  test("temporarily omits session creation", () => {
    const { affinity } = client({ actor });
    expect("sessions" in affinity).toBe(false);
  });
  test("maps representative methods for every resource to the contract path", async () => {
    const { affinity, requests } = client({ actor });

    await issue(
      affinity.account.retrieve(
        { orgId: "acct_01k123456789abcdefghjkmnpq" },
        { organizationId: "acct_01k123456789abcdefghjkmnpq" },
      ),
    );
    await issue(affinity.apiKeys.retrieve());
    await issue(affinity.catalog.list({ limit: 10, query: "semaglutide" }));
    await issue(affinity.locations.list(practiceId, { limit: 5 }));
    await issue(affinity.orders.retrieve(orderId));
    await issue(affinity.patients.list(practiceId, { limit: 5 }));
    await issue(affinity.platformPricing.retrieve(catalogItemId, { practiceId }));
    await issue(affinity.practices.retrieve(practiceId));
    await issue(affinity.team.listMembers(practiceId, { limit: 5 }));
    await issue(affinity.webhooks.list({}, { organizationId: "acct_01k123456789abcdefghjkmnpq" }));

    expect(requests.map((request) => new URL(request.url).pathname)).toEqual([
      "/v1/account",
      "/v1/auth/access",
      "/v1/catalog/items",
      `/v1/practices/${practiceId}/locations`,
      `/v1/orders/${orderId}`,
      `/v1/practices/${practiceId}/patients`,
      `/v1/catalog/items/${catalogItemId}/selling-price`,
      `/v1/practices/${practiceId}`,
      `/v1/practices/${practiceId}/team/members`,
      "/v1/webhook-endpoints",
    ]);

    const catalogQuery = new URL(requests[2]!.url).searchParams;
    expect(catalogQuery.get("limit")).toBe("10");
    expect(catalogQuery.get("query")).toBe("semaglutide");
    expect(new URL(requests[0]!.url).searchParams.get("orgId")).toBe(
      "acct_01k123456789abcdefghjkmnpq",
    );
    expect(header(requests[0]!, "X-Affinity-Organization-Id")).toBe(
      "acct_01k123456789abcdefghjkmnpq",
    );
    expect(new URL(requests[5]!.url).searchParams.get("limit")).toBe("5");
  });

  test("flattens mutation bodies and translates path identifiers and typed headers", async () => {
    const { affinity, requests } = client({ actor });
    const body = {
      practiceId,
      patientId,
      prescriptions: [validPrescription],
    };

    await issue(
      affinity.orders.create(body, {
        idempotencyKey: "order-create-123",
        actor: { id: "  request-user  ", type: "user" },
      }),
    );

    const request = requests[0]!;
    expect(request.method).toBe("POST");
    expect(request.url).toBe(`${baseUrl}/v1/orders`);
    expect(header(request, "Idempotency-Key")).toBe("order-create-123");
    expect(header(request, "Affinity-Actor-Id")).toBe("request-user");
    expect(header(request, "Affinity-Actor-Type")).toBe("user");
    expect(await requestBody(request)).toEqual(body);
  });

  test("supports pharmacy filtering and locations without a timezone override", async () => {
    const { affinity, requests } = client({ actor });
    const pharmacyId = "pharm_01j2y8m6jcc9tt24af5pw9x1bc";

    await issue(affinity.catalog.listPharmacies({ pharmacyId }));
    await issue(
      affinity.locations.create(
        practiceId,
        { name: "Primary location" },
        { idempotencyKey: "location-create-123" },
      ),
    );

    expect(new URL(requests[0]!.url).searchParams.get("pharmacyId")).toBe(pharmacyId);
    expect(await requestBody(requests[1]!)).toEqual({ name: "Primary location" });
  });

  test("applies request version, organization, custom headers, and signal with typed precedence", async () => {
    const controller = new AbortController();
    const { affinity, requests } = client({
      apiVersion: "2026-01-01",
      headers: { "X-Request-Trace": "client", "X-Client-Only": "yes" },
    });

    await issue(
      affinity.patients.list(
        practiceId,
        { limit: 2 },
        {
          apiVersion: "2026-09-01",
          organizationId: "acct_01k123456789abcdefghjkmnpq",
          headers: { "x-request-trace": "request", "X-Request-Only": "yes" },
          signal: controller.signal,
          actor,
        },
      ),
    );

    const request = requests[0]!;
    expect(header(request, "Affinity-Version")).toBe("2026-09-01");
    expect(header(request, "X-Affinity-Organization-Id")).toBe("acct_01k123456789abcdefghjkmnpq");
    expect(header(request, "x-request-trace")).toBe("request");
    expect(header(request, "X-Client-Only")).toBe("yes");
    expect(header(request, "X-Request-Only")).toBe("yes");
    expect(request.capturedSignal?.aborted).toBe(false);
    expect([...request.headers.keys()].filter((name) => name === "x-request-trace")).toHaveLength(
      1,
    );
  });

  test("uses a client actor by default and permits a request actor override", async () => {
    const { affinity, requests } = client({ actor });

    await issue(affinity.orders.retrieve(orderId));
    await issue(
      affinity.orders.retrieve(orderId, {
        actor: { id: "user-reviewer", type: "user" },
      }),
    );

    expect(header(requests[0]!, "Affinity-Actor-Id")).toBe(actor.id);
    expect(header(requests[0]!, "Affinity-Actor-Type")).toBe(actor.type);
    expect(header(requests[1]!, "Affinity-Actor-Id")).toBe("user-reviewer");
    expect(header(requests[1]!, "Affinity-Actor-Type")).toBe("user");
  });

  test("allows a system actor without a separate actor ID", async () => {
    const { affinity, requests } = client();
    const system = affinity.withActor({ type: "system" });

    await issue(system.orders.retrieve(orderId));
    await issue(
      affinity.rawRequest("GET", `/v1/orders/${orderId}`, undefined, {
        actor: { type: "system" },
      }),
    );

    for (const request of requests) {
      expect(header(request, "Affinity-Actor-Type")).toBe("system");
      expect(header(request, "Affinity-Actor-Id")).toBeNull();
    }
  });

  test("keeps withActor overrides isolated from the original client", async () => {
    const { affinity, requests } = client({ actor });
    const reviewer = affinity.withActor({ id: "user-reviewer", type: "user" });

    await issue(affinity.orders.retrieve(orderId));
    await issue(reviewer.orders.retrieve(orderId));
    await issue(affinity.orders.retrieve(orderId));

    expect(requests.map((request) => header(request, "Affinity-Actor-Id"))).toEqual([
      "system-sync",
      "user-reviewer",
      "system-sync",
    ]);
    expect(requests.map((request) => header(request, "Affinity-Actor-Type"))).toEqual([
      "system",
      "user",
      "system",
    ]);
  });

  test("removes a client user ID when a request overrides the actor with system", async () => {
    const { affinity, requests } = client({
      actor: { id: "user-reviewer", type: "user" },
    });

    await issue(affinity.orders.retrieve(orderId, { actor: { type: "system" } }));

    expect(header(requests[0]!, "Affinity-Actor-Id")).toBeNull();
    expect(header(requests[0]!, "Affinity-Actor-Type")).toBe("system");
  });

  test("uses the authenticated service account as the default system actor", async () => {
    const { affinity, requests } = client();

    await issue(affinity.orders.retrieve(orderId));

    expect(header(requests[0]!, "Affinity-Actor-Id")).toBeNull();
    expect(header(requests[0]!, "Affinity-Actor-Type")).toBe("system");
  });

  test("preserves signing fields and treats actor attribution as optional for sign", async () => {
    const { affinity, requests } = client();
    const signRequest = {
      practiceId,
      userId: "user_01k123456789abcdefghjkmnpq",
      signatureAttestation: true,
      expectedVersions: [{ prescriptionId: "rx_01k123456789abcdefghjkmnpq", version: 1 }],
    };

    await issue(affinity.orders.sign(orderId, signRequest, { idempotencyKey: "sign-123" }));
    await issue(
      affinity.orders.sign(orderId, signRequest, {
        idempotencyKey: "sign-456",
        actor,
      }),
    );

    expect(await requestBody(requests[0]!)).toEqual(signRequest);
    expect(await requestBody(requests[1]!)).toEqual(signRequest);
    expect(header(requests[0]!, "Idempotency-Key")).toBe("sign-123");
    expect(header(requests[0]!, "Affinity-Actor-Id")).toBeNull();
    expect(header(requests[0]!, "Affinity-Actor-Type")).toBe("system");
    expect(header(requests[1]!, "Idempotency-Key")).toBe("sign-456");
    expect(header(requests[1]!, "Affinity-Actor-Id")).toBe(actor.id);
    expect(header(requests[1]!, "Affinity-Actor-Type")).toBe(actor.type);
  });

  test("validates actor and idempotency options before sending a request", async () => {
    expect(() => client({ actor: { id: " ", type: "system" } as never })).toThrow(/actor ID/i);
    expect(() => client({ actor: { type: "user" } as never })).toThrow(/user actor ID/i);

    const { affinity, requests } = client();

    await expectFailure(
      () => affinity.practices.update(practiceId, { name: "Renamed" }, { idempotencyKey: "  " }),
      /idempotencyKey/i,
    );
    await expectFailure(
      () => affinity.orders.retrieve(orderId, { actor: { id: "x", type: "invalid" } as never }),
      /actor type/i,
    );
    expect(requests).toHaveLength(0);
  });

  test("rejects reserved custom headers regardless of casing", async () => {
    expect(() => client({ headers: { aUtHoRiZaTiOn: "spoofed" } })).toThrow(/reserved/i);

    for (const name of [
      "Affinity-Version",
      "Affinity-Actor-Id",
      "Affinity-Actor-Type",
      "Idempotency-Key",
      "X-Affinity-Organization-Id",
      "Content-Type",
      "X-Affinity-Api-Key",
    ]) {
      const { affinity, requests } = client({ actor });
      const bypass = [...name]
        .map((character, index) =>
          index % 2 === 0 ? character.toLowerCase() : character.toUpperCase(),
        )
        .join("");
      await expectFailure(
        () => affinity.catalog.list({}, { headers: { [bypass]: "spoofed" } }),
        /reserved/i,
      );
      expect(requests).toHaveLength(0);
    }
  });

  test("enforces create-order patient XOR and one-to-twenty prescription rules", async () => {
    const { affinity, requests } = client({ actor });
    const options = { idempotencyKey: "order-validation", actor };

    await expectFailure(
      () =>
        affinity.orders.create({ patientId, prescriptions: [validPrescription] } as never, options),
      /practiceId/i,
    );
    await expectFailure(
      () => affinity.orders.create({ practiceId, prescriptions: [validPrescription] }, options),
      /patient/i,
    );
    await expectFailure(
      () =>
        affinity.orders.create(
          {
            practiceId,
            patientId,
            patient: { dateOfBirth: "1980-01-01", name: { first: "Pat", last: "Example" } },
            prescriptions: [validPrescription],
          },
          options,
        ),
      /patient/i,
    );
    await expectFailure(
      () => affinity.orders.create({ practiceId, patientId, prescriptions: [] }, options),
      /prescription/i,
    );
    await expectFailure(
      () =>
        affinity.orders.create(
          {
            practiceId,
            patientId,
            prescriptions: Array.from({ length: 21 }, () => validPrescription),
          },
          options,
        ),
      /prescription/i,
    );
    expect(requests).toHaveLength(0);
  });

  test("enforces patient XOR and prescription count rules for every order in a batch", async () => {
    const { affinity, requests } = client({ actor });
    const options = { idempotencyKey: "batch-validation", actor };

    await expectFailure(
      () =>
        affinity.orders.createBatch(
          { practiceId, orders: [{ prescriptions: [validPrescription] }] },
          options,
        ),
      /patient/i,
    );
    await expectFailure(
      () =>
        affinity.orders.createBatch(
          {
            practiceId,
            orders: [
              {
                patientId,
                patient: {
                  dateOfBirth: "1980-01-01",
                  name: { first: "Pat", last: "Example" },
                },
                prescriptions: [validPrescription],
              },
            ],
          },
          options,
        ),
      /patient/i,
    );
    await expectFailure(
      () =>
        affinity.orders.createBatch(
          { practiceId, orders: [{ patientId, prescriptions: [] }] },
          options,
        ),
      /prescription/i,
    );
    await expectFailure(
      () =>
        affinity.orders.createBatch(
          {
            practiceId,
            orders: [
              {
                patientId,
                prescriptions: Array.from({ length: 21 }, () => validPrescription),
              },
            ],
          },
          options,
        ),
      /prescription/i,
    );
    expect(requests).toHaveLength(0);
  });

  test("flattens a valid order batch body and applies its typed mutation headers", async () => {
    const { affinity, requests } = client({ actor });
    const batch = {
      practiceId,
      orders: [
        {
          patientId,
          prescriptions: [validPrescription],
        },
      ],
    };

    await issue(affinity.orders.createBatch(batch, { idempotencyKey: "batch-create-123" }));

    expect(requests[0]!.method).toBe("POST");
    expect(requests[0]!.url).toBe(`${baseUrl}/v1/order-batches`);
    expect(header(requests[0]!, "Idempotency-Key")).toBe("batch-create-123");
    expect(header(requests[0]!, "Affinity-Actor-Id")).toBe(actor.id);
    expect(header(requests[0]!, "Affinity-Actor-Type")).toBe(actor.type);
    expect(await requestBody(requests[0]!)).toEqual(batch);
  });

  test("supports the inline patient form when an order has no patient ID", async () => {
    const { affinity, requests } = client({ actor });
    const patient = {
      dateOfBirth: "1980-01-01",
      name: { first: "Pat", last: "Example" },
    };

    await issue(
      affinity.orders.create(
        { practiceId, patient, prescriptions: [validPrescription] },
        { idempotencyKey: "inline-patient", actor },
      ),
    );

    expect(await requestBody(requests[0]!)).toEqual({
      practiceId,
      patient,
      prescriptions: [validPrescription],
    });
  });

  test("passes the request signal through a PHI-capable patient list", async () => {
    const controller = new AbortController();
    const { affinity, requests } = client({ actor });

    await issue(affinity.patients.list(practiceId, {}, { actor, signal: controller.signal }));

    expect(requests[0]!.capturedSignal?.aborted).toBe(false);
  });

  test("maps a path parameter and mutation body on the webhook organization resource", async () => {
    const { affinity, requests } = client();

    await issue(
      affinity.webhooks.update(
        endpointId,
        {
          description: "Orders",
          payloadStyle: "thin",
          status: "active",
          subscribedEvents: ["order.created"],
          url: "https://example.test/webhooks",
        },
        {
          idempotencyKey: "webhook-update",
          organizationId: "acct_01k123456789abcdefghjkmnpq",
        },
      ),
    );

    expect(requests[0]!.url).toBe(`${baseUrl}/v1/webhook-endpoints/${endpointId}`);
    expect(header(requests[0]!, "X-Affinity-Organization-Id")).toBe(
      "acct_01k123456789abcdefghjkmnpq",
    );
    expect(await requestBody(requests[0]!)).toEqual({
      description: "Orders",
      payloadStyle: "thin",
      status: "active",
      subscribedEvents: ["order.created"],
      url: "https://example.test/webhooks",
    });
  });

  test("uses ergonomic names for allergy retrieval and Team user creation", async () => {
    const { affinity, requests } = client({ actor });

    await issue(affinity.patients.retrieveAllergies(practiceId, patientId));
    await issue(
      affinity.team.createUser(
        practiceId,
        {
          externalId: "ehr-user-123",
          email: "user@example.test",
          name: "Example User",
          role: "developer",
          identityAttestation: true,
        },
        { idempotencyKey: "user-create-123" },
      ),
    );

    expect(requests[0]!.url).toBe(
      `${baseUrl}/v1/practices/${practiceId}/patients/${patientId}/allergies`,
    );
    expect(requests[1]!.url).toBe(`${baseUrl}/v1/practices/${practiceId}/users`);
    expect(await requestBody(requests[1]!)).toEqual({
      externalId: "ehr-user-123",
      email: "user@example.test",
      name: "Example User",
      role: "developer",
      identityAttestation: true,
    });
  });
});

test("rejects explicitly blank patient IDs even alongside inline patient data", async () => {
  const { affinity, requests } = client({ actor });
  const patient = { dateOfBirth: "1980-01-01", name: { first: "Pat", last: "Example" } };
  const options = { idempotencyKey: "invalid-patient" };
  for (const patientId of ["", "  "]) {
    await expectFailure(
      () =>
        affinity.orders.create(
          { practiceId, patientId, patient, prescriptions: [validPrescription] } as never,
          options,
        ),
      /patient/i,
    );
    await expectFailure(
      () =>
        affinity.orders.createBatch(
          {
            practiceId,
            orders: [{ patientId, patient, prescriptions: [validPrescription] }],
          } as never,
          options,
        ),
      /patient/i,
    );
  }
  expect(requests).toHaveLength(0);
});
