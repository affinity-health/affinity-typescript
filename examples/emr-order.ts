import {
  AffinityClient,
  isKnownAffinityWebhookEvent,
  verifyAffinityWebhook,
} from "@affinity-health/sdk";
import type { Affinity } from "@affinity-health/sdk";

// Server-side only. No requests run on import. Use synthetic identities in Test.
// Store the exact reviewed input and creation key in your EMR database before calling.
export async function createTestWorkflow(token: string) {
  const affinity = new AffinityClient({ token });
  const account = await affinity.account.get();
  if (account.mode !== "test") throw new Error("This example only accepts a Test key");

  async function sendReviewedOrder(approval: {
    // Load from the authenticated clinician's durable review record, not browser input.
    reviewedInput: Omit<Affinity.OrderInput, "idempotencyKey">;
    persistedCreationKey: string;
    attested: true;
  }) {
    if (approval.attested !== true || approval.reviewedInput.signatureAttestation !== true)
      throw new Error("An explicit clinician attestation is required");
    // Patient demographics and reviewed allergies are part of reviewedInput.patient.
    // One request creates, signs, and submits. Retry unchanged input with the SAME key; the
    // client's own retries (2 by default) reuse it too.
    return affinity.orders.create({
      ...approval.reviewedInput,
      idempotencyKey: approval.persistedCreationKey,
    });
  }

  return {
    sendReviewedOrder,
    getOrder: (orderId: string) => affinity.orders.get({ orderId }),
    // Save the cancel key too, so a retried cancel is the same request.
    cancelOrder: (orderId: string, cancelKey: string) =>
      affinity.orders.cancel({ orderId, idempotencyKey: cancelKey }),
  };
}

export async function receiveWebhook(
  request: Request,
  signingSecret: string,
  // Implement a durable insert/enqueue with a unique eventId constraint.
  enqueueOnce: (eventId: string, orderId: string) => Promise<void>,
) {
  if (!signingSecret.startsWith("whsec_test_"))
    throw new Error("This receiver requires a Test endpoint signing secret");
  const event = await verifyAffinityWebhook({
    body: await request.text(),
    signature: request.headers.get("affinity-signature"),
    secret: signingSecret,
  });
  // Configure this receiver with the signing secret of a Test endpoint only.
  // MVP events have no organization or mode field. The endpoint's secret binds scope;
  // the queued worker must use the matching Test key when retrieving the order.
  // Dispatch only known order event types. Ignore unknown types after signature
  // verification and answer 2xx. Do not catch-and-hide failures for known events.
  if (!isKnownAffinityWebhookEvent(event)) return new Response(null, { status: 204 });
  switch (event.type) {
    case "order.cancelled":
    case "order.delivered":
    case "order.failed":
    case "order.processing":
    case "order.shipped":
    case "order.submitted":
    case "order.updated":
      await enqueueOnce(event.id, event.data.order.id);
      break;
    default:
      break;
  }
  // The queued job retrieves the current order so older events cannot regress EMR state.
  // Acknowledge only after durable enqueue. Never log the clinical payload.
  return new Response(null, { status: 204 });
}
