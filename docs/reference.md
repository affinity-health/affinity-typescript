# Reference
## Account
<details><summary><code>client.account.<a href="/src/api/resources/account/client/Client.ts">get</a>() -> Affinity.Account</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Read the organization and Test or Live mode selected by the API key.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.account.get();

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**requestOptions:** `AccountClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Feedback
<details><summary><code>client.feedback.<a href="/src/api/resources/feedback/client/Client.ts">create</a>({ ...params }) -> Affinity.CreateFeedbackResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Send feedback without credentials, or with an API key to include its organization and mode. Do not include patient information. API-key callers are limited to 10 submissions per hour per key. Anonymous callers are limited to 10 submissions per hour per IP address. A 429 response includes Retry-After in seconds.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.feedback.create({
    idempotencyKey: "Idempotency-Key",
    message: "The error does not explain which field is invalid.",
    pageUrl: "https://docs.affinityrx.com/errors/",
    requestId: "6e562761-eff3-4626-a8b9-25ce7c670ccd"
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Affinity.CreateFeedbackRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `FeedbackClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Medications
<details><summary><code>client.medications.<a href="/src/api/resources/medications/client/Client.ts">list</a>({ ...params }) -> core.Page&lt;Affinity.Medication, Affinity.MedicationList&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Every medication you can order in the current mode, A to Z by name, then by ID. The list has no search or filters: read every page and choose by name, strength, form and pharmacy. Prices are in cents. `requirements` names the optional prescription fields this pharmacy requires; `compoundingReasons` and `quantities` list the accepted values when the pharmacy limits them, counted in `quantityUnit`. With a `fill`, `price` is per fill and each quantity counts `quantityUnit`, not fills: it is a whole number of fills in units. For a fill of 30 tablets, quantity 60 is two fills. For vials, quantity 1 is one vial and quantity 2 is two vials. A 2 mL vial lists quantities 1–10; its volume is separate from its quantity.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const pageableResponse = await client.medications.list({
    practiceId: "prac_01j2y8m6jcc9tt24af5pw9x1bc"
});
for await (const item of pageableResponse) {
    console.log(item);
}

// Or you can manually iterate page-by-page
let page = await client.medications.list({
    practiceId: "prac_01j2y8m6jcc9tt24af5pw9x1bc"
});
while (page.hasNextPage()) {
    page = await page.getNextPage();
}

// You can also access the underlying response
const response = page.response;

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Affinity.ListMedicationsRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `MedicationsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.medications.<a href="/src/api/resources/medications/client/Client.ts">get</a>({ ...params }) -> Affinity.GetMedicationsResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Read one available medication, its pricing, and pharmacy details for the current organization and mode. Pass expand=variants to include its other strengths, forms and pharmacies.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.medications.get({
    medicationId: "med_01j2y8m6jcc9tt24af5pw9x1bc",
    practiceId: "prac_01j2y8m6jcc9tt24af5pw9x1bc"
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Affinity.GetMedicationsRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `MedicationsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Orders
<details><summary><code>client.orders.<a href="/src/api/resources/orders/client/Client.ts">list</a>({ ...params }) -> core.Page&lt;Affinity.Order, Affinity.OrderList&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

List accessible orders in the current mode, newest first. `externalOrderId` matches exactly, including case. `updatedAfter` accepts an ISO 8601 timestamp with a timezone and returns strictly later updates. Keep filters fixed while paging. `sort` takes `patient` (lowercase firstName + space + lastName A to Z, then order ID) or `created` (oldest first); a leading `-` reverses. Creation time or patient name and the order ID determine cursor order, even when updatedAt changes.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const pageableResponse = await client.orders.list({
    patientId: "pat_01j2y8m6jcc9tt24af5pw9x1bc",
    practiceId: "prac_01j2y8m6jcc9tt24af5pw9x1bc"
});
for await (const item of pageableResponse) {
    console.log(item);
}

// Or you can manually iterate page-by-page
let page = await client.orders.list({
    patientId: "pat_01j2y8m6jcc9tt24af5pw9x1bc",
    practiceId: "prac_01j2y8m6jcc9tt24af5pw9x1bc"
});
while (page.hasNextPage()) {
    page = await page.getNextPage();
}

// You can also access the underlying response
const response = page.response;

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Affinity.ListOrdersRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `OrdersClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.orders.<a href="/src/api/resources/orders/client/Client.ts">create</a>({ ...params }) -> Affinity.Order</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

One request creates the order, signs it and sends it to the pharmacy. Platforms must send practiceId; practice callers can omit it to use their own practice. With an API key, name the prescriber and send signatureAttestation. Optional prescriber phone and address each default to the practice; no account is looked up by NPI. In the app, the signed-in member signs with the NPI in their settings, or names the prescriber with the same attestation. The patient is found by patient.externalId and updated from the order. Live orders require Live access on the practice and its platform. No payment method is required.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.orders.create({
    idempotencyKey: "Idempotency-Key",
    patient: {
        address: {
            line1: "line1",
            city: "city",
            state: "state",
            postalCode: "postalCode"
        },
        allergies: [{
                category: "drug",
                display: "display"
            }],
        dateOfBirth: "dateOfBirth",
        email: "email",
        firstName: "firstName",
        sex: "female",
        lastName: "lastName",
        phone: "phone"
    },
    prescriptions: [{
            directions: "directions",
            medicationId: "med_01j2y8m6jcc9tt24af5pw9x1bc",
            quantity: 1,
            refills: 1
        }],
    shipping: {
        optionId: "shp_01j2y8m6jcc9tt24af5pw9x1bc"
    },
    signatureAttestation: true
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Affinity.OrderInput` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `OrdersClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.orders.<a href="/src/api/resources/orders/client/Client.ts">get</a>({ ...params }) -> Affinity.Order</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Read one order and its prescriptions in the API key's organization and mode.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.orders.get({
    orderId: "ord_01j2y8m6jcc9tt24af5pw9x1bc"
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Affinity.GetOrdersRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `OrdersClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.orders.<a href="/src/api/resources/orders/client/Client.ts">cancel</a>({ ...params }) -> Affinity.Order</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

200 with status cancelled when the cancel is confirmed. 202 with cancelRequestedAt when the pharmacy has not confirmed yet: you get order.cancelled when it confirms, or, when it refuses, cancelRequestedAt becomes null and you get order.updated. 409 when the pharmacy refuses or the order has shipped.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.orders.cancel({
    idempotencyKey: "Idempotency-Key",
    orderId: "ord_01j2y8m6jcc9tt24af5pw9x1bc"
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Affinity.CancelOrdersRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `OrdersClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Practices
<details><summary><code>client.practices.<a href="/src/api/resources/practices/client/Client.ts">list</a>({ ...params }) -> core.Page&lt;Affinity.Practice, Affinity.PracticeList&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

List the platform's practices, newest first. Available to platforms only. `sort` takes `name` or `location` (A to Z, practices without a location last), `mode` (Test before Live) or `created` (oldest first); a leading `-` reverses.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const pageableResponse = await client.practices.list();
for await (const item of pageableResponse) {
    console.log(item);
}

// Or you can manually iterate page-by-page
let page = await client.practices.list();
while (page.hasNextPage()) {
    page = await page.getNextPage();
}

// You can also access the underlying response
const response = page.response;

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Affinity.ListPracticesRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `PracticesClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.practices.<a href="/src/api/resources/practices/client/Client.ts">create</a>({ ...params }) -> Affinity.Practice</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Platforms only. Name, phone and address are required. The practice starts in Test; `liveEnabled: true` also allows new Live orders, which needs a platform with Live access and a Live caller: a Live key, or a session in Live mode. Turning Live off later preserves access to existing records. A retry with the same key and body returns the stored first response, even if the practice has changed. Use GET /v1/practices/{practiceId} to read the current practice.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.practices.create({
    idempotencyKey: "Idempotency-Key",
    address: {
        line1: "line1",
        city: "city",
        state: "state",
        postalCode: "postalCode"
    },
    name: "name",
    phone: "phone"
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Affinity.CreatePracticesRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `PracticesClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.practices.<a href="/src/api/resources/practices/client/Client.ts">get</a>({ ...params }) -> Affinity.Practice</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Read one practice accessible to the API key. A platform can read its own practices.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.practices.get({
    practiceId: "prac_01j2y8m6jcc9tt24af5pw9x1bc"
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Affinity.GetPracticesRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `PracticesClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.practices.<a href="/src/api/resources/practices/client/Client.ts">update</a>({ ...params }) -> Affinity.Practice</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

`liveEnabled` allows or refuses new Live orders. Existing records, cancellation, webhooks and billing keep working. Only its platform changes it; enabling requires platform Live access, and either change needs a Live caller: a Live key (403 live_key_required otherwise) or a session in Live mode (403 live_mode_required otherwise). Live orders send `name`, `phone` and `address` to the pharmacy, so a practice with Live access changes them only with a Live key (403 live_mode_required otherwise). A retry with the same key and body returns the stored first response, even if the practice has changed. Use GET /v1/practices/{practiceId} to read the current practice.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.practices.update({
    idempotencyKey: "Idempotency-Key",
    practiceId: "prac_01j2y8m6jcc9tt24af5pw9x1bc"
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Affinity.UpdatePracticesRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `PracticesClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Webhooks
<details><summary><code>client.webhooks.<a href="/src/api/resources/webhooks/client/Client.ts">list</a>({ ...params }) -> core.Page&lt;Affinity.WebhookEndpoint, Affinity.WebhookEndpointList&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

List webhook endpoints owned by the API key's organization in its current mode. Signing secrets are not returned.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const pageableResponse = await client.webhooks.list();
for await (const item of pageableResponse) {
    console.log(item);
}

// Or you can manually iterate page-by-page
let page = await client.webhooks.list();
while (page.hasNextPage()) {
    page = await page.getNextPage();
}

// You can also access the underlying response
const response = page.response;

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Affinity.ListWebhooksRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `WebhooksClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.webhooks.<a href="/src/api/resources/webhooks/client/Client.ts">create</a>({ ...params }) -> Affinity.CreateWebhooksResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Platforms and independent practices can register up to 16 public HTTPS endpoints per mode. An API key acts only for its own organization and mode. Every event goes to every endpoint. The signing secret is returned by creation and its idempotent replay for 24 hours.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.webhooks.create({
    idempotencyKey: "Idempotency-Key",
    url: "url"
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Affinity.CreateWebhooksRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `WebhooksClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.webhooks.<a href="/src/api/resources/webhooks/client/Client.ts">remove</a>({ ...params }) -> Affinity.RemoveWebhooksResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Events not delivered to it yet are dropped.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.webhooks.remove({
    webhookEndpointId: "whe_01j2y8m6jcc9tt24af5pw9x1bc"
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Affinity.RemoveWebhooksRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `WebhooksClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.webhooks.<a href="/src/api/resources/webhooks/client/Client.ts">update</a>({ ...params }) -> Affinity.WebhookEndpoint</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

The signing secret stays the same.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.webhooks.update({
    idempotencyKey: "Idempotency-Key",
    webhookEndpointId: "whe_01j2y8m6jcc9tt24af5pw9x1bc",
    url: "url"
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Affinity.UpdateWebhooksRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `WebhooksClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.webhooks.<a href="/src/api/resources/webhooks/client/Client.ts">resendFailed</a>({ ...params }) -> Affinity.ResendFailedWebhooksResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Queue failed order event deliveries from the last 30 days for this endpoint. Only the current organization and mode apply. Each failed delivery gets up to 12 new attempts. Also make pending deliveries waiting on a later retry due now, without resetting their attempt counts. Keep the same event IDs, payloads, and per-order delivery sequence. The queued count includes both kinds. Pending deliveries already due, delivered events, and one-time test events stay unchanged. Send a unique Idempotency-Key for each request. Reuse that key after an uncertain response to return the original count. A request with a new key returns 0 when no eligible failures or pending deliveries waiting on a later retry remain.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.webhooks.resendFailed({
    idempotencyKey: "Idempotency-Key",
    webhookEndpointId: "whe_01j2y8m6jcc9tt24af5pw9x1bc"
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Affinity.ResendFailedWebhooksRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `WebhooksClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

