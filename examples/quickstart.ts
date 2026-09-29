import { Affinity } from "@affinity-health/sdk";

const apiKey = process.env.AFFINITY_API_KEY;
if (!apiKey) throw new Error("Set AFFINITY_API_KEY to a test-mode service key");

const affinity = new Affinity(apiKey);
const access = await affinity.apiKeys.getAccess();
if (access.livemode) throw new Error("This quickstart only runs with a test-mode key");

const practiceId = process.env.AFFINITY_PRACTICE_ID;
const catalog = await affinity.catalog.items.list(
  { limit: 10, query: "semaglutide" },
  { practiceId },
);
const pharmacies = await affinity.pharmacies.list({ limit: 10 });
console.log(`Found ${catalog.data.length} matching test catalog items`);
console.log(`Found ${pharmacies.data.length} pharmacies available to this test account`);

if (process.env.RUN_AFFINITY_MUTATION_EXAMPLE === "1") {
  const runId = crypto.randomUUID();
  const practice = await affinity.practices.create({
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
  });
  const scoped = affinity.forPractice(practice.id);
  const patient = await scoped.patients.create({
    address: {
      city: "Los Angeles",
      country: "US",
      line1: "100 Main St",
      postalCode: "90001",
      state: "CA",
    },
    dateOfBirth: "1990-01-01",
    email: "patient@example.com",
    externalId: `patient_${runId}`,
    name: { first: "Demo", last: "Patient" },
    phone: "+13135550100",
  });
  await scoped.patients.allergies.replace(
    patient.id,
    {
      allergies: [],
      reviewStatus: "no_known",
    },
    { idempotencyKey: `allergies:${runId}` },
  );
  const allergies = await scoped.patients.allergies.get(patient.id);

  const practiceCatalog = await scoped.catalog.items.list({
    limit: 10,
    query: "semaglutide",
  });

  const practiceOrders = await scoped.orders.list();
  console.log(
    `Created and allergy-reviewed patient ${patient.id} for practice ${practice.id}; ${allergies.allergies?.length ?? 0} allergies, ${practiceCatalog.data.length} priced catalog items, and ${practiceOrders.data.length} orders are visible`,
  );

  console.log(
    "For a verified provider, call affinity.orders.create(...) with an unsigned order, then use the order lifecycle operations as permitted by the account.",
  );
}
