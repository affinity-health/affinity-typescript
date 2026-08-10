# Affinity TypeScript SDK

The official TypeScript SDK for the Affinity API.

> **Status:** The `1.3` release uses the forward-only `2026-07-29` Affinity API contract. Use Test
> mode until Affinity approves Live access.

The SDK provides a small, resource-oriented interface for software platforms connecting
healthcare practices to Affinity's compounder network. It is intended for trusted server-side
runtimes, including Node.js, Bun, AWS Lambda, and standards-based worker environments.

## Install

```sh
bun add @affinity-health/sdk
```

## Intended usage

```ts
import { Affinity } from "@affinity-health/sdk";

const affinity = new Affinity(process.env.AFFINITY_API_KEY!);

const access = await affinity.account.retrieveAccess();
if (access.livemode) throw new Error("Use a test-mode key during sandbox development");

const catalog = await affinity.catalog.list({ query: "semaglutide", limit: 10 });
const compounders = await affinity.compounders.list();
const item = catalog.data[0];
if (item) {
  console.log(item.pricing.medicationSubtotalCents);
  console.log(item.pricing.serviceFeeCents);
  console.log(item.pricing.orderTotalCents);
}

const practices = await affinity.practices.list();
const actingAffinity = affinity.withActor({ id: authenticatedUser.id, type: "user" });
const orders = await actingAffinity.orders.list({ practiceId: practices.data[0]?.id });
console.log(`${compounders.data.length} compounders are available to this account`);
```

List methods return a typed first page when awaited. Each page has `data`, `hasMore`, `object`, and
`url`. The default page size is 25, and the maximum is 100.

List methods are also async iterables. Iteration requests each next page with `startingAfter`:

```ts
for await (const practice of affinity.practices.list({ limit: 100 })) {
  await synchronizePractice(practice);
}
```

Use `autoPagingEach(...)` when a callback is more convenient. Return `false` to stop iteration:

```ts
await affinity.users.list().autoPagingEach(async (user) => {
  await synchronizeUser(user);
  if (shouldStop(user)) return false;
});
```

Pass `startingAfter` or `endingBefore` to request one page directly. Automatic iteration supports
forward traversal only and rejects `endingBefore`.

Affinity supports three prescribing integrations: Affinity Hosted for a redirect-based workflow,
Affinity Elements for an embedded composer, and the server-side SDK for platforms that build their
own prescribing UI. The server-side SDK creates a complete unsigned draft; only the mapped provider
can review and sign it in the one-time Affinity signing session. A service key cannot sign a
prescription or receive the provider's Affinity signing PIN.

The API key belongs only in your backend. Never create an `Affinity` client in browser or mobile
code.

## Run the Test practice example

Copy `.env.example` to `.env.local`. Add a Test-mode API key, then run:

```sh
dev
```

Open `http://affinity-sdk.localhost:5191`. The TanStack Start example keeps the API key on the
server. It creates a synthetic practice and an automatically verified provider mapping with NPI
`1234567893`.

Patient and order requests require traceable actor context. Create an immutable request-scoped
client with `withActor(...)`, using your authenticated user's stable opaque ID. Use `type: "system"`
only for an automated process with no human user. Affinity records the actor for authorization and
audit attribution; do not use an email address or expose a provider's Affinity signing PIN.

## Webhooks

Verify the signature against the exact raw request body before parsing or logging it. The verifier
returns the exhaustive, dated `AffinityWebhookEvent` union, so checking `event.type` narrows both
the event and its `data.object`.

```ts
import { AffinityWebhookVerificationError, verifyAffinityWebhook } from "@affinity-health/sdk";

export async function handleAffinityWebhook(request: Request) {
  try {
    const event = await verifyAffinityWebhook({
      body: await request.arrayBuffer(),
      secret: process.env.AFFINITY_WEBHOOK_SECRET!,
      signature: request.headers.get("affinity-signature"),
    });

    switch (event.type) {
      case "order.submitted":
        console.log(event.data.object.id, event.data.object.status);
        break;
      case "webhook_endpoint.test":
        console.log(event.data.object.id);
        break;
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    if (error instanceof AffinityWebhookVerificationError) {
      return Response.json({ error: error.code }, { status: 400 });
    }
    throw error;
  }
}
```

The current event types and order statuses are exported as
`affinityWebhookEventTypes` and `affinityOrderStatuses`. During a signing-secret rotation, pass
both active secrets as an array; a request is accepted when either secret verifies. Do not call
`request.json()` before signature verification.

## Platform identity and delegated sessions

Use your own stable customer identifier as `externalId`; do not use email as identity or
authorization. Email is optional and can change. Affinity independently verifies the mapped
provider and determines prescribing authority.

In Test mode, use `1234567893` as the National Provider Identifier (NPI) for a synthetic provider.
Affinity immediately returns a `verified` provider mapping. Affinity rejects this NPI in Live mode.
The test provider must still review and sign prescriptions with the normal Affinity signing PIN.

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

const providerMapping = await affinity.providerMappings.create(
  {
    attestations: {
      authorizedProviderRelationship: true,
      providerDataAccuracy: true,
    },
    credentials: "MD",
    externalId: "provider_4821",
    name: "Jordan Lee",
    npi: "1234567893",
    practiceId: practice.id,
    userId: user.id,
  },
  { idempotencyKey: `provider:${practice.id}:${user.id}` },
);

// Save providerMapping.id with this provider in your database. It is a durable identity mapping,
// not an API key and not a browser credential.
if (providerMapping.status !== "verified") {
  throw new Error("Complete Affinity provider verification before creating a clinical session");
}

// Revocation immediately invalidates delegated component and hosted access for this mapping.
// await affinity.providerMappings.revoke(providerMapping.id, {
//   idempotencyKey: `provider-revoke:${providerMapping.id}`,
// });

const consent = {
  authorizedProviderAccess: true as const,
  minimumNecessaryPhi: true as const,
  recordedAt: new Date().toISOString(),
};

const componentSession = await affinity.componentSessions.create(
  {
    allowedOrigin: "https://platform.example.com",
    components: {
      prescriptionComposer: {
        enabled: true,
        features: {
          changePatient: false,
          createDraft: true,
          sign: true,
          viewHistory: true,
        },
      },
    },
    consent,
    context: {
      patientExternalId: "patient_991",
      patientSelection: "fixed",
    },
    membershipId: membership.id,
    practiceId: practice.id,
    providerMappingId: providerMapping.id,
    userId: user.id,
  },
  { idempotencyKey: `component:${crypto.randomUUID()}` },
);

// Return this one-time, 10-minute client secret only to the authenticated browser.
// The Affinity Elements SDK sends it to the origin-checked Affinity iframe.
console.log(componentSession.clientSecret);

const hostedSession = await affinity.hostedSessions.create(
  {
    consent,
    flow: "provider_verification",
    membershipId: membership.id,
    practiceId: practice.id,
    providerMappingId: providerMapping.id,
    returnUrl: "https://platform.example.com/affinity/return",
    userId: user.id,
  },
  { idempotencyKey: `hosted:${crypto.randomUUID()}` },
);

// Open this single-use, 15-minute URL in a redirect, popup, or new tab.
console.log(hostedSession.url);
```

API keys and all provisioning calls stay on the platform backend. Component origins and hosted
return URLs must exactly match the Test or Live allowlist. Never put a component secret in a URL,
log, analytics event, or persistent storage.

## Headless order flow

Use the request-scoped actor client when your backend creates an order from your own UI. Each order
belongs to exactly one patient and contains one or more prescriptions. `orders.create(...)` creates
unsigned drafts; it does not sign or transmit them. Then create one signing session for the complete
order and send its URL only to the authenticated provider represented by the provider mapping.

```ts
const actingAffinity = affinity.withActor({ id: authenticatedUser.id, type: "user" });
const [semaglutide] = (await actingAffinity.catalog.list({ query: "semaglutide", limit: 10 })).data;
const [vitaminB12] = (await actingAffinity.catalog.list({ query: "vitamin b12", limit: 10 })).data;
if (!semaglutide || !vitaminB12) throw new Error("Required formulations are unavailable");

const order = await actingAffinity.orders.create(
  {
    patientId: patient.id,
    practiceId: practice.id,
    providerMappingId: providerMapping.id,
    prescriptions: [
      {
        clinical: {
          currentMedications: [],
          diagnoses: [{ code: "E66.9", display: "Obesity, unspecified" }],
          observations: [],
        },
        daysSupply: 30,
        dispensing: { dispenseUponAcceptance: true, substitutionPermitted: false },
        directions: "Inject 0.25 mL subcutaneously once weekly",
        medicationId: semaglutide.id,
        quantity: 1,
        quantityUnit: "mL",
        refills: 0,
        structuredSig: {
          dose: "0.25",
          doseUnit: "mL",
          frequency: "once weekly",
          prn: false,
          route: "subcutaneous",
        },
      },
      {
        clinical: {
          currentMedications: [],
          diagnoses: [{ code: "E53.8", display: "Other specified vitamin B deficiency" }],
          observations: [],
        },
        daysSupply: 30,
        dispensing: { dispenseUponAcceptance: true, substitutionPermitted: false },
        directions: "Inject 1 mL intramuscularly once weekly",
        medicationId: vitaminB12.id,
        quantity: 4,
        quantityUnit: "mL",
        refills: 0,
        structuredSig: {
          dose: "1",
          doseUnit: "mL",
          frequency: "once weekly",
          prn: false,
          route: "intramuscular",
        },
      },
    ],
  },
  { idempotencyKey: `order:${encounter.id}` },
);

if (order.status !== "requires_provider_signature") {
  throw new Error("Unexpected order state");
}

const signingSession = await affinity.orderSigningSessions.create(
  {
    consent,
    membershipId: membership.id,
    orderId: order.id,
    practiceId: practice.id,
    providerMappingId: providerMapping.id,
    returnUrl: `https://platform.example.com/encounters/${encounter.id}`,
    userId: user.id,
  },
  { idempotencyKey: `order-signing:${order.id}` },
);

// Redirect or open a popup for the authenticated provider. The URL is single-use and expires.
console.log(signingSession.url);
```

The signing session is server-bound to the platform, Test or Live mode, practice, patient,
provider, and complete order. The provider reviews every prescription, enters their PIN only
inside Affinity, and selects shipping for each prescription before Affinity transmits them.

## Patients and card setup

Create each patient inside its owning practice. Use your stable patient identifier for
`externalId`.

```ts
const actingAffinity = affinity.withActor({ id: authenticatedUser.id, type: "user" });
const patient = await actingAffinity.patients.create(
  practice.id,
  {
    address: {
      city: "Los Angeles",
      country: "US",
      line1: "100 Test Avenue",
      postalCode: "90001",
      state: "CA",
    },
    dateOfBirth: "1990-01-01",
    externalId: "patient_991",
    name: { first: "Demo", last: "Patient" },
    phone: "+13135550100",
  },
  { idempotencyKey: "patient:patient_991" },
);

const setup = await affinity.billing.createPaymentSetup(
  practice.id,
  { consentAccepted: true },
  { idempotencyKey: `payment-setup:${practice.id}` },
);
```

Return `setup.publishableKey` and `setup.clientSecret` only to an authenticated practice billing
view. Confirm the SetupIntent with Stripe.js. Send only its `seti_...` ID back to your backend.

```ts
const paymentProfile = await affinity.billing.completePaymentSetup(
  practice.id,
  { setupIntentId },
  { idempotencyKey: `payment-setup-complete:${setupIntentId}` },
);

if (paymentProfile.status !== "ready") {
  throw new Error("The practice payment profile is not ready");
}
```

Do not log the SetupIntent client secret or send it to another practice.

## Resource model

The client surface is organized around these resources:

- `account` — inspect the authenticated organization and API access
- `catalog` — search products available through the Affinity network
- `compounders` — list the compounders available to the authenticated account and mode
- `users` — provision platform-owned user records by stable external ID
- `practices` — create and manage customer practices
- `patients` — create and manage patients inside one practice
- `billing` — start and complete Stripe card setup and read the safe payment profile
- `roles` — list and manage custom practice roles
- `memberships` — create consent-bound practice role grants
- `providerMappings` — connect, inspect, and revoke platform identities mapped to independently
  verified Affinity providers
- `componentSessions` — create short-lived, one-time, origin-bound Affinity Elements secrets
- `hostedSessions` — create short-lived, single-use Affinity Hosted workflow URLs
- `orders` — create one-patient multi-prescription orders, then list, inspect, cancel, and read events
- `orderSigningSessions` — create provider-bound Hosted review and signing URLs for complete orders
- `webhooks` — manage endpoints and inspect or replay events

Generated transport classes remain available as an escape hatch, while the `Affinity` client is the
recommended entry point.

The compounder list is account-scoped. It includes only generally available compounders and
approved invite-only relationships for the current mode; it is not Affinity's complete internal
partner directory.

## Errors

API failures use RFC 9457 problem details. The SDK parses them and throws an `AffinityError`; callers
never need to read or cast `response.json()`. Branch on the stable lowercase `code`, and include
`requestId` when contacting Affinity support. The broader `category` is useful for shared handling.

```ts
import { AffinityError, AffinityRateLimitError } from "@affinity-health/sdk";

try {
  await affinity.catalog.list();
} catch (error) {
  if (!(error instanceof AffinityError)) throw error;

  console.error(error.code, error.requestId, error.message);
  if (error instanceof AffinityRateLimitError) {
    // The SDK has exhausted its configured bounded retries.
  }
}
```

`AffinityAuthenticationError`, `AffinityPermissionError`, `AffinityInvalidRequestError`,
`AffinityIdempotencyError`, `AffinityRateLimitError`, `AffinityApiError`, and
`AffinityConnectionError` support `instanceof` narrowing. Every `AffinityError` also has
`statusCode`, `retryable`, the parsed `problem`, and the original `response` as an escape hatch.

TanStack Query works with the same Promise API without an adapter or another dependency:

```ts
const catalog = useQuery({
  queryKey: ["catalog"],
  queryFn: () => affinity.catalog.list(),
  retry: (_count, error) => error instanceof AffinityError && error.retryable,
});
```

The SDK is server-only because it uses a service API key. If an error crosses from a backend to a
browser, return `error.toJSON()` instead of serializing the Error, stack, or raw response. Display
the public `message` for actionable request errors, use a generic message for API and connection
failures, and log the `requestId` for support. Effect and Result libraries can wrap these Promise
methods in applications that use them, but they are intentionally not SDK dependencies.

Each clinical order belongs to one practice. A platform can list orders across its practices or use
`practiceId` to scope the operational view. The practice payment profile returns only safe card
metadata. The platform must not receive raw card data.

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

- [API documentation](https://docs.joinaffinityai.com/api)
- [TanStack Start platform example](https://github.com/affinity-health/tanstack-start-example)
