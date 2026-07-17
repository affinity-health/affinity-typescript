# Affinity TypeScript SDK

The official TypeScript SDK for the Affinity API.

> **Status:** This repository is being prepared for its first release. The package is not yet
> published and its public API may change before `0.1.0`.

The SDK will provide a small, resource-oriented interface for software platforms connecting
healthcare practices to Affinity's compounder network. It is intended for trusted server-side
runtimes, including Node.js, Bun, AWS Lambda, and standards-based worker environments.

## Planned package

```sh
bun add @affinity/sdk
```

## Intended usage

```ts
import { Affinity } from "@affinity/sdk";

const affinity = new Affinity(process.env.AFFINITY_API_KEY!, {
  apiVersion: "2026-07-09",
});

const catalog = await affinity.catalog.list({
  query: "semaglutide",
});

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

This SDK will be generated from the versioned contract in
[`affinity-openapi`](https://github.com/affinity-health/affinity-openapi), with a maintained
resource facade layered over the generated transport. Releases will be validated against the same
contract before publication to npm.

## Related projects

- [OpenAPI specification](https://github.com/affinity-health/affinity-openapi)
- [SST backend starter](https://github.com/affinity-health/affinity-sst-backend)

