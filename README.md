# Affinity TypeScript SDK

The official TypeScript SDK for the Affinity API.

> **Status:** Version `1.0.0` uses the forward-only `2026-07-29` Affinity API contract. Use Test
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
const orders = await affinity.orders.list({ practiceId: practices.data[0]?.id });
console.log(`${compounders.data.length} compounders are available to this account`);
```

The platform API does not create, edit, sign, route, or submit prescriptions. Create an
origin-bound component session, then let the provider complete those actions inside Affinity
Connect.

The API key belongs only in your backend. Never create an `Affinity` client in browser or mobile
code.

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
  recordedAt: new Date(),
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

## Patients and card setup

Create each patient inside its owning practice. Use your stable patient identifier for
`externalId`.

```ts
const patient = await affinity.patients.create(
  practice.id,
  {
    address: {
      city: "Detroit",
      country: "US",
      line1: "100 Test Avenue",
      postalCode: "48201",
      state: "MI",
    },
    dateOfBirth: new Date("1990-01-01"),
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
- `orders` — list, inspect, cancel eligible orders, and read fulfillment events
- `webhooks` — manage endpoints and inspect or replay events

Generated transport classes remain available as an escape hatch, while the `Affinity` client is the
recommended entry point.

The compounder list is account-scoped. It includes only generally available compounders and
approved invite-only relationships for the current mode; it is not Affinity's complete internal
partner directory.

## Errors

API failures use RFC 9457 problem details. Branch on the stable lowercase `code`, and include
`requestId` when contacting Affinity support. A `500` means an unexpected Affinity failure; bounded
retries are appropriate for `408`, `429`, `502`, and `503`, but not an unlimited retry loop.

```ts
import { ResponseError, type Problem } from "@affinity-health/sdk";

try {
  await affinity.catalog.list();
} catch (error) {
  if (!(error instanceof ResponseError)) throw error;
  const problem = (await error.response.json()) as Problem;
  console.error(problem.code, problem.requestId);
}
```

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
[`/openapi.json`](https://api.joinaffinityai.com/openapi.json), with a maintained resource
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
