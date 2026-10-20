# Affinity TypeScript SDK

Typed server-side client for Node.js 20+, Bun, AWS Lambda, and supported Fetch runtimes.
This checkout targets API version `2026-10-20` and sends it in `Affinity-Version` on every request.

## Install

```sh
bun add @affinity-health/sdk@next
```

Pin this release with `bun add @affinity-health/sdk@2.0.0-beta.4`. The beta targets the staging-only MVP API. Production still serves the previous API; use stable `1.16.0` for production until the MVP cutover.

## Use

Keep API keys on the server. Never put them in browser bundles, mobile applications, or public environment variables.

```typescript
import { Affinity } from "@affinity-health/sdk";

const api = new Affinity(process.env.AFFINITY_API_KEY!, {
  baseUrl: "https://api-staging.affinityrx.com",
});
const account = await api.account.get();
if (account.mode !== "test") throw new Error("Use a Test key for this example");

const medications = await api.medications.list({ limit: "20", query: "semaglutide" });
console.log(`Found ${medications.data.length} medications`);
```

The key determines the organization and Test or Live mode. Supply `practiceId` in order creation or order-list filters where required. Patient details are supplied through the order; the current public contract has no patient resource.

Read the [SDK guide](docs/guide.md) for practices, reviewed order creation, pagination, errors, and webhooks. Order creation signs and submits in one request. The SDK generates a random `Idempotency-Key` for each call that requires one and reuses it for automatic retries. Pass a persisted `idempotencyKey` in request options to retry the same operation across separate calls.

## Migrate to the MVP contract

Use `new Affinity(key, options)` and the resources `account`, `medications`, `practices`, `orders`, `webhooks`, and `feedback`. The retired catalog, patient, team, order-preview, draft, separate signing, and separate submission APIs are absent. There is no `forPractice` client or `CompoundingReason` helper. Use generated aliases such as `OrderCreateParams` and `MedicationListParams`; `Patient` means `OrderCreateParams['patient']` and `Medication` means `MedicationGetResponse`.

## Build and verify

```sh
bun install --frozen-lockfile
bun run generate
bun run check
bun run pack:dry-run
```

[Quickstart](examples/quickstart.ts) performs Test reads. [EMR workflow](examples/emr-order.ts) demonstrates sending a clinician-reviewed order and receiving signed webhooks. The [TanStack Start example](examples/tanstack-start/README.md) keeps credentials on the server and provides a private Test directory and medication browser.
