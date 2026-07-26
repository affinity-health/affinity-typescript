# Affinity TypeScript SDK

The official TypeScript SDK for the Affinity API.

> **Status:** The `0.1.0` client is ready for integration validation. The npm release has not been
> published yet; install the GitHub repository at an exact reviewed commit until that release is
> available.

The SDK will provide a small, resource-oriented interface for software platforms connecting
healthcare practices to Affinity's compounder network. It is intended for trusted server-side
runtimes, including Node.js, Bun, AWS Lambda, and standards-based worker environments.

## Install

```sh
bun add github:affinity-health/affinity-typescript#<reviewed-commit-sha>
```

## Intended usage

```ts
import { Affinity } from "@affinity-health/sdk";

const affinity = new Affinity(process.env.AFFINITY_API_KEY!);

const access = await affinity.account.retrieveAccess();
if (access.livemode) throw new Error("Use a test-mode key during sandbox development");

const catalog = await affinity.catalog.list({ query: "semaglutide", limit: 10 });
const item = catalog.data[0];
if (item) {
  console.log(item.pricing.medicationSubtotalCents);
  console.log(item.pricing.serviceFeeCents);
  console.log(item.pricing.orderTotalCents);
}

const practices = await affinity.practices.list();
const orders = await affinity.orders.list({ practiceId: practices.data[0]?.id });
```

The API key belongs only in your backend. Never create an `Affinity` client in browser or mobile
code.

## Affinity Hosted access

Use your own stable customer identifier as `externalId`; do not use email as identity or
authorization. Email is optional and can change.

```ts
const user = await affinity.users.create(
  {
    externalId: "customer_123",
    email: "clinician@example.com",
    name: "Jordan Lee",
    metadata: {},
  },
  { idempotencyKey: "customer_123" },
);

const practice = (await affinity.practices.list()).data[0];
if (!practice) throw new Error("Create a practice before granting access");
const role = (await affinity.roles.list(practice.id)).data[0];
if (!role) throw new Error("Create a practice role before granting access");

const membership = await affinity.memberships.create(
  practice.id,
  {
    roleId: role.id,
    termsVersion: "2026-07-26",
    userId: user.id,
  },
  { idempotencyKey: `membership:${practice.id}:${user.id}` },
);

const session = await affinity.portalSessions.create(
  {
    destination: "/prescriptions",
    membershipId: membership.id,
    practiceId: practice.id,
    returnUrl: "https://platform.example.com/affinity/return",
    userId: user.id,
  },
  { idempotencyKey: crypto.randomUUID() },
);

// Redirect the user's browser to this single-use, 15-minute URL.
console.log(session.url);
```

The user reviews and accepts the practice role in Affinity before the pending membership becomes
active. Return URLs must exactly match an allowlisted URL configured for the same API mode.

## Resource model

The client surface is organized around these resources:

- `account` — inspect the authenticated organization and API access
- `catalog` — search products available through the Affinity network
- `users` — provision platform-owned user records by stable external ID
- `practices` — create and manage customer practices
- `roles` — list and manage custom practice roles
- `memberships` — create consent-bound practice role grants
- `portalSessions` — create short-lived, single-use Affinity Hosted launch URLs
- `orders` — create, submit, inspect, update, and cancel orders
- `webhooks` — manage endpoints and inspect or replay events

Generated transport classes will remain available as an escape hatch, while the `Affinity` client
will be the recommended entry point.

Each clinical order belongs to exactly one practice. A platform can list orders across all of its
practices or pass `practiceId` to scope the operational view to one practice. Platform-created
`externalOrderId` values are unique within that platform and API mode.

Catalog prices use US cents. `medicationSubtotalCents` is the pharmacy medication price.
`serviceFeeCents` is the Affinity fee. The fee is 15% of the medication subtotal. It does not apply
to shipping or tax. `orderTotalCents` is the amount due before shipping and tax.

The practice pays for an order. The pharmacy is the seller and merchant of record. Affinity charges
the practice card when the pharmacy accepts the order. Platforms do not collect payment data and do
not pay for orders.

## Safety

Affinity API keys are service-account credentials. Use this SDK only in a trusted backend and load
keys from server-side secret storage. Do not bundle a key into browser or mobile code.

Requests involving patient, prescription, or fulfillment data may contain protected health
information. Integrators are responsible for their own authorization, logging, retention,
infrastructure, and compliance controls.

## Generation and releases

This SDK is generated from Affinity's curated public API document at
[`/v1/openapi.json`](https://api.joinaffinityai.com/v1/openapi.json), with a maintained resource
facade layered over the generated transport. Releases will be validated against the same contract
before publication to npm.

Regenerate and validate the checked-in client with:

```sh
bun run generate
bun run check
bun run pack:dry-run
```

## Related projects

- [OpenAPI specification](https://github.com/affinity-health/affinity-openapi)
- [SST backend starter](https://github.com/affinity-health/affinity-sst-backend)
