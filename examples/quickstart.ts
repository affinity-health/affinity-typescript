import { Affinity } from "@affinity-health/sdk";

const apiKey = process.env.AFFINITY_API_KEY;
if (!apiKey) throw new Error("Set AFFINITY_API_KEY to a test-mode service key");

const affinity = new Affinity(apiKey);
const access = await affinity.apiKeys.getApiAccess();
if (access.livemode) throw new Error("This quickstart only runs with a test-mode key");

const catalog = await affinity.catalog.listCatalogItems({ limit: 10, query: "semaglutide" });
const pharmacies = await affinity.catalog.listPharmacies({ limit: 10 });
console.log(`Found ${catalog.data.length} matching test catalog items`);
console.log(`Found ${pharmacies.data.length} pharmacies available to this test account`);

if (process.env.RUN_AFFINITY_MUTATION_EXAMPLE === "1") {
  const runId = crypto.randomUUID();
  const actingAffinity = affinity;
  const practice = await affinity.practices.createPractice({
    createPracticeRequest: {
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
    idempotencyKey: crypto.randomUUID(),
  });
  const patient = await actingAffinity.patients.createPatient({
    affinityActorId: "quickstart-system",
    affinityActorType: "system",
    createPatientRequest: {
      address: {
        city: "Los Angeles",
        country: "US",
        line1: "100 Main St",
        postalCode: "90001",
        state: "CA",
      },
      dateOfBirth: "1990-01-01",
      email: "patient@example.com",
      externalIdentities: [{ source: "quickstart", value: `patient_${runId}` }],
      name: { first: "Demo", last: "Patient" },
      phone: "+13135550100",
    },
    idempotencyKey: crypto.randomUUID(),
    practiceId: practice.id!,
  });
  await actingAffinity.patients.replacePatientAllergies({
    affinityActorId: "quickstart-system",
    affinityActorType: "system",
    idempotencyKey: crypto.randomUUID(),
    patientId: patient.id!,
    practiceId: practice.id!,
    replacePatientAllergiesRequest: { allergies: [], reviewStatus: "no_known" },
  });

  const practiceCatalog = await affinity.catalog.listCatalogItems({
    limit: 10,
    practiceId: practice.id!,
    query: "semaglutide",
  });

  const practiceOrders = await actingAffinity.orders.listOrders({
    affinityActorId: "quickstart-system",
    affinityActorType: "system",
    practiceId: practice.id!,
  });
  console.log(
    `Created and allergy-reviewed patient ${patient.id} for practice ${practice.id}; ${practiceCatalog.data.length} priced catalog items and ${practiceOrders.data.length} orders are visible`,
  );

  console.log(
    "For a verified provider, call actingAffinity.orders.createOrder(...) with an unsigned order, then use the order lifecycle operations as permitted by the account.",
  );
}
