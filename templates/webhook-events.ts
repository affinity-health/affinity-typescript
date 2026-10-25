export const affinityWebhookApiVersion = __AFFINITY_WEBHOOK_API_VERSION__ as const;
export const affinityWebhookEventTypes = __AFFINITY_WEBHOOK_EVENT_TYPES__ as const;
export const affinityOrderStatuses = __AFFINITY_ORDER_STATUSES__ as const;
export const affinityWebhookSignatureHeader = __AFFINITY_WEBHOOK_SIGNATURE_HEADER__ as const;

export type AffinityWebhookEventType = (typeof affinityWebhookEventTypes)[number];
export type AffinityOrderWebhookEventType = Exclude<
  AffinityWebhookEventType,
  "webhook_endpoint.test"
>;
export type AffinityOrderStatus = (typeof affinityOrderStatuses)[number];

/** Current event shapes generated from the pinned OpenAPI contract. */
export type AffinityKnownWebhookEvent = __AFFINITY_KNOWN_WEBHOOK_EVENT__;
export type AffinityMvpOrderWebhookEvent = Extract<
  AffinityKnownWebhookEvent,
  { data: { order: unknown } }
>;
export type AffinityMvpOrderWebhookObject = AffinityMvpOrderWebhookEvent["data"]["order"];
export type AffinityMvpWebhookEndpointTestEvent = Extract<
  AffinityKnownWebhookEvent,
  { type: "webhook_endpoint.test" }
>;

/** Future event types and fields need caller validation before use. */
export interface AffinityUnknownWebhookEvent {
  id: string;
  type: string;
  data: Record<string, unknown>;
  [field: string]: unknown;
}
export type AffinityWebhookEvent = AffinityKnownWebhookEvent | AffinityUnknownWebhookEvent;

/** Select current event types and envelopes. This does not verify a signature or validate data. */
export function isKnownAffinityWebhookEvent(value: unknown): value is AffinityKnownWebhookEvent {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const event = value as Record<string, unknown>;
  return (
    typeof event.id === "string" &&
    typeof event.createdAt === "string" &&
    affinityWebhookEventTypes.some((type) => type === event.type)
  );
}

export type AffinityWebhookVerificationErrorCode =
  | "invalid_body"
  | "invalid_event"
  | "invalid_secret"
  | "invalid_signature"
  | "invalid_timestamp"
  | "timestamp_outside_tolerance";

export class AffinityWebhookVerificationError extends Error {
  readonly code: AffinityWebhookVerificationErrorCode;

  constructor(code: AffinityWebhookVerificationErrorCode, message: string) {
    super(message);
    this.name = "AffinityWebhookVerificationError";
    this.code = code;
  }
}

export async function verifyAffinityWebhook(input: {
  body: ArrayBuffer | string | Uint8Array;
  now?: Date;
  secret: string | readonly string[];
  signature: string | null;
  toleranceSeconds?: number;
}): Promise<AffinityWebhookEvent> {
  const body = webhookBodyBytes(input.body);
  const signature = parseAffinityWebhookSignature(input.signature);
  const toleranceSeconds = input.toleranceSeconds ?? 300;
  if (!Number.isSafeInteger(toleranceSeconds) || toleranceSeconds < 0) {
    throw new AffinityWebhookVerificationError(
      "invalid_timestamp",
      "Webhook tolerance must be a non-negative integer",
    );
  }
  const now = Math.floor((input.now ?? new Date()).getTime() / 1_000);
  if (!Number.isSafeInteger(now)) {
    throw new AffinityWebhookVerificationError(
      "invalid_timestamp",
      "Webhook verification clock is invalid",
    );
  }
  if (Math.abs(now - signature.timestamp) > toleranceSeconds) {
    throw new AffinityWebhookVerificationError(
      "timestamp_outside_tolerance",
      "Webhook timestamp is outside the allowed tolerance",
    );
  }

  const secrets = typeof input.secret === "string" ? [input.secret] : [...input.secret];
  if (
    secrets.length === 0 ||
    secrets.some((secret) => !/^whsec_(?:live|test)_[A-Za-z0-9_-]{16,}$/u.test(secret))
  ) {
    throw new AffinityWebhookVerificationError(
      "invalid_secret",
      "Webhook signing secret is invalid",
    );
  }
  const signedBody = concatBytes(encoder.encode(`${signature.timestamp}.`), body);
  let verified = false;
  for (const secret of secrets) {
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { hash: "SHA-256", name: "HMAC" },
      false,
      ["verify"],
    );
    for (const candidate of signature.signatures) {
      if (await crypto.subtle.verify("HMAC", key, hexToBytes(candidate), signedBody)) {
        verified = true;
      }
    }
  }
  if (!verified) {
    throw new AffinityWebhookVerificationError("invalid_signature", "Webhook signature is invalid");
  }

  let value: unknown;
  try {
    value = JSON.parse(decoder.decode(body));
  } catch {
    throw new AffinityWebhookVerificationError("invalid_body", "Webhook body is not valid JSON");
  }
  // Authenticity and freshness do not depend on an event schema.
  return value as AffinityWebhookEvent;
}

/** Parse an unsigned envelope only. This does not verify authenticity or validate event data. */
export function parseAffinityWebhookEvent(value: unknown): AffinityWebhookEvent {
  if (typeof value !== "object" || value === null || Array.isArray(value))
    throw new AffinityWebhookVerificationError("invalid_event", "Webhook event must be an object");
  const event = value as Record<string, unknown>;
  if (
    typeof event.id !== "string" ||
    typeof event.type !== "string" ||
    typeof event.data !== "object" ||
    event.data === null ||
    Array.isArray(event.data)
  )
    throw new AffinityWebhookVerificationError(
      "invalid_event",
      "Webhook event must have id, type and data",
    );
  return value as AffinityWebhookEvent;
}

export function parseAffinityWebhookSignature(value: string | null) {
  const parts = (value ?? "").split(",").map((part) => part.trim());
  const timestampValue = parts.find((part) => part.startsWith("t="))?.slice(2);
  if (!timestampValue || !/^\d{10}$/u.test(timestampValue)) {
    throw new AffinityWebhookVerificationError("invalid_timestamp", "Webhook timestamp is invalid");
  }
  const timestamp = Number(timestampValue);
  if (!Number.isSafeInteger(timestamp) || timestamp < 0) {
    throw new AffinityWebhookVerificationError("invalid_timestamp", "Webhook timestamp is invalid");
  }
  const candidates = parts.filter((part) => part.startsWith("v1=")).map((part) => part.slice(3));
  if (candidates.length === 0) {
    throw new AffinityWebhookVerificationError("invalid_signature", "Webhook signature is missing");
  }
  const signatures = candidates
    .map((part) => part.toLowerCase())
    .filter((part) => /^[a-f0-9]{64}$/u.test(part));
  if (signatures.length === 0) {
    throw new AffinityWebhookVerificationError(
      "invalid_signature",
      "Webhook signature is malformed",
    );
  }
  return { signatures, timestamp };
}

function webhookBodyBytes(value: ArrayBuffer | string | Uint8Array) {
  if (typeof value === "string") return encoder.encode(value);
  if (value instanceof Uint8Array) {
    return new Uint8Array(value);
  }
  if (value instanceof ArrayBuffer) return new Uint8Array(value.slice(0));
  throw new AffinityWebhookVerificationError(
    "invalid_body",
    "Webhook body must be the exact raw request bytes",
  );
}

function concatBytes(left: Uint8Array, right: Uint8Array) {
  const value = new Uint8Array(left.byteLength + right.byteLength);
  value.set(left);
  value.set(right, left.byteLength);
  return value;
}

function hexToBytes(value: string) {
  return Uint8Array.from(value.match(/.{2}/gu) ?? [], (byte) => Number.parseInt(byte, 16));
}

const encoder = new TextEncoder();
const decoder = new TextDecoder();
