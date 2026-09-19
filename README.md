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
const patient = await affinity.patients.create("prac_...", {
  dateOfBirth: "1990-01-01",
  email: "patient@example.com",
  externalId: "patient-456",
  name: { first: "Demo", last: "Patient" },
});

const order = await affinity.orders.create({
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
});
```

Order creation requires `practiceId` and `prescriptions`, plus exactly one of `patientId` or an
inline `patient` according to the API's business rules. Do not use the SDK to bypass clinical
eligibility, signing, or actor-attribution checks.

## Prescription defaults and previews

The unreleased contract adds `patientExternalId` and inline `patient` selectors to previews, plus
`orders.signAndSubmit`. See [the EMR workflow example](examples/emr-order.ts) for server-side
review, retries, partial submission recovery, and webhook processing. These additions require the
matching API deployment and are not available in previously published SDK versions.

These methods are available in stable SDK 1.9.0 and later.
Use them on your server with an existing patient in the selected practice.

```ts
const options = await affinity.catalog.retrievePrescribingOptions(catalogItemId, { practiceId });
const preview = await affinity.orders.preview({
  practiceId,
  patientId,
  prescriptions: [
    { medicationId: catalogItemId, preset: "default", expectedRevision: options.revision },
  ],
  shipping: { selection: "lowest_cost" },
});

if (preview.status === "complete") {
  // Show the resolved values for clinician review before calling orders.create.
  const reviewedInput = preview.orderInput;
} else {
  // Display preview.issues beside the corresponding prescription fields.
}
```

Omit the options request for one-click defaults. Add prescription `overrides` for structured,
template, or free-text directions, quantity, days supply, refills, clinical context, or shipping.
Previews do not create, sign, charge, or transmit an order. Never infer patient-specific rationale,
diagnoses, or allergy review from defaults. Creation and signing recheck current requirements.

Supplies use `catalog.list({ catalogKind: "otc" })`. Read each item's `ordering` requirements and
`fulfillmentInclusions`. Add purchased supplies with `otcItems: [{ catalogItemId, quantity: 1 }]`
on `orders.preview`, `orders.create`, or each patient order in a batch. PerfectRx supplies require
an accompanying PerfectRx prescription and attach to its shipment without another delivery fee.
Do not add supplies already included by the pharmacy unless the clinician requests extra items.

Preview `shippingGroups` combines charges by patient order, pharmacy, service, temperature, and
destination. Ambient and refrigerated prescriptions remain separate. `totals` reports medication,
supply, shipping, and estimated order totals, with null when a price cannot be resolved.

## Client and request options

Client-wide options establish defaults for every resource call:

```ts
const affinity = new Affinity(process.env.AFFINITY_API_KEY!, {
  apiVersion: "2026-08-11",
  organizationId: "acct_...",
  baseUrl: "https://api.joinaffinityai.com",
  timeout: 80_000,
  maxNetworkRetries: 2,
  fetch: globalThis.fetch,
  headers: { "X-Integration-Trace": "sync-worker" },
});
```

By default the client sends bearer authentication, `Affinity-Version: 2026-08-11`, and a system
actor to `https://api.joinaffinityai.com`. Affinity attributes the default actor to the
authenticated service account. Supply `baseUrl` for a compatible endpoint and `fetch` when the
runtime needs a custom transport implementation.

The final options argument to each resource method overrides request-scoped transport settings. It
can include `apiVersion`, `organizationId`, `actor`, `headers`, `signal`, and `idempotencyKey`.
Practice creation and updates do not require an options argument or an idempotency key.
For endpoints that require a key, the SDK generates one for each call and reuses it across automatic retries.
Supply a stable key only when retrying an operation across separate calls or processes.
A per-request actor overrides the client actor.

A user actor requires the stable external user ID from your application. Add a stable system ID
only when several automated workers share a service account and need separate audit identities.

Use `headers` for additional custom headers. Affinity-managed headers must be set through their
typed options: `apiVersion`, `organizationId`, `actor`, and `idempotencyKey`. The SDK rejects
attempts to supply those managed headers, authentication headers, or the content type through the
custom header map. Custom headers are merged case-insensitively, with request-scoped values taking
precedence.

## Pagination

Await a list call for one page, or iterate it to fetch subsequent pages as needed:

```ts
const page = await affinity.practices.list({ limit: 25 });

for await (const practice of affinity.practices.list({ limit: 25 })) {
  console.log(practice.id);
}

const practices = await affinity.practices.list().autoPagingToArray({ limit: 100 });
```

Iteration preserves filters and uses `startingAfter` to advance. With `endingBefore`, it iterates
backward, reversing each page. Breaking the loop stops further page requests.
`autoPagingToArray` requires a positive limit to bound memory use.
List endpoints without cursor parameters return their ordinary response.

## Retries and timeouts

The default timeout is 80 seconds per attempt, including response-body reading.
The client retries reads and writes with an idempotency key up to twice after connection
failures, timeouts, or HTTP 429, 500, 502, 503, and 504 responses.
Unkeyed writes are never retried automatically. Set `maxNetworkRetries: 0` to disable retries.
The transport uses exponential delay and honors `Retry-After`, bounded to 30 seconds.
An `AbortSignal` cancels pending requests and retry waits.

## Practice access and public types

Practice responses expose `liveEnabled: boolean`. `livemode` identifies the resource's mode;
Live access can be disabled for a Live practice. Test practices always have `liveEnabled: false`.
Approved platforms can set `liveEnabled` during creation or update only their owned Live practices.
Affinity Admin decisions retain precedence. See the [Live access guide](https://docs.joinaffinityai.com/guides/test-and-live-mode/#manage-practice-live-access).

Import domain types directly from the package:

```ts
import type { Practice, Patient, Order, CatalogItem, PracticeLocation } from "@affinity-health/sdk";

const practice: Practice = await affinity.practices.retrieve(practiceId);
const id: string = practice.id;
```

IDs are non-null strings. Fields that can be absent in the API, such as `legalName`, remain nullable.
The practice response replaces `productionAccess` with `liveEnabled`; check this boolean
instead of comparing `"approved"` and `"pending"`.

## Resources and generated contract

The public resource groups are `account`, `apiKeys`, `catalog`, `locations`, `orders`, `patients`,
`platformPricing`, `practices`, `sessions`, `team`, and `webhooks`.

The SDK exposes 69 typed resource methods. The two Test order simulation controls remain available
through `rawRequest`. The generated OpenAPI transport and models remain private implementation
details of the package root.
Use `rawRequest` to call a preview endpoint or another API path that the installed SDK version does
not support yet:

```ts
const preview = await affinity.rawRequest("POST", "/v1/beta_endpoint", { value: 123 });
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

## Compounding reasons

Use the typed Affinity category. The API translates it to the pharmacy's enum; integrations do not send vendor codes.

```ts
import { Affinity, CompoundingReason } from "@affinity-health/sdk";

const affinity = new Affinity(process.env.AFFINITY_API_KEY!);
const options = await affinity.catalog.retrievePrescribingOptions(catalogItemId, { practiceId });
// Render options.compoundingReason.choices for the clinician to select.
// Check context/contextRequired and contextPrompt before collecting additional text.

const clinical = {
  compoundingReason: {
    category: CompoundingReason.ConcentrationAdjustment,
    // context: clinicianEnteredExplanation, // Include when the medication requires it.
  },
};
// Pass clinical in a prescription to orders.create, or in orders.preview overrides.
```

Only offer categories returned for the medication. A required patient-specific explanation cannot be replaced by a category. Category-only pharmacies accept omitted context; text-only pharmacies accept `{ context: clinicianEnteredExplanation }`. The API rechecks current requirements during creation and signing.

Read the [compounding reasons guide](https://docs.joinaffinityai.com/guides/compounding-reasons/) for the full category list, conditional context, and preview-to-create workflow.
The [typed example](examples/compounding-reasons.ts) is compiled during SDK validation.

## License

MIT
