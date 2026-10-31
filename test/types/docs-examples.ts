// Compiled by `bun run test:types`, never run. Each @ts-expect-error is a mistake the SDK's types
// must refuse; the rest is what the README and guide show.
import {
  Affinity,
  AffinityClient,
  AffinityError,
  AffinityWebhookVerificationError,
  isKnownAffinityWebhookEvent,
  verifyAffinityWebhook,
  type AffinityUnknownWebhookEvent,
} from "../../src";

declare const process: { env: Record<string, string | undefined> };
declare const saveEventOnce: (eventId: string, orderId: string) => Promise<void>;
declare const order: Affinity.OrderInput;

const client = new AffinityClient({ token: process.env.AFFINITY_API_KEY! });

export async function examples() {
  const account: Affinity.Account = await client.account.get();
  const created: Affinity.Order = await client.orders.create(order);
  const page: Affinity.OrderList = (await client.orders.list({ status: "shipped", limit: 25 }))
    .response;
  for await (const each of await client.orders.list({
    practiceId: "prac_01j2y8m6jcc9tt24af5pw9x1bc",
  })) {
    const status: "submitted" | "processing" | "shipped" | "delivered" | "cancelled" | "failed" =
      each.status;
    void status;
  }
  const medication: Affinity.Medication = await client.medications.get({
    medicationId: "med_01j2y8m6jcc9tt24af5pw9x1bc",
  });
  const reasons: string[] = medication.compoundingReasons;
  const requirements: string[] = medication.requirements;
  try {
    await client.orders.cancel({ orderId: created.id, idempotencyKey: "cancel-saved-key" });
  } catch (error) {
    if (error instanceof Affinity.UnprocessableEntityError) {
      const fields: string[] = (error.body.issues ?? []).map((issue) => issue.field);
      void fields;
    }
    if (error instanceof AffinityError) void [error.statusCode, error.requestId, error.body];
  }
  void [account, page, reasons, requirements];
}

export function mistakes() {
  const { idempotencyKey: _, ...withoutKey } = order;
  // @ts-expect-error An order needs the idempotency key saved with it.
  void client.orders.create(withoutKey);
  // @ts-expect-error Every write needs a key, cancel included.
  void client.orders.cancel({ orderId: "ord_01j2y8m6jcc9tt24af5pw9x1bc" });
  // @ts-expect-error Draft is not a public order status.
  void client.orders.list({ status: "draft" });
  // @ts-expect-error Unknown query parameters fail compilation.
  void client.orders.list({ externalOrderID: "emr-42" });
  // @ts-expect-error A practice needs an address and a phone.
  void client.practices.create({ idempotencyKey: "k", name: "Synthetic Test Practice" });
  void client.webhooks.remove({
    webhookEndpointId: "whe_01j2y8m6jcc9tt24af5pw9x1bc",
    // @ts-expect-error DELETE takes no idempotency key.
    idempotencyKey: "k",
  });
}

// The guide's webhook handler, with a guard for event types this SDK does not know yet.
export async function POST(request: Request) {
  let event;
  try {
    event = await verifyAffinityWebhook({
      body: await request.text(),
      signature: request.headers.get("affinity-signature"),
      secret: process.env.AFFINITY_WEBHOOK_SECRET!,
    });
  } catch (error) {
    if (error instanceof AffinityWebhookVerificationError)
      return new Response(null, { status: 400 });
    throw error;
  }
  if (!isKnownAffinityWebhookEvent(event)) {
    const unknown: AffinityUnknownWebhookEvent = event;
    void unknown;
    return new Response(null, { status: 204 });
  }
  switch (event.type) {
    case "order.shipped":
    case "order.delivered":
    case "order.cancelled":
    case "order.failed":
    case "order.processing":
    case "order.submitted":
    case "order.updated":
      await saveEventOnce(event.id, event.data.order.id);
      break;
    case "prescription.cancelled":
    case "prescription.failed":
    case "webhook_endpoint.test":
      break;
    default: {
      const never: never = event;
      void never;
    }
  }
  return new Response(null, { status: 204 });
}
