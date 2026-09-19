import { Affinity, AffinityError } from "@affinity-health/sdk";
import type { CreateOrderParams, Order, PreviewOrderParams } from "@affinity-health/sdk";
import { accessPassword, seal, unseal } from "./security.server";

export const syntheticPatient = {
  name: { first: "Synthetic", last: "SDK Patient" },
  dateOfBirth: "1990-01-01",
  email: "sdk-patient@example.test",
  phone: "2025550199",
  address: {
    line1: "100 Test St",
    city: "Austin",
    state: "TX",
    postalCode: "78701",
    country: "US" as const,
  },
};

export async function client() {
  const key = process.env.AFFINITY_EXAMPLE_API_KEY;
  const practiceId = process.env.AFFINITY_EXAMPLE_PRACTICE_ID;
  if (!key || !practiceId)
    throw new Error("Set AFFINITY_EXAMPLE_API_KEY and AFFINITY_EXAMPLE_PRACTICE_ID on the server.");
  const affinity = new Affinity(key, { maxNetworkRetries: 2 });
  // Check the deployed API, not a key-prefix guess. Every operation fails closed.
  if ((await affinity.apiKeys.retrieve()).livemode !== false)
    throw new Error("This example refuses Live-mode API keys.");
  return { affinity, practiceId };
}

export async function safely<T>(action: () => Promise<T>) {
  try {
    return { ok: true as const, value: await action() };
  } catch (cause) {
    // Do not serialize SDK request/response objects or headers into browser errors.
    return {
      ok: false as const,
      error:
        cause instanceof AffinityError
          ? `${cause.statusCode}: ${cause.message}${cause.requestId ? ` (request ${cause.requestId})` : ""}`
          : cause instanceof Error
            ? cause.message
            : "Request failed. Retry the same action.",
    };
  }
}

type PatientReceipt = { practiceId: string; patientId: string; runId: string };
type PreviewReceipt = { practiceId: string; input: CreateOrderParams; key: string };
type ReviewReceipt = {
  practiceId: string;
  orderId: string;
  versions: { prescriptionId: string; version: number }[];
  key: string;
};

function receipt<T extends { practiceId: string }>(
  token: string,
  kind: string,
  practiceId: string,
) {
  const value = unseal<T>(token, kind, accessPassword());
  if (value.practiceId !== practiceId) throw new Error("Workspace changed. Start a new Test run.");
  return value;
}

export async function prepare(runId: string) {
  const { affinity, practiceId } = await client();
  const practice = await affinity.practices.retrieve(practiceId);
  const patient = await affinity.patients.create(
    practiceId,
    {
      ...syntheticPatient,
      externalId: `sdk-example-${runId}`,
    },
    { idempotencyKey: `sdk-example:patient:${runId}` },
  );
  return {
    practice: { id: practice.id, name: practice.name },
    patient,
    patientToken: seal<PatientReceipt>(
      "patient",
      { practiceId, patientId: patient.id, runId },
      accessPassword(),
    ),
  };
}

export async function catalog(query: string, startingAfter?: string) {
  const { affinity, practiceId } = await client();
  return affinity.catalog.list({
    practiceId,
    query,
    startingAfter,
    limit: 25,
    hideControlledSubstances: true,
    hideUnpriced: true,
  });
}

export async function preview(
  token: string,
  items: Pick<PreviewOrderParams, "prescriptions" | "otcItems" | "shipping">,
) {
  const { affinity, practiceId } = await client();
  const patient = receipt<PatientReceipt>(token, "patient", practiceId);
  const result = await affinity.orders.preview({
    ...items,
    practiceId,
    patientId: patient.patientId,
  });
  return {
    result,
    previewToken:
      result.status === "complete"
        ? seal<PreviewReceipt>(
            "preview",
            {
              practiceId,
              input: result.orderInput,
              key: `sdk-example:create:${crypto.randomUUID()}`,
            },
            accessPassword(),
          )
        : null,
  };
}

function review(order: Order) {
  return {
    order,
    reviewToken: seal<ReviewReceipt>(
      "review",
      {
        practiceId: order.practiceId,
        orderId: order.id,
        versions: order.prescriptions.map((rx) => ({ prescriptionId: rx.id, version: rx.version })),
        key: `sdk-example:sign:${crypto.randomUUID()}`,
      },
      accessPassword(),
    ),
  };
}

export async function createDraft(token: string) {
  const { affinity, practiceId } = await client();
  const accepted = receipt<PreviewReceipt>(token, "preview", practiceId);
  const draft = await affinity.orders.create(accepted.input, { idempotencyKey: accepted.key });
  return review(await affinity.orders.retrieve(draft.id));
}

export async function recordAllergies(token: string) {
  const { affinity, practiceId } = await client();
  const patient = receipt<PatientReceipt>(token, "patient", practiceId);
  return affinity.patients.replaceAllergies(
    practiceId,
    patient.patientId,
    { allergies: [], reviewStatus: "no_known" },
    { idempotencyKey: `sdk-example:allergies:${patient.runId}` },
  );
}

export async function sign(token: string, npi: string) {
  const { affinity, practiceId } = await client();
  const accepted = receipt<ReviewReceipt>(token, "review", practiceId);
  // Never refetch versions and silently sign a changed order.
  return affinity.orders.signAndSubmit(
    accepted.orderId,
    {
      practiceId,
      prescriber: { npi },
      signatureAttestation: true,
      expectedVersions: accepted.versions,
    },
    { idempotencyKey: `${accepted.key}:${npi}` },
  );
}

export async function refresh(token: string) {
  const { affinity, practiceId } = await client();
  const accepted = receipt<ReviewReceipt>(token, "review", practiceId);
  return review(await affinity.orders.retrieve(accepted.orderId));
}
