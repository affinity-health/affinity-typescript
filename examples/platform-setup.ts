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
  const user = await affinity.team.createUser(
    practiceId,
    {
      email: externalProvider.email,
      externalId: externalProvider.id,
      name: externalProvider.name,
      role: "prescriber",
      identityAttestation: true,
      npi: externalProvider.npi,
      credentials: "MD",
    },
    { idempotencyKey: `user:${externalProvider.id}` },
  );

  const team = await affinity.team.retrieve(practiceId);
  return { team, user, practiceTermsVersion };
}
