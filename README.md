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

const access = await affinity.auth.access.retrieve();
const practices = await affinity.practices.list({ limit: 25 });
const catalog = await affinity.catalog.items.list({ query: "semaglutide", limit: 10 });

console.log(access, practices.data, catalog.data);
```

Resource methods use names such as `create`, `retrieve`, `list`, `update`, `cancel`, `sign`, and
`submit`. Request bodies are passed directly, while path identifiers are separate arguments:

```ts
const patient = await affinity.practices.patients.create("prac_...", {
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

Previews accept a patient ID, integration external ID, or inline patient details.
See [the EMR workflow example](examples/emr-order.ts) for server-side review, signing,
retries, partial submission recovery, and webhook processing.

```ts
const options = await affinity.catalog.items.prescribingOptions.retrieve(catalogItemId, {
  practiceId,
});
const preview = await affinity.orderPreviews.create({
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

Supplies use `catalog.items.list({ catalogKind: "otc" })`. Read each item's `ordering` requirements and
`fulfillmentInclusions`. Add purchased supplies with `otcItems: [{ catalogItemId, quantity: 1 }]`
on `orderPreviews.create`, `orders.create`, or each patient order in a batch. PerfectRx supplies require
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

The public resource groups are `account`, `auth`, `catalog`, `pharmacies`, `orders`,
`orderPreviews`, `orderBatches`, `practices`, `webhookEndpoints`, `webhookEvents`, and `webhookGrants`.
Patients, locations, and team resources are nested under `practices`.

Hosted-session and component-session creation are temporarily unavailable in this SDK.

The SDK exposes typed methods for public API resources. The two Test order simulation controls remain available
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

Resource methods throw `ResponseError` for unsuccessful HTTP responses. Convert it with
`await affinityErrorFromResponse(error.response)` to inspect `code`, `statusCode`, `requestId`,
and `retryable`. Clinical validation failures have HTTP status 422 and code
`clinical_requirements_unmet`; field issues are in the parsed error's `problem?.data?.issues`.
Check this extensible data before rendering issue messages beside their field paths. Correct and
review the prescription before signing again. Do not log clinical response bodies.

`FetchError` represents a failed connection; `RequiredError` identifies a missing SDK argument.

Verify webhook signatures against the exact raw request body with `verifyAffinityWebhook`; it
returns a validated `AffinityWebhookEvent` for the supported event types.

## Compounding reasons

Use the typed Affinity category. The API translates it to the pharmacy's enum; integrations do not send vendor codes.

```ts
import { Affinity, CompoundingReason } from "@affinity-health/sdk";

const affinity = new Affinity(process.env.AFFINITY_API_KEY!);
const options = await affinity.catalog.items.prescribingOptions.retrieve(catalogItemId, {
  practiceId,
});
// Render options.compoundingReason.choices for the clinician to select.
// Check context/contextRequired and contextPrompt before collecting additional text.

const clinical = {
  compoundingReason: {
    category: CompoundingReason.ConcentrationAdjustment,
    // context: clinicianEnteredExplanation, // Include when the medication requires it.
  },
};
// Pass clinical in a prescription to orders.create, or in orderPreviews.create overrides.
```

Only offer categories returned for the medication. A required patient-specific explanation cannot be replaced by a category. Category-only pharmacies accept omitted context; text-only pharmacies accept `{ context: clinicianEnteredExplanation }`. The API rechecks current requirements during creation and signing.

Read the [compounding reasons guide](https://docs.joinaffinityai.com/guides/compounding-reasons/) for the full category list, conditional context, and preview-to-create workflow.
The [typed example](examples/compounding-reasons.ts) is compiled during SDK validation.

## Runnable EMR example

The [TanStack Start example](examples/tanstack-start/README.md) uses the published SDK to load the
catalog, preview prescriptions and OTC items with grouped shipping, create unsigned drafts, and
sign with a Test prescriber NPI. It runs locally or on its own Alchemy-managed Cloudflare Worker.
API keys stay server-side. Only synthetic Test-mode orders are accepted.

## License

MIT

## Pharmacy clinical requirements

Fetch `catalog.items.prescribingOptions.retrieve(catalogItemId, { practiceId })` when selecting a medication.
Read `options.catalog.prescriptionRequirements` to render required fields without hard-coding pharmacy names.
`medicationReview: "required"` and `diagnosisReview: "required"` accept a populated list or an explicit
reviewed none. `diagnosis: "required"` requires an actual diagnosis. Allergy review is required before signing.

Include review statuses in each prescription's `clinical` object, or in `overrides.clinical` for previews:

```json
{
  "currentMedications": [],
  "medicationReviewStatus": "none",
  "diagnoses": [],
  "diagnosisReviewStatus": "none"
}
```

Use `"recorded"` for populated lists. An empty list without a review status is unreviewed.
Only send `"none"` after the clinician explicitly confirms it. Record patient allergies or
`reviewStatus: "no_known"` through the patient allergies endpoint.

Call `orderPreviews.create` before saving or signing. Display `preview.clinicalIssues` using their
`path` and `message`, and use `preview.clinicalRequirements` for required-field state.
`preview.status === "complete"` means a draft can be created; it can coexist with
`preview.clinicalRequirementsSatisfied === false`. The clinical flag does not establish signing
authority or Live eligibility. The API checks current requirements again at signing and transmission.

See the [compiled example](examples/clinical-requirements.ts) and
[prescribing guide](https://docs.joinaffinityai.com/guides/prescribing-defaults/).

## Migrating to 1.12.0

Resource namespaces follow static API path segments after `/v1`. Hyphenated segments use camelCase; path IDs remain positional arguments in URL order. HTTP operations become `list`, `retrieve`, `create`, `update`, or `delete`. Action endpoints retain their action name, such as `orders.sign()`. These replace the previous names; no deprecated aliases are exposed.

| Previous method                      | 1.12.0 method                                 |
| ------------------------------------ | --------------------------------------------- |
| `locations.list`                     | `practices.locations.list`                    |
| `locations.create`                   | `practices.locations.create`                  |
| `locations.retrieve`                 | `practices.locations.retrieve`                |
| `locations.update`                   | `practices.locations.update`                  |
| `locations.archive`                  | `practices.locations.archive`                 |
| `catalog.list`                       | `catalog.items.list`                          |
| `catalog.listPharmacies`             | `pharmacies.list`                             |
| `catalog.listShippingOptions`        | `catalog.items.shippingOptions.list`          |
| `orders.actOnException`              | `orders.exceptions.actions.create`            |
| `orders.listEvents`                  | `orders.events.list`                          |
| `webhooks.list`                      | `webhookEndpoints.list`                       |
| `webhooks.create`                    | `webhookEndpoints.create`                     |
| `webhooks.update`                    | `webhookEndpoints.update`                     |
| `webhooks.delete`                    | `webhookEndpoints.delete`                     |
| `webhooks.rotateSecret`              | `webhookEndpoints.rotateSecret`               |
| `webhooks.test`                      | `webhookEndpoints.test`                       |
| `webhooks.listEvents`                | `webhookEvents.list`                          |
| `webhooks.retrieveEvent`             | `webhookEvents.retrieve`                      |
| `webhooks.replayEvent`               | `webhookEvents.replay`                        |
| `catalog.retrievePrescribingOptions` | `catalog.items.prescribingOptions.retrieve`   |
| `orders.preview`                     | `orderPreviews.create`                        |
| `orders.reject`                      | `orders.rejection.create`                     |
| `team.createUser`                    | `practices.users.create`                      |
| `patients.listAddresses`             | `practices.patients.addresses.list`           |
| `patients.createAddress`             | `practices.patients.addresses.create`         |
| `patients.updateAddress`             | `practices.patients.addresses.update`         |
| `patients.archiveAddress`            | `practices.patients.addresses.delete`         |
| `patients.setDefaultAddress`         | `practices.patients.addresses.default.update` |
| `team.invite`                        | `practices.team.invitations.create`           |
| `team.listInvitations`               | `practices.team.invitations.list`             |
| `team.retrieve`                      | `practices.team.retrieve`                     |
| `team.listMembers`                   | `practices.team.members.list`                 |
| `team.listPrescribers`               | `practices.team.prescribers.list`             |
| `team.retrieveMember`                | `practices.team.members.retrieve`             |
| `team.updateMember`                  | `practices.team.members.update`               |
| `team.retrievePrescriber`            | `practices.team.prescribers.retrieve`         |
| `team.updatePrescriber`              | `practices.team.prescribers.update`           |
| `team.createLicense`                 | `practices.team.prescribers.licenses.create`  |
| `team.updateLicense`                 | `practices.team.prescribers.licenses.update`  |
| `team.retrieveInvitation`            | `practices.team.invitations.retrieve`         |
| `team.revokeInvitation`              | `practices.team.invitations.delete`           |
| `team.resendInvitation`              | `practices.team.invitations.resend`           |
| `apiKeys.retrieve`                   | `auth.access.retrieve`                        |
| `patients.list`                      | `practices.patients.list`                     |
| `patients.create`                    | `practices.patients.create`                   |
| `patients.retrieve`                  | `practices.patients.retrieve`                 |
| `patients.delete`                    | `practices.patients.delete`                   |
| `patients.update`                    | `practices.patients.update`                   |
| `patients.retrieveAllergies`         | `practices.patients.allergies.retrieve`       |
| `patients.replaceAllergies`          | `practices.patients.allergies.update`         |
| `orders.addPrescription`             | `orders.prescriptions.create`                 |
| `orders.updatePrescription`          | `orders.prescriptions.update`                 |
| `orders.createBatch`                 | `orderBatches.create`                         |
| `platformPricing.retrieve`           | `catalog.items.sellingPrice.retrieve`         |
| `platformPricing.update`             | `catalog.items.sellingPrice.update`           |
| `webhooks.listGrants`                | `webhookGrants.list`                          |
| `webhooks.saveGrant`                 | `webhookGrants.update`                        |
| `webhooks.revokeGrant`               | `webhookGrants.delete`                        |
