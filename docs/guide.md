# TypeScript SDK guide

> **Unreleased SDK update.**
> These examples match the new SDK implementation in the repository. They are not available in the
> current published release yet. Release versions and installation updates will follow.

Node.js, Bun, and supported server-side Fetch runtimes. [Source repository](https://github.com/affinity-health/affinity-typescript) · [All SDKs](https://docs.joinaffinityai.com/guides/reference/sdks/)

## Connect

Set `AFFINITY_API_KEY` to a Test API key on your server. The key selects Test or Live mode. Keep it out of browser and mobile code.

```typescript
import { Affinity, AffinityError } from "@affinity-health/sdk";

const api = new Affinity(process.env.AFFINITY_API_KEY!);
```

## With a practice key

The key identifies the practice. No practice ID or scoped client is needed.
The resource IDs below come from records in that practice.
Each section is a separate usage example, not one script to concatenate.

```typescript
const patients = await api.patients.list({ limit: 20 });
const patient = await api.patients.get(patientId);
const items = await api.catalog.items.list({ limit: 20 });
```

## With a platform key

Pass the target practice with each practice-scoped request. Keep record data separate from request context and idempotency options.

<!-- prettier-ignore -->
```typescript
const patients = await api.patients.list({ limit: 20 }, { practiceId });
const patient = await api.patients.get(patientId, { practiceId });

await api.patients.update(
  patientId,
  { email: "alex@example.com" },
  { practiceId },
);
```

## Scope a workflow once

A scoped client remembers the practice for subsequent requests. It is immutable; the original client and other scoped clients stay independent.
A conflicting practice ID produces an error. Scoping never grants access to another practice.

```typescript
const practice = api.forPractice(practiceId);

const patients = await practice.patients.list({ limit: 20 });
const items = await practice.catalog.items.list({ limit: 20 });
```

The following examples use this scoped client. A practice-key client supports the same calls without the scoping step.

## Create, get, and update a patient

Use synthetic Test data. Routine writes generate a fresh idempotency key per call and preserve it during internal retries.
Supply your own persisted key when retrying across calls or process restarts.

```typescript
const patient = await practice.patients.create({
  name: { first: "Alex", last: "Example" },
  dateOfBirth: "1990-01-01",
});

const saved = await practice.patients.get(patient.id);
await practice.patients.update(patient.id, { email: "alex@example.com" });
await practice.patients.update(patient.id, { status: "archived" });
```

The SDK maps `archived` to the API’s `inactive` status. Returned records use `inactive`.

Archive patients whose records you need to retain. Permanent deletion is available only for patients without order history. No explicit idempotency key is needed.

```typescript
await practice.patients.delete(patientId);
```

## Create an order draft

`draft` is your application's prepared prescription data, using catalog and prescribing options from this practice.
An order contains 1–20 complete prescriptions for one patient. This example creates an unsigned draft.
It shows a platform call without a scoped client: practice context and the persisted key belong together in request options.

`job` is your persisted workflow record. Generate and save a unique key for each action before making its first request.

```typescript
const order = await api.orders.create(
  { patientId, prescriptions: draft.prescriptions },
  { practiceId, idempotencyKey: job.createOrderKey },
);
```

## Sign and submit

`review` is your saved clinician review and signing consent for this exact order.
Store the reviewed revision, authorized prescriber ID, and explicit attestation together.
Your API key needs `orders:sign`. Never infer consent or automatically replace a stale revision.

```typescript
await practice.orders.sign(
  orderId,
  {
    prescriber: { id: review.prescriberId },
    expectedRevision: review.orderRevision,
    signatureAttestation: review.signatureAttestation,
  },
  { idempotencyKey: job.signOrderKey },
);

const submission = await practice.orders.submit(orderId, {
  idempotencyKey: job.submitOrderKey,
});
```

Use separate keys for creating, signing, and submitting. After an uncertain response, retry the same action with the same key and unchanged data.
A revision conflict requires renewed clinician review before another signing attempt.

Submission means queued, not accepted by the pharmacy. Inspect the result and track order events or webhooks.
After a reported partial submission failure, retry only the unconfirmed send with a new submission key.

## Read more than one page

The list method returns one page. Pass the last record's ID to request the next page.
The iterator fetches pages as you consume records; it does not load the full collection into memory.
`syncPatient` or its language equivalent represents your application's record handler.

```typescript
const page = await practice.patients.list({ limit: 20 });
if (page.hasMore && page.data.length > 0) {
  const next = await practice.patients.list({
    limit: 20,
    startingAfter: page.data.at(-1)!.id,
  });
}

for await (const patient of practice.patients.iterate({ limit: 100 })) {
  await syncPatient(patient);
}
```

## Handle errors

API failures expose status, code, request ID, retryability, and an optional retry delay in seconds.
Log those fields without logging patient data or credentials. Transport failures remain distinguishable from API responses.

```typescript
try {
  await practice.patients.get(patientId);
} catch (error) {
  if (!(error instanceof AffinityError)) throw error;
  console.error({
    status: error.status,
    code: error.code,
    requestId: error.requestId,
    retryable: error.retryable,
    retryAfter: error.retryAfter,
  });
}
```

Retryability is a transport hint, not permission to repeat a clinical action with a new key.
Keep the same key and body for an uncertain write. Validation and authorization errors require a corrected request.
See [API errors](https://docs.joinaffinityai.com/errors/) for recovery guidance.

## Platform directory and webhooks

Use the root platform client to list its practices and webhook endpoints. These calls do not need a target practice or an idempotency key.
The webhook list belongs to the platform itself. Access to another organization's endpoints still requires an explicit grant.

```typescript
const practices = await api.practices.list({ limit: 20 });
const selected = await api.practices.get(practiceId);
const endpoints = await api.webhooks.endpoints.list({ limit: 20 });
```

## More resources

Use the same conventions for addresses, allergies, locations, team members, and nested order resources.
[API reference](https://docs.joinaffinityai.com/api/) · [Webhooks](https://docs.joinaffinityai.com/guides/webhooks/)
