# SDK guide

Use this SDK in trusted server runtimes. Keep keys out of browser and mobile code, logs, and committed files. All identities below are synthetic; run examples with a Test key only.

## Create a client

```typescript
import { Affinity, AffinityError, type OrderCreateParams } from "@affinity-health/sdk";

const api = new Affinity(process.env.AFFINITY_API_KEY!, {
  baseUrl: "https://api-staging.affinityrx.com",
  maxNetworkRetries: 2,
});
const account = await api.account.get();
if (account.mode !== "test") throw new Error("This example requires a Test key");
```

This beta targets the staging MVP API, so set `baseUrl` to `https://api-staging.affinityrx.com`. After the MVP cutover, switch to `https://api.affinityrx.com` or omit `baseUrl` to use the production default. The SDK sends `Affinity-Version: 2026-10-20`. The key determines organization and mode. NPI identifies a clinician; it does not authenticate them or grant signing authority. Your integration must authenticate the clinician and record approval before sending a signed order.

## Find medications

```typescript
const page = await api.medications.list({ limit: "20", query: "lidocaine" });
const medication = page.data[0] ? await api.medications.get(page.data[0].id) : undefined;
if (!medication) throw new Error("No Lidocaine medication found in Test mode");
const shippingOptionId = medication.shippingOptions[0]?.id;
if (!shippingOptionId) throw new Error("Medication has no shipping options");
```

Use `query` for text search, `name` for one exact case-insensitive medication name, `names` for several exact names, and `pharmacyId` to filter by pharmacy. This example searches for Lidocaine in the Test catalog. Medication responses include `quantities`, `requirements`, `compoundingReasons`, `restrictedStates`, and `shippingOptions`. Review the selected medication's current requirements before creating the order. `compoundingReason` is an optional string on a prescription, with no SDK enum helper. Choose medication and shipping IDs from current responses, rather than inventing them.

## Manage practices

```typescript
const practice = await api.practices.create(
  {
    name: "Synthetic SDK Practice",
    phone: "+12025550199",
    address: {
      line1: "200 Example Ave",
      line2: null,
      city: "Austin",
      state: "TX",
      postalCode: "78701",
    },
  },
  { idempotencyKey: "persisted-test-practice-operation" },
);
const saved = await api.practices.get(practice.id);
const practices = await api.practices.list({ limit: "20", query: "Synthetic" });
```

Creation requires `name`, `address`, and `phone` in the body. `liveEnabled` is optional. Authorization still limits the practices the key can access. A practice response has `liveEnabled`; the account response carries `mode`.

## Send a reviewed order

Patient details go in `patient` on the order. There is no public patient create, get, or update method. The `Patient` type alias describes this order input. An existing patient ID or external ID may be supplied within that input, alongside the required demographics and allergy information.

```typescript
const input: OrderCreateParams = {
  practiceId: practice.id,
  externalOrderId: "synthetic-emr-order-001",
  patient: {
    firstName: "Synthetic",
    lastName: "Patient",
    dateOfBirth: "1990-01-01",
    gender: "unknown",
    email: "patient@example.test",
    phone: "+12025550199",
    address: { line1: "100 Test St", city: "Austin", state: "TX", postalCode: "78701" },
    // Empty only after an explicit review confirms no known allergies.
    allergies: [],
  },
  prescriber: { firstName: "Synthetic", lastName: "Prescriber", npi: "1234567893" },
  prescriptions: [
    {
      medicationId: medication.id,
      directions: "Use as directed in this synthetic Test scenario.",
      quantity: 1,
      refills: 0,
    },
  ],
  shippingOptionId,
  signatureAttestation: true,
};
// Load the exact clinician-approved input and key from your durable review record.
const order = await api.orders.create(input, { idempotencyKey: "persisted-test-order-operation" });
const current = await api.orders.get(order.id);
```

The order uses the practice, medication, and shipping option from the steps above. Platform keys must supply `practiceId`; practice keys may omit it to use their own practice. Optional `prescriber.phone` and `prescriber.address` override the practice contact details. Order responses include the practice snapshot and the resolved prescriber contact details. The integration supplies the prescriber's NPI and name when identifying the signer. The schema allows `prescriber` to be omitted; follow the account's documented identity requirements. The request contains 1–20 complete prescriptions for one patient and one practice. Creating an order signs and submits it in one request. There are no public preview, draft, sign, or submit methods.

Store the body and idempotency key before the first write. Retry an uncertain result with the same body and key. Do not use a new key to bypass an error or repeat a clinical action. Order creation requires a persisted `idempotencyKey` in request options and fails locally if it is missing. Other writes generate a random key when omitted, including order cancellation, practice creation and updates, webhook endpoint creation and updates, failed-webhook resend, and feedback. Automatic retries reuse the key; a separate call to another write generates a new one when omitted. Pass your persisted `idempotencyKey` to reuse a key across calls or process restarts. Keep caller keys unique per operation, 1–255 printable ASCII characters.

## List and cancel orders

```typescript
const orders = await api.orders.list({
  practiceId: input.practiceId,
  status: "submitted",
  limit: "20",
});
const cancellation = await api.orders.cancel(order.id);
```

Filter orders with `cancelRequested: "true"` or `"false"` to select pending cancellation requests. Cancellation has no request body. The SDK supplies its required idempotency header automatically. To retry across separate calls, pass a persisted key as `api.orders.cancel(order.id, { idempotencyKey: "persisted-test-cancellation" })`. A cancellation request may be pending; inspect the returned `status` and `cancelRequestedAt`, then retrieve the current order as needed. Submission acknowledgement does not mean a pharmacy has accepted or dispensed the prescription.

## Paginate

```typescript
let page = await api.medications.list({ limit: "20", query: "lidocaine" });
while (page.hasMore && page.nextCursor) {
  page = await api.medications.list({
    limit: "20",
    query: "lidocaine",
    startingAfter: page.nextCursor,
  });
}
```

List responses contain `data`, `hasMore`, and nullable `nextCursor`, along with `object` and `url`. Pass `nextCursor` unchanged as `startingAfter`; it is opaque and may differ from the final record ID. Keep filters, sort, organization, and mode unchanged between pages. Restart pagination after changing them. Limits are strings in the generated request types, matching the OpenAPI query schemas. Orders, practices, and webhooks also support `endingBefore`; send only one cursor parameter.

## Handle errors

```typescript
try {
  await api.orders.get("ord_01j2y8m6jcc9tt24af5pw9x1bc");
} catch (error) {
  if (!(error instanceof AffinityError)) throw error;
  console.error({
    status: error.statusCode,
    code: error.code,
    requestId: error.requestId,
    retryable: error.retryable,
  });
}
```

Log error metadata without credentials, patient data, or clinical request bodies. Retryability is a transport hint. Validation and authorization failures require a corrected request or authorization; ambiguous writes need the original key and input.

## Webhooks and feedback

```typescript
const endpoints = await api.webhooks.list({ limit: "20" });
const endpoint = await api.webhooks.create({
  url: "https://integration.example.test/affinity-webhook",
});
await api.webhooks.update(endpoint.id, {
  url: "https://integration.example.test/webhooks/affinity",
});
await api.webhooks.resendFailed(endpoint.id, { idempotencyKey: "persisted-test-resend-operation" });
await api.webhooks.remove(endpoint.id);
await api.feedback.create({ message: "Synthetic Test integration feedback." });
```

Use a reachable HTTPS receiver in your own Test integration. Keep the endpoint signing secret on the server. Verify the exact raw body and `affinity-signature` header with `verifyAffinityWebhook` before parsing or processing an event. Configure each receiver with the signing secret for its organization and Test/Live endpoint. Current MVP events have no organization or mode field. Durably deduplicate by event ID and acknowledge only after storing the work. Retrieve the current order when processing queued events so an out-of-order delivery cannot regress your local state. See [the EMR helper](../examples/emr-order.ts).


## Recover an order and select practice prices

After an uncertain order response, retry with the saved body and key. To look up an existing order by your own ID, use `api.orders.list({ externalOrderId, practiceId })`. For missed-webhook recovery, keep the same `updatedAfter` timestamp while paging.

Platform callers can request practice prices with `api.medications.list({ practiceId })` and `api.medications.get(medicationId, { practiceId, expand: ["variants"] })`. Unknown query parameters fail locally instead of being silently discarded. Query `limit` remains a string, matching the staging OpenAPI contract.
