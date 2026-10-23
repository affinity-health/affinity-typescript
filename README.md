# Affinity TypeScript SDK

Typed server-side client for Node.js 20+, Bun, AWS Lambda, and supported Fetch runtimes.
This checkout targets API version `2026-10-20` and sends it in `Affinity-Version` on every request.

## Install

```sh
bun add @affinity-health/sdk@next
```

For npm, use `npm install @affinity-health/sdk@next`.

Install the MVP SDK with `@next`. Bare installs select `latest`, which remains `1.16.0` and targets the older API version that staging rejects. Do not move `latest` for a beta release. This checkout prepares `2.0.0-beta.5` for the staging-only MVP API; configure the staging base URL shown below. Production still serves the previous API until the MVP cutover.

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

The key determines the organization and Test or Live mode. Platform keys must supply `practiceId` when creating an order; practice keys may omit it. Practice creation requires `name`, `address`, and `phone`. Optional `prescriber.phone` and `prescriber.address` override practice contact details, and order responses include both the practice snapshot and prescriber contact details. Patient details are supplied through the order; the current public contract has no patient resource.

Read the [SDK guide](docs/guide.md) for practices, reviewed order creation, pagination, errors, and webhooks. Order creation signs and submits in one request. `orders.create(input, { idempotencyKey })` requires a key saved with the reviewed order before the first request. Retry the same body with that saved key after a timeout or process restart. Automatic retries reuse it. Other writes generate a random key when omitted; pass a persisted key to retry them across separate calls.

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
