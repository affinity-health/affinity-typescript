# Affinity TypeScript SDK

Server-side TypeScript client for the Affinity MVP API `2026-10-20`. Version `2.0.0-beta.0` replaces the previous API contract. Use Node.js 20+, Bun, AWS Lambda, or a compatible Fetch runtime. Keep API keys on your server.

## Quickstart

Install the prepared tarball locally with `bun add /path/to/affinity-health-sdk-2.0.0-beta.0.tgz`. This beta has not been published to npm.

The API key selects Test or Live mode. Set `AFFINITY_API_KEY` to a Test key and `AFFINITY_PRACTICE_ID` to your practice ID. This example uses synthetic patient data; select a medication and prescription values reviewed for your Test integration.

```typescript
import { Affinity, type OrderCreateParams, verifyAffinityWebhook } from "@affinity-health/sdk";

const api = new Affinity(process.env.AFFINITY_API_KEY!);
if ((await api.account.get()).mode !== "test") throw new Error("Use a Test key");

const medications = await api.medications.list({ limit: 10 });
const medication = await api.medications.get(medications.data[0]!.id);
const input: OrderCreateParams = {
  practiceId: process.env.AFFINITY_PRACTICE_ID!,
  externalOrderId: "sdk-test-order-1",
  prescriber: { npi: "1234567893", firstName: "Sam", lastName: "Example" },
  signatureAttestation: true,
  shippingOptionId: medication.shippingOptions[0]!.id,
  patient: {
    externalId: "sdk-test-patient-1",
    firstName: "Synthetic",
    lastName: "SDKB01",
    dateOfBirth: "1990-01-01",
    gender: "unknown",
    phone: "+12025550199",
    email: "sdk-test@example.invalid",
    allergies: [],
    address: { line1: "100 Congress Ave", city: "Austin", state: "TX", postalCode: "78701" },
  },
  prescriptions: [
    {
      medicationId: medication.id,
      quantity: medication.quantities[0] ?? 1,
      refills: 0,
      directions: "Use as reviewed by the prescriber",
      compoundingReason: medication.compoundingReasons[0],
    },
  ],
};

const endpoint = await api.webhooks.endpoints.create({
  url: "https://your-server.example/webhooks/affinity",
});
// Save endpoint.secret securely with its organization and mode. It is returned once.

// Persist each complete clinician-approved request and key before sending.
// Check medication.requirements for pharmacy-specific fields.
const order = await api.orders.create(input, { idempotencyKey: "saved-sdk-order-1" });
const current = await api.orders.get(order.id);

// A second order with the same patient externalId reuses the patient.
const returning = await api.orders.create(
  { ...input, externalOrderId: "sdk-test-order-2" },
  { idempotencyKey: "saved-sdk-order-2" },
);
if (returning.patientId !== current.patientId) throw new Error("Patient was not reused");

const page = await api.orders.list({ practiceId: input.practiceId, limit: 1 });
if (page.hasMore && page.nextCursor) {
  await api.orders.list({ practiceId: input.practiceId, limit: 1, startingAfter: page.nextCursor });
}
if (medications.hasMore && medications.nextCursor) {
  await api.medications.list({ limit: 10, startingAfter: medications.nextCursor });
}
const cancellation = await api.orders.cancel(order.id);
// Inspect cancellation.status and cancelRequestedAt; pharmacy confirmation may be pending.

// In your webhook handler, verify the raw body before parsing or processing it.
async function receive(request: Request) {
  const event = await verifyAffinityWebhook({
    body: await request.arrayBuffer(),
    signature: request.headers.get("affinity-signature"),
    secret: endpoint.secret,
  });
  // Deduplicate event.id durably before applying a newer data.order.updatedAt.
  return event;
}
```

`orders.create` creates, signs, and submits in one call. There is no `submit` flag or public patient resource. Read patient data on the order. Retry an unchanged request with its saved idempotency key.

The defaults are `https://api.affinityrx.com`, a 60-second timeout, and no automatic retries. For staging, pass `{ baseUrl: "https://api-staging.affinityrx.com" }` to the client. The [guide](docs/guide.md) covers errors, iterators, webhook handling, and migration from the previous SDK. [Examples](examples/) use synthetic Test data.

## Build and verify

```sh
bun install --frozen-lockfile
bun run generate
bun run check
bun run pack:dry-run
```

The pinned [OpenAPI contract](spec/affinity.openapi.json) was fetched from `https://api-staging.affinityrx.com/v1/openapi.json`. It includes the API's webhook schema. `scripts/generate.sh` reads this local file through `scripts/generate-facade.ts`; generation requires no network access. Refresh the pinned file from that route before preparing a new staging beta, then regenerate and review the contract changes.

The generator owns `src/` and `generation.json`. Checks build the package, inspect its exports, install its tarball into a temporary consumer, typecheck with NodeNext and Bundler resolution, and run synthetic requests under Node and Bun. They do not publish or call a hosted API.
