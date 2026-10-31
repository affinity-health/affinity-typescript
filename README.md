# Affinity TypeScript SDK

Typed server-side client for the Affinity API, for Node.js 20+, Bun, AWS Lambda and other Fetch runtimes. It ships an ES module and a CommonJS build, so `import` and `require()` both work. It targets API version `2026-10-28` and sends it in `Affinity-Version` on every request.

## Install

```sh
bun add @affinity-health/sdk@next
```

For npm, use `npm install @affinity-health/sdk@next`. Install with `@next`: the `latest` tag is `1.16.0`, for an API version the API no longer accepts.

## Use

Keep API keys on the server. Never put them in browser bundles, mobile applications or public environment variables.

```typescript
import { AffinityClient } from "@affinity-health/sdk";

const affinity = new AffinityClient({ token: process.env.AFFINITY_API_KEY! });
const account = await affinity.account.get();
if (account.mode !== "test") throw new Error("Use a Test key for this example");

for await (const medication of await affinity.medications.list())
  console.log(medication.name, medication.pharmacy.name);
```

The key sets the organization and the Test or Live mode. Test orders go to a test pharmacy.

- **Writes need an `idempotencyKey`.** Save it with the reviewed order before the first request, and reuse it to retry. The client's automatic retries (2 by default, for 408, 429 and 5xx) reuse it.
- **Lists iterate every page.** `for await` reads each next page; `page.data` is one page.
- **Errors are typed.** `Affinity.UnprocessableEntityError` carries the `issues` that name each refused field. Every error extends `AffinityError` with `statusCode`, `body` and `requestId`.
- **Webhooks verify.** `verifyAffinityWebhook` checks the `Affinity-Signature` of the raw body.

Read the [SDK guide](https://github.com/affinity-health/affinity-typescript/blob/main/docs/guide.md) for orders, idempotency, pagination, errors and webhooks, and the [API reference](https://github.com/affinity-health/affinity-typescript/blob/main/docs/reference.md) for every method. The [quickstart](https://github.com/affinity-health/affinity-typescript/blob/main/examples/quickstart.ts) reads Test data; the [EMR example](https://github.com/affinity-health/affinity-typescript/blob/main/examples/emr-order.ts) sends a clinician-reviewed order and receives its webhooks.

## Build and verify

[Fern](https://buildwithfern.com) generates `src/generated` from `spec/affinity.openapi.json`, the Affinity API contract; it runs locally in Docker, with no Fern account. Webhook verification in `src/webhook-events.ts` is written by hand.

```sh
bun install --frozen-lockfile
bun run generate      # regenerate after the contract changes (needs Docker)
bun run check         # build, regenerate-and-compare, types, tests, package and examples
AFFINITY_API_KEY=sk_test_... bun run smoke   # every operation against a real API, Test mode only
```

`bun run smoke` checks every response against the contract. It creates a Test practice and a Test order and cancels the order. Set `AFFINITY_BASE_URL` to call another API, and `AFFINITY_SMOKE_WEBHOOK_URL` to include webhook endpoints.
