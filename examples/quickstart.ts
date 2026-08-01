import { Affinity } from "@affinity-health/sdk";

const apiKey = process.env.AFFINITY_API_KEY;
if (!apiKey) throw new Error("Set AFFINITY_API_KEY to a test-mode service key");

const affinity = new Affinity(apiKey);
const access = await affinity.account.retrieveAccess();
if (access.livemode) throw new Error("This quickstart only runs with a test-mode key");

const catalog = await affinity.catalog.list({ limit: 10, query: "semaglutide", route: "all" });
const compounders = await affinity.compounders.list();
console.log(`Found ${catalog.data.length} matching test catalog items`);
console.log(`Found ${compounders.data.length} compounders available to this test account`);

if (process.env.RUN_AFFINITY_MUTATION_EXAMPLE === "1") {
  const runId = crypto.randomUUID();
  const actingAffinity = affinity.withActor({ id: `quickstart_${runId}`, type: "system" });
  const practice = await affinity.practices.create(
    {
      address: {
        city: "Los Angeles",
        country: "US",
        line1: "100 Main St",
        postalCode: "90001",
        state: "CA",
      },
      attestations: {
        authorizedPhiTransfer: true,
        authorizedPracticeRelationship: true,
        minimumNecessaryPhi: true,
        providerDataAccuracy: true,
      },
      externalId: `practice_${runId}`,
      name: "Northstar Wellness",
      primaryContact: { email: "ops@example.com", name: "Clinical Operations" },
    },
    { idempotencyKey: crypto.randomUUID() },
  );
  const patient = await actingAffinity.patients.create(
    practice.id,
    {
      address: {
        city: "Los Angeles",
        country: "US",
        line1: "100 Main St",
        postalCode: "90001",
        state: "CA",
      },
      dateOfBirth: new Date("1990-01-01"),
      email: "patient@example.com",
      externalId: `patient_${runId}`,
      name: { first: "Demo", last: "Patient" },
      phone: "+13135550100",
    },
    { idempotencyKey: crypto.randomUUID() },
  );

  const paymentProfile = await affinity.billing.retrievePaymentProfile(practice.id);
  if (paymentProfile.status === "setup_required") {
    const setup = await affinity.billing.createPaymentSetup(
      practice.id,
      { consentAccepted: true },
      { idempotencyKey: crypto.randomUUID() },
    );
    console.log(
      `Send the ${setup.publishableKey} publishable key and one-time client secret to an authenticated Stripe.js setup view`,
    );
  }

  const practiceOrders = await actingAffinity.orders.list({ practiceId: practice.id });
  console.log(
    `Created patient ${patient.id} for practice ${practice.id}; ${practiceOrders.data.length} orders are visible`,
  );

  console.log(
    "For a verified provider, call actingAffinity.prescriptions.create(...) and then affinity.prescriptionSigningSessions.create(...) to obtain the one-time provider signing URL.",
  );
}
