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

## Consults
<details><summary><code>client.consults.<a href="/src/api/resources/consults/client/Client.ts">list</a>({ ...params }) -> core.Page&lt;Affinity.Consult, Affinity.ConsultList&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

List the consults accessible to your API key in the current mode, newest first. Each row is the consult without its intake answers: read one consult for those. externalConsultId matches exactly, including case. Keep filters fixed while paging.
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
const pageableResponse = await client.consults.list({
    practiceId: "prac_01j2y8m6jcc9tt24af5pw9x1bc"
});
for await (const item of pageableResponse) {
    console.log(item);
}

// Or you can manually iterate page-by-page
let page = await client.consults.list({
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

**request:** `Affinity.ListConsultsRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ConsultsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.consults.<a href="/src/api/resources/consults/client/Client.ts">create</a>({ ...params }) -> Affinity.Consult</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Files the patient's proposed prescriptions and intake for a clinician of the network that reviews your platform's consults in this mode. Only a platform API key files consults: another key returns 403 forbidden, and a platform with no network linked in the key's mode returns 403 network_not_linked. The prescriptions are checked as a signed order with the same lines would be now (catalog, quantities, refills, requirements, shipping and price), so the consult is refused now for what its order would be refused for. A medication that the practice's catalog does not list in the key's mode returns 422 medication_not_visible. Every other broken rule returns one 422 invalid_order with one issue for each problem: an empty answer, a repeated intake id, a schedule rule, a patient in one of the network's live-visit states (live_visit_required at patient.address.state), each missing required answer (required at intake, naming the id) and the order's own rules. A Live consult needs its payer's payment method or covering credit, or it returns 409 payment_method_required. Send an Idempotency-Key: a retry with the same key and body returns the consult with its current status and 200; the same key with a different body returns 409 idempotency_key_reused. A used externalConsultId returns 409 consult_already_exists with data.consultId. In Test mode, a first prescription's notes that start with test_consult_approve or test_consult_decline make a test clinician approve or decline the consult at once; Live never does this. A clinician decides a Live consult, and the consult.approved or consult.declined event tells you.
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
await client.consults.create({
    idempotencyKey: "Idempotency-Key",
    externalConsultId: "intake-1042",
    practiceId: "prac_01j9z3k4m5n6p7q8r9s0t1v2w3",
    patient: {
        address: {
            line1: "200 Example Ave",
            city: "Austin",
            state: "TX",
            postalCode: "78701"
        },
        allergies: [{
                category: "drug",
                display: "display"
            }],
        dateOfBirth: "1985-06-14",
        email: "dana.example@example.com",
        firstName: "Dana",
        sex: "female",
        lastName: "Example",
        phone: "+15125550100",
        externalId: "patient-1042",
        heightInches: 65,
        weightPounds: 204
    },
    prescriptions: [{
            compoundingReason: "concentration_adjustment",
            directions: "Inject 0.25 mL (7.5 mg tirzepatide) under the skin once weekly.",
            medicationId: "med_3v9r73nmfs8bmbjb960yd2pggg",
            quantity: 1,
            refills: 0,
            substitutionPermitted: true,
            schedule: {
                step: 3,
                steps: [{
                        dose: {
                            amount: 2.5,
                            unit: "mg"
                        },
                        weeks: 4
                    }, {
                        dose: {
                            amount: 5,
                            unit: "mg"
                        },
                        weeks: 4
                    }, {
                        dose: {
                            amount: 7.5,
                            unit: "mg"
                        },
                        weeks: 4
                    }, {
                        dose: {
                            amount: 10,
                            unit: "mg"
                        },
                        weeks: 4
                    }, {
                        dose: {
                            amount: 12.5,
                            unit: "mg"
                        },
                        weeks: 4
                    }, {
                        dose: {
                            amount: 15,
                            unit: "mg"
                        }
                    }]
            }
        }],
    shipping: {
        optionId: "shp_7yna882w139zfbmwzeyb16y24e"
    },
    intake: [{
            id: "pregnancy_breastfeeding",
            question: "Are you pregnant, planning pregnancy or breastfeeding?",
            answer: "No",
            critical: false
        }, {
            id: "allergies",
            question: "Do you have any allergies?",
            answer: "No",
            critical: false
        }, {
            id: "current_medications",
            question: "What medications do you take now?",
            answer: "Metformin 500 mg twice daily",
            critical: false
        }, {
            id: "bariatric_surgery",
            question: "Have you had weight-loss surgery?",
            answer: "No",
            critical: false
        }, {
            id: "medullary_thyroid_cancer_men2",
            question: "Have you or a relative had medullary thyroid cancer or MEN2?",
            answer: "No",
            critical: false
        }, {
            id: "pancreatic_disease",
            question: "Have you had pancreatitis?",
            answer: "No",
            critical: false
        }, {
            id: "diabetes_history",
            question: "Do you have diabetes?",
            answer: "Type 2, A1c 7.1",
            critical: true
        }, {
            id: "gastroparesis",
            question: "Do you have gastroparesis?",
            answer: "No",
            critical: false
        }, {
            id: "severe_hypertriglyceridemia",
            question: "Have you had very high triglycerides?",
            answer: "No",
            critical: false
        }, {
            id: "hypoglycemia_history",
            question: "Have you had low blood sugar episodes?",
            answer: "No",
            critical: false
        }, {
            id: "glucose_lowering_medications",
            question: "Do you take medicine to lower blood sugar?",
            answer: "Metformin 500 mg twice daily",
            critical: true
        }, {
            id: "glp1_hypersensitivity",
            question: "Have you reacted to a GLP-1 medicine before?",
            answer: "No",
            critical: false
        }],
    patientQuestion: "Can I keep taking metformin?"
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

**request:** `Affinity.ConsultInput` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ConsultsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.consults.<a href="/src/api/resources/consults/client/Client.ts">get</a>({ ...params }) -> Affinity.Consult</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Read one consult accessible to your API key in the current mode, with its intake answers. A malformed consult ID returns 400 invalid_request. A well-formed ID returns 404 not_found when no consult has it, when it is another kind of ID, or when your API key cannot access the consult or it is of another mode.
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
await client.consults.get({
    consultId: "cns_01j2y8m6jcc9tt24af5pw9x1bc"
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

**request:** `Affinity.GetConsultsRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ConsultsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.consults.<a href="/src/api/resources/consults/client/Client.ts">prescription</a>({ ...params }) -> core.BinaryResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

The signed prescription as a PDF, made once when the consult was approved: every download returns the same file. A malformed consult ID returns 400 invalid_request. A consult that is not approved returns 404 not_found, as does a well-formed ID that no consult has, another kind of ID, or a consult your API key cannot access or of another mode.
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
await client.consults.prescription({
    consultId: "consultId"
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

**request:** `Affinity.PrescriptionConsultsRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ConsultsClient.RequestOptions` 
    
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

Every medication you can order in the current mode, A to Z by name, then by ID. Send query to find medications by name, ingredient, strength, form or pharmacy. Then choose by name, strength, form and pharmacy. Send practiceId to list what that practice can order, at its prices; without it, the caller's organization is used. Prices are in cents. `requirements` names the optional prescription fields this pharmacy requires; `compoundingReasons` lists the accepted reasons; when it is empty, send no reason. `quantities` lists the accepted values when the pharmacy limits them, counted in `quantityUnit`. With a `fill`, `price` is per fill and each quantity counts `quantityUnit`, not fills: it is a whole number of fills in units. For a fill of 30 tablets, quantity 60 is two fills. For vials, quantity 1 is one vial and quantity 2 is two vials. A 2 mL vial lists quantities 1–10; its volume is separate from its quantity.
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

List accessible orders in the current mode, newest first. `externalOrderId` matches exactly, including case. `updatedAfter` accepts an ISO 8601 timestamp with a timezone and returns strictly later updates. Keep filters fixed while paging. `sort` takes `patient` (lowercase firstName + space + lastName A to Z, then order ID) or `created` (oldest first); a `_desc` suffix reverses. Creation time or patient name and the order ID determine cursor order, even when updatedAt changes.
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

One request creates the order, signs it and sends it to the pharmacy. Platforms must send practiceId; practice callers can omit it to use their own practice. With an API key, name the prescriber and send signatureAttestation. Optional prescriber phone and address each default to the practice; no account is looked up by NPI. In the app, the signed-in member signs with the NPI in their settings, or names the prescriber with the same attestation. With patient.id (a pat_ ID) or patient.externalId, the order reuses that patient of the practice and mode and updates the saved record; without them, each order creates a new patient. If id and externalId identify different patients, the request returns 422 invalid_order. A medication that the practice's catalog does not list in the caller's mode returns 422 medication_not_visible, with an issue at prescriptions[n].medicationId; read GET /v1/medications with the same key and practiceId. Other broken order rules return 422 invalid_order, with one issue for each problem. When PerfectRx already holds a different firstName or lastName for the patient, the order is still accepted: a Live order stays submitted until staff correct the name with PerfectRx, and a Test order fails with a failureReason. Live orders require Live access on the practice and its platform. A Live order needs its payer's default payment method (a card or a US bank account) or account credit that covers the order, or it returns 409 payment_method_required; the platform pays for its practices. A payer that Affinity bills on one invoice for its shipped Live orders needs neither.
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
        phone: "+15125550100"
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

<details><summary><code>client.orders.<a href="/src/api/resources/orders/client/Client.ts">search</a>({ ...params }) -> Affinity.OrderList</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Takes the same filters as List orders (GET /v1/orders) in a JSON body, so patient details stay out of URLs and logs. Matches similar spellings as List orders does. Returns the same list, newest first unless sort is supplied. For the next page, send the same body with startingAfter set to nextCursor. limit is a number, and cancelRequested and recentlyShipped are booleans.
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
await client.orders.search();

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

**request:** `Affinity.OrderSearch` 
    
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

200 with status cancelled when the cancel is confirmed. 202 with cancelRequestedAt when the pharmacy has not confirmed yet: you get order.cancelled when it confirms, or, when it refuses, cancelRequestedAt becomes null and you get order.updated. If an earlier ask may have reached the pharmacy, a refusal keeps cancelRequestedAt and sends no event until the pharmacy ends the order (order.cancelled or order.shipped). 409 cannot_cancel when the order is shipped, delivered or failed. 409 cancel_refused when the pharmacy refused the cancel, or when Affinity could not reach the pharmacy; only the second says to retry with a new Idempotency-Key.
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

List the platform's practices, newest first. Available to platforms only. `sort` takes `name` or `location` (A to Z, practices without a location last), `mode` (without Live access, then with it) or `created` (oldest first); a `_desc` suffix reverses.
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
    phone: "+15125550100"
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

`liveEnabled` allows or refuses new Live orders. Existing records, cancellation, webhooks and billing keep working. Only its platform changes it; enabling requires platform Live access, and either change needs a Live caller: a Live key (403 live_key_required otherwise) or a session in Live mode (403 live_mode_required otherwise). Live orders send `name`, `phone` and `address` to the pharmacy, so a practice with Live access changes them only in Live mode, with a Live key or a session in Live mode (403 live_mode_required otherwise). A retry with the same key and body returns the stored first response, even if the practice has changed. Use GET /v1/practices/{practiceId} to read the current practice.
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

Queue failed event deliveries from the last 30 days for this endpoint. Only the current organization and mode apply. Each failed delivery gets up to 12 new attempts. Also make pending deliveries waiting on a later retry due now, without resetting their attempt counts. Keep the same event IDs, payloads, and per-order delivery sequence. The queued count includes both kinds. Pending deliveries already due, delivered events, and one-time test events stay unchanged. Send a unique Idempotency-Key for each request. Reuse that key after an uncertain response to return the original count. A request with a new key returns 0 when no eligible failures or pending deliveries waiting on a later retry remain.
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

