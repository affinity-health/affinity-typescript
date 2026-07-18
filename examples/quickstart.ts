import { Affinity } from "@affinity-health/sdk";

const apiKey = process.env.AFFINITY_API_KEY;
if (!apiKey) throw new Error("Set AFFINITY_API_KEY to a test-mode service key");

const affinity = new Affinity(apiKey);
const access = await affinity.account.retrieveAccess();
if (access.livemode) throw new Error("This quickstart only runs with a test-mode key");

const catalog = await affinity.catalog.list({ limit: 10, query: "semaglutide", route: "all" });
console.log(`Found ${catalog.items.length} matching sandbox catalog items`);

if (process.env.RUN_AFFINITY_MUTATION_EXAMPLE === "1") {
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
      externalId: "practice_123",
      name: "Northstar Wellness",
      primaryContact: { email: "ops@example.com", name: "Clinical Operations" },
    },
    { idempotencyKey: crypto.randomUUID() },
  );
  const order = await affinity.orders.create(
    {
      catalogItemId: catalog.items[0]!.id,
      directions: "Use as directed by the prescribing clinician.",
      externalOrderId: "order_123",
      patient: {
        address: {
          city: "Los Angeles",
          country: "US",
          line1: "100 Main St",
          postalCode: "90001",
          state: "CA",
        },
        dateOfBirth: new Date("1990-01-01"),
        email: "patient@example.com",
        externalPatientId: "patient_123",
        name: "Demo Patient",
        state: "CA",
      },
      practiceId: practice.id,
      prescriber: {
        licenseStates: ["CA"],
        name: "Example Prescriber",
        npi: "1234567893",
      },
      prescription: { authorized: true, signedAt: new Date() },
      quantity: 1,
    },
    { idempotencyKey: crypto.randomUUID() },
  );
  console.log(`Created sandbox order ${order.order.id}`);
}
