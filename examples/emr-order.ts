import {
  Affinity,
  AffinityError,
  ResponseError,
  affinityErrorFromResponse,
  verifyAffinityWebhook,
} from "@affinity-health/sdk";
import type { Order, PreviewOrderParams } from "@affinity-health/sdk";

type ReviewedAllergies = Omit<
  Parameters<Affinity["practices"]["patients"]["allergies"]["update"]>[2],
  "reviewStatus"
> & { reviewStatus: "no_known" | "recorded" };

// Server-side only. These functions do not run on import.
// First-use NPI registration needs team:write. Test NPI: 1234567893.
// Persist mutation keys, reviewed versions, and outcomes in your EMR database.
export async function createTestWorkflow(apiKey: string) {
  const affinity = new Affinity(apiKey, { maxNetworkRetries: 2 });
  if ((await affinity.auth.access.retrieve()).livemode)
    throw new Error("This example only accepts a Test key");

  async function preparePatient(input: {
    practiceId: string;
    patientExternalId: string;
    persistedCreationKey: string;
  }) {
    // Creation resolves an existing externalId without replacing its demographics.
    // Use only synthetic identities in this Test example.
    const patient = await affinity.practices.patients.create(
      input.practiceId,
      {
        externalId: input.patientExternalId,
        name: { first: "Synthetic", last: "Patient" },
        dateOfBirth: "1990-01-01",
        email: "patient@example.test",
        phone: "2025550199",
        address: {
          line1: "100 Test St",
          city: "Austin",
          state: "TX",
          postalCode: "78701",
          country: "US" as const,
        },
      },
      { idempotencyKey: input.persistedCreationKey },
    );
    const allergies = await affinity.practices.patients.allergies.retrieve(
      input.practiceId,
      patient.id,
    );
    // Display the existing history in the EMR and collect the clinician's review.
    // An empty, not_reviewed history does not mean no known allergies.
    return { patient, allergies };
  }

  async function preview(input: {
    practiceId: string;
    patientId: string;
    clinicianNpi?: string;
    medicationId: string;
    supplyId: string;
    // Pass the full array back after edits. Explicit overrides replace defaults.
    prescriptions?: PreviewOrderParams["prescriptions"];
  }) {
    return affinity.orderPreviews.create({
      practiceId: input.practiceId,
      ...(input.clinicianNpi ? { prescriber: { npi: input.clinicianNpi } } : {}),
      patientId: input.patientId,
      prescriptions: input.prescriptions ?? [
        { medicationId: input.medicationId, preset: "default" },
      ],
      otcItems: [{ catalogItemId: input.supplyId, quantity: 1 }],
      shipping: { selection: "lowest_cost" },
    });
  }

  async function saveDraft(
    acceptedPreview: Awaited<ReturnType<typeof preview>>,
    persistedCreationKey: string,
    allergyReview: {
      // Load this explicit clinician decision from your EMR's review record.
      reviewedAllergies: ReviewedAllergies;
      persistedReviewKey: string;
    },
  ) {
    if (acceptedPreview.status !== "complete")
      return { status: "needs_input" as const, issues: acceptedPreview.issues };
    if (!acceptedPreview.orderInput) throw new Error("Complete preview is missing order input");
    const patientId =
      "patientId" in acceptedPreview.orderInput ? acceptedPreview.orderInput.patientId : undefined;
    if (!patientId) throw new Error("Prepare the patient and preview with its patientId first");
    const reviewed = allergyReview.reviewedAllergies;
    if (
      (reviewed.reviewStatus !== "no_known" && reviewed.reviewStatus !== "recorded") ||
      (reviewed.reviewStatus === "no_known" && reviewed.allergies.length !== 0) ||
      (reviewed.reviewStatus === "recorded" && reviewed.allergies.length === 0)
    )
      throw new Error("Provide an explicit allergy review with the complete reviewed history");
    await affinity.practices.patients.allergies.update(
      acceptedPreview.orderInput.practiceId,
      patientId,
      reviewed,
      { idempotencyKey: allergyReview.persistedReviewKey },
    );
    const draft = await affinity.orders.create(acceptedPreview.orderInput, {
      idempotencyKey: persistedCreationKey,
    });
    // Show this complete order to the clinician, including supplies and shipping.
    // The draft snapshots the allergy history just recorded. If history changes
    // afterward, cancel the unsigned draft and create and review a replacement.
    // Retry unchanged input with the same keys; a new review needs new keys.
    const order = await affinity.orders.retrieve(draft.id);
    return { status: "draft" as const, order };
  }

  function shippingSummary(result: Awaited<ReturnType<typeof preview>>) {
    return {
      // Never sum prescriptions[].shippingAmountCents: shared rates can repeat.
      amountCents: result.totals.shippingTotalCents,
      groups: result.shippingGroups.map((group) => ({
        pharmacy: group.pharmacy,
        service: group.label,
        temperature: group.temperature,
        amountCents: group.amountCents,
        prescriptions: group.prescriptionIndexes.map((index) => result.prescriptions[index]),
      })),
    };
  }

  async function signAndSend(approval: {
    // Load the reviewed order from your server-side review record, not browser input.
    reviewedOrder: Order;
    clinicianNpi?: string;
    attested: true;
    persistedSigningKey: string;
  }) {
    // Call only after your EMR authenticates the clinician and records their approval.
    try {
      return await affinity.orders.signAndSubmit(
        approval.reviewedOrder.id,
        {
          practiceId: approval.reviewedOrder.practiceId,
          // Omit if the reviewed draft already has the intended prescriber.
          ...(approval.clinicianNpi ? { prescriber: { npi: approval.clinicianNpi } } : {}),
          signatureAttestation: approval.attested,
          expectedVersions: approval.reviewedOrder.prescriptions.map((rx) => ({
            prescriptionId: rx.id,
            version: rx.version,
          })),
        },
        {
          idempotencyKey: approval.persistedSigningKey,
        },
      );
    } catch (cause) {
      const error =
        cause instanceof ResponseError ? await affinityErrorFromResponse(cause.response) : cause;
      if (
        error instanceof AffinityError &&
        error.statusCode === 409 &&
        error.category !== "idempotency"
      ) {
        // Reload, resolve the conflict, display the updated order, and obtain NEW
        // approval with a new key. Never attest automatically to refreshed versions.
        return {
          status: "review_required" as const,
          order: await affinity.orders.retrieve(approval.reviewedOrder.id),
        };
      }
      // After a timeout, retry with the SAME input and persisted key.
      throw error;
    }
  }

  async function retrySubmission(input: {
    orderId: string;
    practiceId: string;
    persistedRetryKey: string;
  }) {
    // Use only after resolving a reported per-prescription submission failure.
    // The order is already signed. Use a NEW submission key, not a new signature.
    // Already queued prescriptions are not duplicated. Edits require renewed review.
    return affinity.orders.submit(
      input.orderId,
      {
        practiceId: input.practiceId,
      },
      {
        idempotencyKey: input.persistedRetryKey,
      },
    );
  }

  return { preparePatient, preview, shippingSummary, saveDraft, signAndSend, retrySubmission };
}

export async function receiveWebhook(
  request: Request,
  signingSecret: string,
  expectedOrganizationId: string,
  // Implement as a durable insert/enqueue with a unique eventId constraint.
  enqueueOnce: (eventId: string, orderId: string) => Promise<void>,
) {
  const event = await verifyAffinityWebhook({
    body: await request.text(),
    signature: request.headers.get("affinity-signature"),
    secret: signingSecret,
  });
  if (event.livemode || event.organization_id !== expectedOrganizationId)
    return new Response("Wrong webhook scope", { status: 400 });
  if (event.type !== "webhook_endpoint.test") await enqueueOnce(event.id, event.data.object.id);
  // The queued job retrieves the current order and updates the EMR. This avoids
  // regressing state when webhooks arrive out of order. Acknowledge only after enqueue.
  return new Response(null, { status: 204 });
}
