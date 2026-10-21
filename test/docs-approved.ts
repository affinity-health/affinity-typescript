// Compile-only guide snippets. Never execute against an API.
import { Affinity, AffinityError, type OrderCreateParams } from "../src";
async function guideExamples() {
  const api = new Affinity(process.env.AFFINITY_API_KEY!, {
    baseUrl: "https://api-staging.affinityrx.com",
    maxNetworkRetries: 2,
  });
  const account = await api.account.get();
  if (account.mode !== "test") throw new Error("This example requires a Test key");

  const page = await api.medications.list({ limit: "20", query: "lidocaine" });
  const medication = page.data[0] ? await api.medications.get(page.data[0].id) : undefined;
  if (!medication) throw new Error("No Lidocaine medication found in Test mode");
  const shippingOptionId = medication.shippingOptions[0]?.id;
  if (!shippingOptionId) throw new Error("Medication has no shipping options");

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
  const order = await api.orders.create(input, {
    idempotencyKey: "persisted-test-order-operation",
  });
  const current = await api.orders.get(order.id);

  const orders = await api.orders.list({
    practiceId: input.practiceId,
    status: "submitted",
    limit: "20",
  });
  const cancellation = await api.orders.cancel(order.id);

  let nextPage = await api.medications.list({ limit: "20", query: "lidocaine" });
  while (nextPage.hasMore && nextPage.nextCursor) {
    nextPage = await api.medications.list({
      limit: "20",
      query: "lidocaine",
      startingAfter: nextPage.nextCursor,
    });
  }

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

  const endpoints = await api.webhooks.list({ limit: "20" });
  const endpoint = await api.webhooks.create({
    url: "https://integration.example.test/affinity-webhook",
  });
  await api.webhooks.update(endpoint.id, {
    url: "https://integration.example.test/webhooks/affinity",
  });
  await api.webhooks.resendFailed(endpoint.id, {
    idempotencyKey: "persisted-test-resend-operation",
  });
  await api.webhooks.remove(endpoint.id);
  await api.feedback.create({ message: "Synthetic Test integration feedback." });
}
void guideExamples;
