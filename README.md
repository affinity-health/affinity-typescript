# Affinity TypeScript SDK

The official TypeScript SDK for the Affinity API.

> **Status:** The `0.1.0` client is ready for local integration preview. The package is not yet
> published; use Bun's local package link until the first npm release.

The SDK will provide a small, resource-oriented interface for software platforms connecting
healthcare practices to Affinity's compounder network. It is intended for trusted server-side
runtimes, including Node.js, Bun, AWS Lambda, and standards-based worker environments.

## Local preview

```sh
git clone https://github.com/affinity-health/affinity-typescript.git
cd affinity-typescript
bun install
bun run check
bun link

cd ../your-server
bun link @affinity-health/sdk
```

## Intended usage

```ts
import { Affinity } from "@affinity-health/sdk";

const affinity = new Affinity(process.env.AFFINITY_API_KEY!, {
  apiVersion: "2026-07-09",
});

const access = await affinity.account.retrieveAccess();
if (access.livemode) throw new Error("Use a test-mode key during sandbox development");

const catalog = await affinity.catalog.list({ query: "semaglutide", limit: 10 });

const practices = await affinity.practices.list();
const orders = await affinity.orders.list();
```

## Resource model

The initial client surface is planned around these resources:

- `account` — inspect the authenticated organization and API access
- `catalog` — search products available through the Affinity network
- `practices` — create and manage customer practices
- `orders` — create, submit, inspect, update, and cancel orders
- `webhooks` — manage endpoints and inspect or replay events

Generated transport classes will remain available as an escape hatch, while the `Affinity` client
will be the recommended entry point.

## Safety

Affinity API keys are service-account credentials. Use this SDK only in a trusted backend and load
keys from server-side secret storage. Do not bundle a key into browser or mobile code.

Requests involving patient, prescription, or fulfillment data may contain protected health
information. Integrators are responsible for their own authorization, logging, retention,
infrastructure, and compliance controls.

## Generation and releases

This SDK is generated from the versioned contract in
[`affinity-openapi`](https://github.com/affinity-health/affinity-openapi), with a maintained
resource facade layered over the generated transport. Releases will be validated against the same
contract before publication to npm.

Regenerate and validate the checked-in client with:

```sh
bun run generate
bun run check
bun run pack:dry-run
```

## Related projects

- [OpenAPI specification](https://github.com/affinity-health/affinity-openapi)
- [SST backend starter](https://github.com/affinity-health/affinity-sst-backend)
