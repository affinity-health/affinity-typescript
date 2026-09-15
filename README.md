# Affinity TypeScript SDK

The official generated TypeScript client for the Affinity API.

## Install

```sh
bun add @affinity-health/sdk
```

The package also works in Node.js, AWS Lambda, and standards-based worker runtimes.

## Usage

```ts
import { Affinity } from "@affinity-health/sdk";

const affinity = new Affinity(process.env.AFFINITY_API_KEY!);

const access = await affinity.apiKeys.getApiAccess();
const practices = await affinity.practices.listPractices({ limit: 25 });
const catalog = await affinity.catalog.listCatalogItems({ query: "semaglutide", limit: 10 });

console.log(access, practices.data, catalog.data);
```

`Affinity` creates configured instances of the generated API groups. The groups are also exported
directly when you need to provide your own `Configuration`:

```ts
import { Configuration, OrdersApi } from "@affinity-health/sdk";

const configuration = new Configuration({
  accessToken: process.env.AFFINITY_API_KEY!,
  basePath: "https://api.joinaffinityai.com",
  headers: { "Affinity-Version": "2026-08-11" },
});
const orders = new OrdersApi(configuration);
```

The generated methods expose the request types and exact operation names from the deployed OpenAPI
document. Use the generated `*RequestOpts` methods when you need to inspect or customize a request
before sending it.

## API groups

- `account` and `apiKeys`
- `catalog`
- `locations`
- `orders`
- `patients`
- `platformPricing`
- `practices`
- `sessions`
- `team`
- `webhooks`

The generated reference pages are in [`docs/`](./docs). The API contract is copied to
[`spec/affinity.openapi.json`](./spec/affinity.openapi.json) from the deployed
[`/v1/openapi.json`](https://api.joinaffinityai.com/v1/openapi.json).

## Authentication and safety

API keys are service credentials. Keep them in a trusted backend or worker and never bundle them in
browser or mobile code. Requests may contain protected health information. Integrators are
responsible for authorization, logging, retention, infrastructure, and compliance controls.

## Generate and validate

This repository uses OpenAPI Generator's `typescript-fetch` generator. Java 17 is required.

```sh
bun install --frozen-lockfile
bun run generate
bun run check
bun run pack:dry-run
```

Do not hand-edit generated API classes, models, runtime files, or documentation. Update the source
OpenAPI contract and run the generator.

## Webhooks

Verify webhook signatures against the exact raw request body before parsing it. The generated
webhook request and response models are available from the package exports.

## License

MIT
