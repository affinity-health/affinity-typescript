import {
  Affinity,
  AffinityError,
  ResponseError,
  affinityErrorFromResponse,
} from "@affinity-health/sdk";
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
  if (!key) throw new Error("Set AFFINITY_EXAMPLE_API_KEY on the server.");
  const affinity = new Affinity(key, { maxNetworkRetries: 2 });
  // Check the deployed API, not a key-prefix guess. Every operation fails closed.
  const access = await affinity.auth.access.retrieve();
  if (access.livemode !== false) throw new Error("This example refuses Live-mode API keys.");
  if (access.serviceAccount.subjectType !== "platform")
    throw new Error("Use a platform Test key to list its practices.");
  return { affinity };
}

export async function safely<T>(action: () => Promise<T>) {
  try {
    return { ok: true as const, value: await action() };
  } catch (error) {
    const cause =
      error instanceof ResponseError ? await affinityErrorFromResponse(error.response) : error;
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

function receipt<T extends { practiceId: string }>(token: string, kind: string) {
  const value = unseal<T>(token, kind, accessPassword());
  return value;
}

export async function practices(startingAfter?: string, mode: "test" | "live" = "test") {
  const { affinity } = await client();
  let directory = affinity;
  if (mode === "live") {
    const key = process.env.AFFINITY_EXAMPLE_DIRECTORY_KEY;
    if (!key)
      throw new Error("Set AFFINITY_EXAMPLE_DIRECTORY_KEY to a Live practices:read-only key.");
    directory = new Affinity(key);
    const [live, test] = await Promise.all([
      directory.auth.access.retrieve(),
      affinity.auth.access.retrieve(),
    ]);
    if (
      live.livemode !== true ||
      live.serviceAccount.subjectType !== "platform" ||
      live.serviceAccount.subjectId !== test.serviceAccount.subjectId ||
      live.scopes.length !== 1 ||
      live.scopes[0] !== "practices:read"
    )
      throw new Error(
        "Directory key must be Live, practices:read only, and belong to the same platform.",
      );
  }
  const page = await directory.practices.list({ limit: 25, startingAfter });
  return {
    hasMore: page.hasMore,
    data: page.data.map(({ id, name, liveEnabled, livemode }) => ({
      id,
      name,
      liveEnabled,
      livemode,
    })),
  };
}

export async function prepare(runId: string, practiceId: string) {
  const { affinity } = await client();
  const practice = await affinity.practices.retrieve(practiceId);
  const patient = await affinity.practices.patients.create(
    practiceId,
    {
      ...syntheticPatient,
      externalId: `sdk-example-${runId}`,
    },
    { idempotencyKey: `sdk-example:patient:${practiceId}:${runId}` },
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

export async function catalog(practiceId: string, query: string, startingAfter?: string) {
  const { affinity } = await client();
  return affinity.catalog.items.list({
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
  const { affinity } = await client();
  const patient = receipt<PatientReceipt>(token, "patient");
  const { practiceId } = patient;
  const result = await affinity.orderPreviews.create({
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
  const { affinity } = await client();
  const accepted = receipt<PreviewReceipt>(token, "preview");
  const draft = await affinity.orders.create(accepted.input, { idempotencyKey: accepted.key });
  return review(await affinity.orders.retrieve(draft.id));
}

export async function recordAllergies(token: string) {
  const { affinity } = await client();
  const patient = receipt<PatientReceipt>(token, "patient");
  const { practiceId } = patient;
  return affinity.practices.patients.allergies.update(
    practiceId,
    patient.patientId,
    { allergies: [], reviewStatus: "no_known" },
    { idempotencyKey: `sdk-example:allergies:${patient.runId}` },
  );
}

export async function sign(token: string, npi: string) {
  const { affinity } = await client();
  const accepted = receipt<ReviewReceipt>(token, "review");
  const { practiceId } = accepted;
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
  const { affinity } = await client();
  const accepted = receipt<ReviewReceipt>(token, "review");
  return review(await affinity.orders.retrieve(accepted.orderId));
}
