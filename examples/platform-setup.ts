import { Affinity } from "@affinity-health/sdk";

interface ExternalProvider {
  email: string;
  id: string;
  name: string;
  npi: string;
}

interface ProvisionProviderOptions {
  affinity: Affinity;
  externalProvider: ExternalProvider;
  practiceId: string;
  practiceTermsVersion: string;
}

export async function provisionProvider({
  affinity,
  externalProvider,
  practiceId,
  practiceTermsVersion,
}: ProvisionProviderOptions) {
  const user = await affinity.users.create(
    {
      email: externalProvider.email,
      externalId: externalProvider.id,
      name: externalProvider.name,
    },
    { idempotencyKey: `user:${externalProvider.id}` },
  );

  const roles = await affinity.roles.list(practiceId, { limit: 100 });
  const role = roles.data.find((item) => item.name === "Prescriber");
  if (!role) throw new Error("Choose an approved practice role");

  const membership = await affinity.memberships.create(
    practiceId,
    {
      roleId: role.id,
      termsVersion: practiceTermsVersion,
      userId: user.id,
    },
    { idempotencyKey: `membership:${practiceId}:${user.id}` },
  );

  const providerMapping = await affinity.providerMappings.create(
    {
      attestations: {
        authorizedProviderRelationship: true,
        providerDataAccuracy: true,
      },
      credentials: "MD",
      externalId: externalProvider.id,
      name: externalProvider.name,
      npi: externalProvider.npi,
      practiceId,
      userId: user.id,
    },
    { idempotencyKey: `provider-mapping:${practiceId}:${externalProvider.id}` },
  );

  const verification = await affinity.hostedSessions.create(
    {
      consent: {
        authorizedProviderAccess: true,
        minimumNecessaryPhi: true,
        recordedAt: new Date().toISOString(),
      },
      flow: "provider_verification",
      membershipId: membership.id,
      practiceId,
      providerMappingId: providerMapping.id,
      returnUrl: "https://app.example.com/affinity/return",
      userId: user.id,
    },
    { idempotencyKey: `verify:${providerMapping.id}` },
  );

  return { membership, providerMapping, user, verification };
}
