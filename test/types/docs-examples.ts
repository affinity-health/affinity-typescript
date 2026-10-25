import {
  Affinity,
  AffinityWebhookVerificationError,
  isKnownAffinityWebhookEvent,
  verifyAffinityWebhook,
  type AffinityUnknownWebhookEvent,
  type OrderCreateParams,
  type OrderCreateResponse,
  type OrderGetResponse,
  type OrderListResponse,
  type OrderCancelResponse,
} from "../../src";

// The SDK guide promises a generated per-call key when options are omitted.
const api = new Affinity("synthetic-test-key");
declare const input: OrderCreateParams;
void api.orders.create(input);
void api.orders.create(input, {});
void api.orders.create(input, { idempotencyKey: "persisted-test-order" });

declare const process: { env: Record<string, string | undefined> };
declare const saveEventOnce: (eventId: string, orderId: string) => Promise<void>;

// The docs' webhook handler, with an explicit guard for future event types.
export async function POST(request: Request) {
  let event;
  try {
    event = await verifyAffinityWebhook({
      body: await request.text(),
      signature: request.headers.get("affinity-signature"),
      secret: process.env.AFFINITY_WEBHOOK_SECRET!,
    });
  } catch (error) {
    if (error instanceof AffinityWebhookVerificationError) {
      return new Response("Invalid signature", { status: 400 });
    }
    throw error;
  }

  if (isKnownAffinityWebhookEvent(event)) {
    switch (event.type) {
      case "order.submitted":
      case "order.processing":
      case "order.shipped":
      case "order.delivered":
      case "order.cancelled":
      case "order.failed":
      case "order.updated":
        await saveEventOnce(event.id, event.data.order.id);
    }
  }
  return new Response(null, { status: 204 });
}

// The API exposes cancelRequestedAt, never the old requester object.
declare const orders: [
  OrderCreateResponse,
  OrderGetResponse,
  OrderListResponse["data"][number],
  OrderCancelResponse,
];
type PhantomCancellation =
  | { requestedAt: string; requestedBy: { name: string } }
  | null
  | undefined;
for (const order of orders) {
  const pending: string | null = order.cancelRequestedAt;
  // @ts-expect-error No typed cancellation object exists in a public response.
  const phantom: PhantomCancellation = order.cancellation;
  void pending;
  void phantom;
}

// A future event remains available without claiming its data follows today's contract.
declare const future: AffinityUnknownWebhookEvent;
const futureType: string = future.type;
// @ts-expect-error Unknown event data needs validation before use.
const futureOrderId: string = future.data.order.id;
void futureType;
void futureOrderId;
