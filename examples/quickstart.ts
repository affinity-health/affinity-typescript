import { Affinity } from "@affinity-health/sdk";

const apiKey = process.env.AFFINITY_API_KEY;
if (!apiKey) throw new Error("Set AFFINITY_API_KEY to a test-mode service key");

const affinity = new Affinity(apiKey);
const access = await affinity.account.retrieveAccess();
if (access.livemode) throw new Error("This quickstart only runs with a test-mode key");

const catalog = await affinity.catalog.list({ limit: 10, query: "semaglutide", route: "all" });
console.log(`Found ${catalog.data.length} matching test catalog items`);

if (process.env.RUN_AFFINITY_MUTATION_EXAMPLE === "1") {
  const catalogItem = catalog.data[0];
  if (!catalogItem) throw new Error("The test catalog did not return an orderable item");
  const runId = crypto.randomUUID();
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
  const order = await affinity.orders.create(
    {
      catalogItemId: catalogItem.id,
      directions: "Use as directed by the prescribing clinician.",
      externalOrderId: `order_${runId}`,
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
  const retrieved = await affinity.orders.retrieve(order.id);
  const submitted = await affinity.orders.submit(order.id, {
    idempotencyKey: crypto.randomUUID(),
  });
  const practiceOrders = await affinity.orders.list({ practiceId: practice.id });
  if (!practiceOrders.data.some((item) => item.id === order.id)) {
    throw new Error("The new order was not returned by its practice-scoped order list");
  }
  console.log(
    `Created, retrieved, submitted, and listed test order ${submitted.id} for practice ${retrieved.practiceId}`,
  );
}
