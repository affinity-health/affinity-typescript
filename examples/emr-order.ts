import { Affinity, verifyAffinityWebhook, type OrderCreateParams } from "@affinity-health/sdk";

// Server-side only. Call after authenticating the clinician and saving their
// approval of these exact values and a durable idempotency key in your database.
export async function submitReviewedTestOrder(
  api: Affinity,
  reviewed: OrderCreateParams,
  persistedKey: string,
) {
  if ((await api.account.get()).mode !== "test") throw new Error("Use a Test API key");
  return api.orders.create(reviewed, { idempotencyKey: persistedKey });
}

// The endpoint secret selects the organization and mode. The MVP payload carries
// neither scope field. Store the expected scope beside the endpoint's secret.
export async function receiveWebhook(
  request: Request,
  signingSecret: string,
  enqueueOnce: (eventId: string, orderId: string) => Promise<void>,
) {
  const event = await verifyAffinityWebhook({
    body: await request.arrayBuffer(),
    secret: signingSecret,
    signature: request.headers.get("affinity-signature"),
  });
  if (event.data.order) await enqueueOnce(event.id, event.data.order.id);
  // Acknowledge only after durable deduplication/enqueue. The job reads the current
  // order or compares updatedAt to avoid applying out-of-order events backwards.
  return new Response(null, { status: 204 });
}
