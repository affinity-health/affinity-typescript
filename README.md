# Affinity TypeScript SDK

The official TypeScript SDK for the Affinity API. It provides a small, typed resource interface
over the generated OpenAPI transport layer.

## Install

```sh
bun add @affinity-health/sdk
```

The package supports trusted server-side Bun, Node.js, AWS Lambda, and standards-based worker
runtimes. Keep service API keys out of browser and mobile bundles.

## Usage

```ts
import { Affinity } from "@affinity-health/sdk";

const affinity = new Affinity(process.env.AFFINITY_API_KEY!);

const access = await affinity.apiKeys.retrieve();
const practices = await affinity.practices.list({ limit: 25 });
const catalog = await affinity.catalog.list({ query: "semaglutide", limit: 10 });

console.log(access, practices.data, catalog.data);
```

Resource methods use names such as `create`, `retrieve`, `list`, `update`, `cancel`, `sign`, and
`submit`. Request bodies are passed directly, while path identifiers are separate arguments:

```ts
const patient = await affinity.patients.create(
  "prac_...",
  {
    dateOfBirth: "1990-01-01",
    email: "patient@example.com",
    externalId: "patient-456",
    name: { first: "Demo", last: "Patient" },
  },
  {
    idempotencyKey: crypto.randomUUID(),
  },
);

const order = await affinity.orders.create(
  {
    practiceId: "prac_...",
    patientId: patient.id,
    prescriptions: [
      {
        medicationId: "cat_...",
        daysSupply: 30,
        dispensing: { dispenseUponAcceptance: false },
        directions: "Take one capsule by mouth once daily",
        quantity: 30,
        quantityUnit: "capsule",
        refills: 0,
        structuredSig: {
          dose: "1",
          doseUnit: "capsule",
          frequency: "once daily",
          route: "oral",
        },
      },
    ],
  },
  {
    idempotencyKey: crypto.randomUUID(),
  },
);
```

Order creation requires `practiceId` and `prescriptions`, plus exactly one of `patientId` or an
inline `patient` according to the API's business rules. Do not use the SDK to bypass clinical
eligibility, signing, or actor-attribution checks.

## Client and request options

Client-wide options establish defaults for every resource call:

```ts
const affinity = new Affinity(process.env.AFFINITY_API_KEY!, {
  apiVersion: "2026-08-11",
  organizationId: "acct_...",
  baseUrl: "https://api.joinaffinityai.com",
  fetch: globalThis.fetch,
  headers: { "X-Integration-Trace": "sync-worker" },
});
```

By default the client sends bearer authentication, `Affinity-Version: 2026-08-11`, and a system
actor to `https://api.joinaffinityai.com`. Affinity attributes the default actor to the
authenticated service account. Supply `baseUrl` for a compatible endpoint and `fetch` when the
runtime needs a custom transport implementation.

The final options argument to each resource method overrides request-scoped transport settings. It
can include `apiVersion`, `organizationId`, `actor`, `headers`, and `signal`. Mutations also require
a non-empty `idempotencyKey` in that options object. A per-request actor overrides the client actor.

A user actor requires the stable external user ID from your application. Add a stable system ID
only when several automated workers share a service account and need separate audit identities.

Use `headers` for additional custom headers. Affinity-managed headers must be set through their
typed options: `apiVersion`, `organizationId`, `actor`, and `idempotencyKey`. The SDK rejects
attempts to supply those managed headers, authentication headers, or the content type through the
custom header map. Custom headers are merged case-insensitively, with request-scoped values taking
precedence.

## Pagination

List responses include the API's `data` and `hasMore` fields. List methods expose the contract's
typed `startingAfter` and `endingBefore` cursor parameters. Pass the last returned resource ID to
`startingAfter` to continue forward, or the first ID from the current page to `endingBefore` to
walk backward. Automatic cursor iteration is intentionally a follow-up so callers can choose their
own back-pressure and error handling.

## Resources and generated contract

The public resource groups are `account`, `apiKeys`, `catalog`, `locations`, `orders`, `patients`,
`platformPricing`, `practices`, `sessions`, `team`, and `webhooks`.

The SDK exposes 69 typed resource methods. The two Test order simulation controls remain available
through `rawRequest`. The generated OpenAPI transport and models remain private implementation
details of the package root.
Use `rawRequest` to call a preview endpoint or another API path that the installed SDK version does
not support yet:

```ts
const preview = await affinity.rawRequest(
  "POST",
  "/v1/beta_endpoint",
  { value: 123 },
  {
    idempotencyKey: crypto.randomUUID(),
  },
);
```

Like Stripe's custom-request interface, `rawRequest` takes the HTTP method, a relative path, optional
request parameters, and request options. It returns the parsed JSON response without a contract
type. Pass query parameters in the path. Request parameters are supported for `POST`, `PUT`, and
`PATCH`. The method reuses the client's authentication, API version, base URL, custom transport, and
default headers. Request options can override `apiVersion`, `organizationId`, `actor`, `headers`, and
`signal`, or supply an `idempotencyKey`.

Use public resources for documented endpoints. They validate inputs and return contract types.
`rawRequest` rejects absolute and authority-relative URLs so it cannot send the API key to another
host. Generated API classes, `Configuration`, model serializers, and transport request envelopes are
not root exports or package subpaths.

## Compatibility

The resource properties previously exposed generated operation names such as `getApiAccess`,
`listCatalogItems`, `createPractice`, `listOrders`, and `getPracticeTeam`. This release intentionally
breaks those generated method exports; migrate calls to the resource names documented above, such
as `retrieve`, `list`, or `create`. Use `rawRequest` only when the installed SDK does not yet have a
documented endpoint.

## Authentication and safety

API keys are service credentials. Use an `sk_test_...` key for Test mode and keep keys in a trusted
backend or worker; never bundle them in browser or mobile code. Requests may contain protected
health information. Integrators are responsible for authorization, logging, retention,
infrastructure, and compliance controls.

## Generate and validate

This repository uses OpenAPI Generator's `typescript-fetch` generator. Java 17 is required. The
generator rebuilds the private transport code and the public resource facade from the same
contract, so regeneration preserves the public calling pattern and checks the operation coverage.

```sh
bun install --frozen-lockfile
bun run generate
bun run check
bun run pack:dry-run
```

Do not hand-edit generated API classes, models, runtime files, or resource facade files. Update the
source OpenAPI contract and run the generator.

## Errors and webhooks

`ResponseError`, `FetchError`, and `RequiredError` remain exported so callers can catch failures
from the generated transport used internally. Use `affinityErrorFromResponse(error.response)` to
convert an HTTP `ResponseError` into a typed Affinity error.

Verify webhook signatures against the exact raw request body with `verifyAffinityWebhook`; it
returns a validated `AffinityWebhookEvent` for the supported event types.

## License

MIT
