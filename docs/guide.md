# TypeScript SDK guide

Version `2.0.0-beta.0` targets API `2026-10-20`. Use the SDK only from trusted servers running Node.js 20+, Bun, Lambda, or supported Fetch runtimes.

## Connect

```typescript
import { Affinity, AffinityError } from "@affinity-health/sdk";
const api = new Affinity(process.env.AFFINITY_API_KEY!);
const account = await api.account.get();
```

The API key selects the organization and Test or Live mode. `account.mode` is `test` or `live`; `account.type` identifies the organization. Each SDK call makes its own request directly, without an access-discovery preflight.

## Select a medication and shipping option

```typescript
const page = await api.medications.list({ query: "semaglutide", limit: 20 });
const medication = await api.medications.get(page.data[0]!.id);
```

Medication IDs start with `med_`. Prices are integer cents. Each medication supplies `shippingOptions`, `requirements`, allowed `quantities`, `compoundingReasons`, and `restrictedStates`. Collect pharmacy-required prescription fields from `requirements` before submission. A compounding reason is a string, rather than the previous category/context object.

## Submit an order

One request creates, signs, and submits an order. Authenticate the clinician and persist their approval of the complete request and its idempotency key before sending. Never infer signing consent or change the request during a retry.

```typescript
const order = await api.orders.create(
  {
    practiceId: "prac_synthetic",
    externalOrderId: "synthetic-job-1",
    prescriber: { npi: "1234567893", firstName: "Sam", lastName: "Example" },
    signatureAttestation: true,
    shippingOptionId: "shp_synthetic",
    patient: {
      externalId: "synthetic-patient-1",
      firstName: "Synthetic",
      lastName: "Patient",
      dateOfBirth: "1990-01-01",
      gender: "unknown",
      phone: "+12025550199",
      email: "patient@example.test",
      allergies: [],
      address: {
        line1: "100 Test St",
        line2: null,
        city: "Austin",
        state: "TX",
        postalCode: "78701",
      },
    },
    prescriptions: [
      {
        medicationId: "med_synthetic",
        quantity: 1,
        refills: 0,
        directions: "Use as reviewed",
        compoundingReason: "Clinician-reviewed reason",
      },
    ],
  },
  { idempotencyKey: "persisted-synthetic-job-1" },
);
```

Returning patients go inside the next order too. Send the same `patient.externalId`, or the returned `order.patientId` as `patient.id`, so the API reuses and updates that patient. An order without either always creates a new patient, even with the same name and contact details. Read `order.patientId` to confirm reuse. There are no public patient read or list routes.

Use actual IDs returned by the API. The example identifiers are placeholders. All prescriptions are for one patient and pharmacy. `allergies: []` means no known allergies and requires the clinician's confirmation. Supply the prescriber's NPI and name for API-key submission even though the shared contract also supports dashboard sessions.

Retry the same request with the same persisted key after a timeout. Use a new key for a different order. `practices.create({ name }, { idempotencyKey })` also requires a persisted key. Other public writes do not take an idempotency key and are not retried automatically.

```typescript
const current = await api.orders.get(order.id);
const cancellation = await api.orders.cancel(order.id);
```

Cancellation can return immediately confirmed or pending. Both `200` and `202` return an order. Inspect `status` and `cancelRequestedAt`; a pending request does not mean the pharmacy confirmed cancellation. Refunds are manual.

## Practices and webhooks

```typescript
const practice = await api.practices.create(
  { name: "Synthetic practice" },
  { idempotencyKey: "persisted-practice-1" },
);
await api.practices.update(practice.id, { phone: "+12025550199" });
const endpoint = await api.webhooks.endpoints.create({ url: "https://example.test/webhooks" });
```

The platform creates and manages its practices. A practice key reads its own practice. A Live platform key can change practice Live enablement. The API enforces organization and mode authorization. Endpoint creation returns its secret once; store it on the server. Endpoints belong to the key's organization and mode, including for a platform key.

## Pagination

Lists return `{ object: "list", url, data, hasMore, nextCursor }`. Pass the opaque cursor unchanged. A cursor is bound to the filters that produced it.

```typescript
const page = await api.orders.list({ practiceId: "prac_synthetic", limit: 20 });
if (page.hasMore && page.nextCursor) {
  await api.orders.list({
    practiceId: "prac_synthetic",
    limit: 20,
    startingAfter: page.nextCursor,
  });
}
for await (const order of api.orders.iterate({ practiceId: "prac_synthetic", limit: 100 })) {
  // Persist updates in your integration.
}
```

`iterate()` is lazy and follows `nextCursor` forward. Use `list()` with `endingBefore` to go backward, except medications, which support forward pagination only. Do not substitute the last record ID for the cursor.

## Errors and transport

```typescript
try {
  await api.orders.get("ord_synthetic");
} catch (error) {
  if (!(error instanceof AffinityError)) throw error;
  console.error({ code: error.code, status: error.status, requestId: error.requestId });
}
```

`AffinityConnectionError` covers network failures and timeouts; `AffinityNotFoundError` covers 404 responses. Messages omit private problem details. Field errors stay in `error.problem.issues` with `field` and `path`. Keep clinical data out of logs. Request options accept `signal` for cancellation. `maxNetworkRetries` defaults to zero; when enabled, only reads and writes with persisted idempotency keys retry. Each attempt keeps its timeout active through response-body consumption.

## Verify webhooks

```typescript
import { verifyAffinityWebhook } from "@affinity-health/sdk";
const event = await verifyAffinityWebhook({
  body: await request.arrayBuffer(),
  signature: request.headers.get("affinity-signature"),
  secret: endpointSigningSecret,
});
if (event.data.order) {
  // Deduplicate event.id durably, then apply only a newer order.updatedAt.
}
```

MVP events contain `{ id, type, createdAt, data }`; order events carry `data.order` with order ID, external order ID, status, failure reason, cancellation request time, shipments, and update time. Test events carry `data: {}`. There is no patient or prescription data. The signing secret identifies the endpoint's organization and mode, so retain that association locally. The payload no longer carries `organization_id`, `livemode`, or `api_version`.

Pass the raw body before parsing. The verifier snapshots binary input before awaiting crypto, uses HMAC-SHA256 over `timestamp.body`, and defaults to a 300-second replay tolerance. Invalid clock overrides reject with `invalid_timestamp`. For rotation, pass an array of active secrets. Unknown event types, new status strings, and additive fields remain verifiable; branch only on types your integration handles. Durably deduplicate events and acknowledge after enqueueing. They can arrive more than once and out of order.

## Breaking changes from the previous client

- The default API version is `2026-10-20`. `/v1/auth/access` is gone; use `account.get()` for explicit identity and mode reads.
- `catalog.items` becomes `medications`. Removed catalog pricing, prescribing-options, shipping-option routes, pharmacies, and their types have no facade methods. Medication responses include prices and shipping options.
- Public patient, location, team, API-key administration, draft, preview, sign, submit, batch, review, and simulation APIs are removed. Their methods and parameter types are removed. The obsolete TanStack demo is removed.
- `forPractice()` and request options for practice, organization, and actor context are removed. `orders.create` takes `practiceId` in its body, and `orders.list` takes it in query parameters. Other paths use their own resource IDs.
- Order creation takes inline patient data, NPI/name, attestation, shipping option, and complete prescriptions. It submits immediately; there is no separate `submit` flag. Revision fields, metadata, OTC items, actor headers, and structured compounding reasons are removed. `orders.cancel(id)` takes no reason body.
- `practices.create` now requires a persisted idempotency key. Nullable and optional fields follow the pinned contract. Addresses are nested. Platform IDs use `plat_`.
- Lists use opaque `nextCursor` values. Webhook consumers must migrate from `data.object` and snake-case envelope fields to the MVP envelope and `data.order`. Historical event aliases and `CompoundingReason` enum are removed.
