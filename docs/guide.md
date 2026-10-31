# SDK guide

Use this SDK only in trusted server runtimes. Keep keys out of browser and mobile code, logs and committed files. All identities below are synthetic. Run the examples with a Test key only.

Install the beta with `bun add @affinity-health/sdk@next` or `npm install @affinity-health/sdk@next`. Every method, its parameters and its errors are in the [API reference](reference.md).

## Create a client

```typescript
import { Affinity, AffinityClient, AffinityError } from "@affinity-health/sdk";

const affinity = new AffinityClient({ token: process.env.AFFINITY_API_KEY! });
const account = await affinity.account.get();
if (account.mode !== "test") throw new Error("This example requires a Test key");
```

The client calls `https://api.affinityrx.com` and sends `Affinity-Version: 2026-10-28` on every request. Set `baseUrl` to call another API. The key sets the organization and the Test or Live mode.

Client options:

| Option             | Default                      | Use                                                                                                                                                                |
| ------------------ | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `token`            | —                            | The API key.                                                                                                                                                       |
| `baseUrl`          | `https://api.affinityrx.com` | Another API, such as a staging environment.                                                                                                                        |
| `maxRetries`       | `2`                          | Retries for 408, 429 and 5xx responses, after `Retry-After` when the API sends it. A network error or timeout is not retried: retry it yourself with the same key. |
| `timeoutInSeconds` | `60`                         | The time limit of one attempt.                                                                                                                                     |
| `fetch`            | `globalThis.fetch`           | A different fetch, for example to record requests in tests.                                                                                                        |

Each method also takes request options as its last argument: `abortSignal`, `timeoutInSeconds`, `maxRetries` and `headers`.

## Find medications

```typescript
const page = await affinity.medications.list({ limit: 20 });
const medication = await affinity.medications.get({ medicationId: page.data[0]!.id });
```

A medication tells you what an order for it needs:

- `requirements`: optional prescription fields that this pharmacy requires, for example `compoundingReason`. Send each one.
- `compoundingReasons`: when the list is not empty, send one of these values exactly.
- `quantities`: when the list is not empty, the quantity must be one of these values.
- `restrictedStates`: the medication does not ship to these states.
- `shippingOptions`: choose the order's `shipping.optionId` from this list.

Read these values for each medication. Do not hard-code them: they change when the catalog changes. A platform reads the prices of one of its practices with `practiceId`, and the other strengths and forms with `expand: "variants"`.

## Manage practices

```typescript
const practice = await affinity.practices.create({
  idempotencyKey: "saved-practice-creation-key",
  name: "Synthetic SDK Practice",
  phone: "+12025550199",
  address: { line1: "200 Example Ave", city: "Austin", state: "TX", postalCode: "78701" },
});
const saved = await affinity.practices.get({ practiceId: practice.id });
await affinity.practices.update({
  practiceId: practice.id,
  idempotencyKey: "saved-update-key",
  phone: null,
});
```

An update sends only the fields you give. `null` clears an optional field.

## Send a reviewed order

The patient's details go in `patient` on the order. There is no separate patient resource. One request creates the order, signs it and sends it to the pharmacy.

```typescript
const order = await affinity.orders.create({
  idempotencyKey: review.orderKey, // saved with the reviewed order before this request
  practiceId: practice.id,
  externalOrderId: "synthetic-emr-order-001",
  patient: {
    externalId: "synthetic-emr-patient-001",
    firstName: "Synthetic",
    lastName: "Patient",
    dateOfBirth: "1990-01-01",
    sex: "female",
    email: "patient@example.test",
    phone: "+12025550199",
    address: { line1: "100 Test St", city: "Austin", state: "TX", postalCode: "78701" },
    allergies: [], // empty only after a review confirms no known allergies
  },
  prescriber: { npi: "1234567893", firstName: "Synthetic", lastName: "Prescriber" },
  prescriptions: [
    {
      medicationId: medication.id,
      quantity: medication.quantities[0] ?? 1,
      refills: 0,
      directions: "Use as directed.",
    },
  ],
  shipping: { optionId: medication.shippingOptions[0]!.id },
  signatureAttestation: true,
});
```

A platform key must send `practiceId`. A practice key can omit it. NPI identifies the clinician; it does not authenticate the clinician or give signing authority. Your integration must authenticate the clinician and record the approval before it sends `signatureAttestation: true`.

### Idempotency keys

Every write takes an `idempotencyKey`, and the types require it. The key makes a retry safe: the same key and body return the first result and do not create a second order.

- Save the key with the reviewed order before the first request.
- After a timeout, an error or a restart, send the same body with the same key.
- The client's own retries use the same key.
- Use a new key only for a new action. A new key never fixes an error.

A key is 1 to 255 printable ASCII characters without spaces.

## Read, list and cancel orders

```typescript
const current = await affinity.orders.get({ orderId: order.id });
const shipped = await affinity.orders.list({ practiceId: practice.id, status: "shipped" });
const cancelled = await affinity.orders.cancel({
  orderId: order.id,
  idempotencyKey: "saved-cancel-key",
});
```

A cancel can wait for the pharmacy: `cancelRequestedAt` is set until the pharmacy confirms. To find an order by your own ID, use `orders.list({ externalOrderId, practiceId })`. To find changes you missed, use `orders.list({ updatedAfter })` with the same timestamp on every page.

## Read every page

A list call returns a page. Iterate it to read every record; the client requests each next page with the previous page's cursor.

```typescript
for await (const order of await affinity.orders.list({ practiceId: practice.id })) {
  console.log(order.id, order.status);
}

const page = await affinity.medications.list({ limit: 25 });
page.data; // this page only
page.hasNextPage();
await page.getNextPage();
```

Keep the filters the same on every page.

## Handle errors

Each error status has its own class, and every class extends `AffinityError`.

```typescript
try {
  await affinity.orders.create(input);
} catch (error) {
  if (error instanceof Affinity.UnprocessableEntityError) {
    // An ordering rule refused the order. `field` names the input to correct.
    for (const issue of error.body.issues ?? []) console.error(issue.field, issue.message);
  } else if (error instanceof AffinityError) {
    console.error(error.statusCode, error.requestId);
  }
  throw error;
}
```

| Status   | Class                                                                                                                                                                                                                                                                        |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 400      | `Affinity.BadRequestError`: the request does not match the schema.                                                                                                                                                                                                           |
| 401      | `Affinity.UnauthorizedError`                                                                                                                                                                                                                                                 |
| 403      | `Affinity.ForbiddenError`                                                                                                                                                                                                                                                    |
| 404      | `Affinity.NotFoundError`                                                                                                                                                                                                                                                     |
| 409      | `Affinity.ConflictError`: `request_in_progress` means the first request with this key has not finished; wait, then send the same body with the same key. `idempotency_key_reused` means the key was used with a different body. Never switch to a new key to get past a 409. |
| 422      | `Affinity.UnprocessableEntityError`: an ordering rule refused the request.                                                                                                                                                                                                   |
| 429      | `Affinity.TooManyRequestsError`                                                                                                                                                                                                                                              |
| 500, 503 | `Affinity.InternalServerError`, `Affinity.ServiceUnavailableError`                                                                                                                                                                                                           |

`error.body` is the problem document with `code`, `detail`, `requestId` and, for refused input, `issues`. Do not log credentials, patient data or request bodies.

## Webhooks

```typescript
const endpoint = await affinity.webhooks.create({
  idempotencyKey: "saved-endpoint-key",
  url: "https://integration.example.test/affinity-webhook",
});
```

Keep the endpoint's signing secret on the server. Verify the exact raw body and the `Affinity-Signature` header before you use an event:

```typescript
import { isKnownAffinityWebhookEvent, verifyAffinityWebhook } from "@affinity-health/sdk";

const event = await verifyAffinityWebhook({
  body: await request.text(),
  signature: request.headers.get("affinity-signature"),
  secret: process.env.AFFINITY_WEBHOOK_SECRET!,
});
if (isKnownAffinityWebhookEvent(event) && event.type.startsWith("order."))
  await saveOnce(event.id, event.data.order.id);
return new Response(null, { status: 204 });
```

Verification checks the signature and the timestamp (300 seconds by default), then returns the parsed event. It throws `AffinityWebhookVerificationError` with a `code` when the request is not authentic. Ignore event types that you do not recognize, and answer 2xx. Save each event once by its `id`, and acknowledge only after you saved it. Read the current order when you process a queued event, so an event that arrives late cannot move your state back.

See [the EMR example](../examples/emr-order.ts) for a complete order and webhook flow.
