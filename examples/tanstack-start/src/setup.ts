import { createServerFn } from "@tanstack/react-start";

const TEST_PROVIDER_NPI = "1234567893";

export const createTestPractice = createServerFn({ method: "POST" }).handler(async () => {
  const { Affinity } = await import("@affinity-health/sdk");
  const apiKey = process.env.AFFINITY_API_KEY;
  if (!apiKey) throw new Error("Set AFFINITY_API_KEY in .env.local to a Test-mode API key.");

  const affinity = new Affinity(apiKey);
  const access = await affinity.apiKeys.retrieve();
  if (access.livemode) throw new Error("This example accepts only a Test-mode API key.");

  const runId = crypto.randomUUID();
  const providerName = "Dr. Alex Morgan";
  const practice = await affinity.practices.create(
    {
      address: {
        city: "Detroit",
        country: "US",
        line1: "100 Test Practice Way",
        postalCode: "48201",
        state: "MI",
      },
      attestations: {
        authorizedPhiTransfer: true,
        authorizedPracticeRelationship: true,
        minimumNecessaryPhi: true,
        providerDataAccuracy: true,
      },
      externalId: `sdk_example_practice_${runId}`,
      legalName: "Northstar Test Practice PLLC",
      name: "Northstar Test Practice",
      prescribers: [
        {
          credentials: "MD",
          licenseStates: ["MI"],
          name: providerName,
          npi: TEST_PROVIDER_NPI,
        },
      ],
      primaryContact: { email: "ops@example.com", name: "Test Operations" },
      timezone: "America/Detroit",
    },
    { idempotencyKey: `practice:${runId}` },
  );
  const user = await affinity.team.createUser(
    practice.id!,
    {
      email: "alex.morgan@example.com",
      externalId: `sdk_example_provider_${runId}`,
      name: providerName,
      role: "prescriber",
      identityAttestation: true,
      npi: TEST_PROVIDER_NPI,
      credentials: "MD",
    },
    { idempotencyKey: `user:${runId}` },
  );
  const team = await affinity.team.retrieve(practice.id!);

  return {
    practiceId: practice.id,
    team,
    testNpi: TEST_PROVIDER_NPI,
    userId: user.id,
  };
});
