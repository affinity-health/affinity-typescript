import { Affinity, AffinityError, verifyAffinityWebhook } from "@affinity-health/sdk";
import type { Order, PreviewOrderParams } from "@affinity-health/sdk";

// Server-side only. These functions do not run on import.
// First-use NPI registration needs team:write. Test NPI: 1234567893.
// Persist mutation keys, reviewed versions, and outcomes in your EMR database.
export async function createTestWorkflow(apiKey: string) {
  const affinity = new Affinity(apiKey, { maxNetworkRetries: 2 });
  if ((await affinity.apiKeys.retrieve()).livemode)
    throw new Error("This example only accepts a Test key");

  async function preview(input: {
    practiceId: string;
    clinicianNpi?: string;
    medicationId: string;
    supplyId: string;
    // Pass the full array back after edits. Explicit overrides replace defaults.
    prescriptions?: PreviewOrderParams["prescriptions"];
    existingPatientExternalId?: string;
  }) {
    const patient = input.existingPatientExternalId
      ? { patientExternalId: input.existingPatientExternalId }
      : {
          patient: {
            externalId: "synthetic-emr-patient-123",
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
        };
    return affinity.orders.preview({
      practiceId: input.practiceId,
      ...(input.clinicianNpi ? { prescriber: { npi: input.clinicianNpi } } : {}),
      ...patient,
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
  ) {
    if (acceptedPreview.status !== "complete")
      return { status: "needs_input" as const, issues: acceptedPreview.issues };
    const draft = await affinity.orders.create(acceptedPreview.orderInput, {
      idempotencyKey: persistedCreationKey,
    });
    // Show this complete order to the clinician, including supplies and shipping.
    // Complete actual allergy review through patients.replaceAllergies before signing.
    // A new patient's missing history must not be converted to "no known allergies".
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
    } catch (error) {
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

  return { preview, shippingSummary, saveDraft, signAndSend, retrySubmission };
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
