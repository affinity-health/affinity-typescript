import { Affinity, type OrderCreateParams, verifyAffinityWebhook } from "@affinity-health/sdk";

const api = new Affinity(process.env.AFFINITY_API_KEY!);
if ((await api.account.get()).mode !== "test") throw new Error("Use a Test key");

const medications = await api.medications.list({ limit: 10 });
const medication = await api.medications.get(medications.data[0]!.id);
const input: OrderCreateParams = {
  practiceId: process.env.AFFINITY_PRACTICE_ID!,
  externalOrderId: "sdk-test-order-1",
  prescriber: { npi: "1234567893", firstName: "Sam", lastName: "Example" },
  signatureAttestation: true,
  shippingOptionId: medication.shippingOptions[0]!.id,
  patient: {
    externalId: "sdk-test-patient-1",
    firstName: "Synthetic",
    lastName: "SDKB01",
    dateOfBirth: "1990-01-01",
    gender: "unknown",
    phone: "+12025550199",
    email: "sdk-test@example.invalid",
    allergies: [],
    address: { line1: "100 Congress Ave", city: "Austin", state: "TX", postalCode: "78701" },
  },
  prescriptions: [
    {
      medicationId: medication.id,
      quantity: medication.quantities[0] ?? 1,
      refills: 0,
      directions: "Use as reviewed by the prescriber",
      compoundingReason: medication.compoundingReasons[0],
    },
  ],
};

const endpoint = await api.webhooks.endpoints.create({
  url: "https://your-server.example/webhooks/affinity",
});
// Save endpoint.secret securely with its organization and mode. It is returned once.

// Persist each complete clinician-approved request and key before sending.
// Check medication.requirements for pharmacy-specific fields.
const order = await api.orders.create(input, { idempotencyKey: "saved-sdk-order-1" });
const current = await api.orders.get(order.id);

// A second order with the same patient externalId and identity reuses the patient.
const returning = await api.orders.create(
  { ...input, externalOrderId: "sdk-test-order-2" },
  { idempotencyKey: "saved-sdk-order-2" },
);
if (returning.patientId !== current.patientId) throw new Error("Patient was not reused");

const page = await api.orders.list({ practiceId: input.practiceId, limit: 1 });
if (page.hasMore && page.nextCursor) {
  await api.orders.list({ practiceId: input.practiceId, limit: 1, startingAfter: page.nextCursor });
}
if (medications.hasMore && medications.nextCursor) {
  await api.medications.list({ limit: 10, startingAfter: medications.nextCursor });
}
const cancellation = await api.orders.cancel(order.id);
// Inspect cancellation.status and cancelRequestedAt; pharmacy confirmation may be pending.

// In your webhook handler, verify the raw body before parsing or processing it.
async function receive(request: Request) {
  const event = await verifyAffinityWebhook({
    body: await request.arrayBuffer(),
    signature: request.headers.get("affinity-signature"),
    secret: endpoint.secret,
  });
  // Deduplicate event.id durably before applying a newer data.order.updatedAt.
  return event;
}
