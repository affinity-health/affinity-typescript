// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.

export const affinityWebhookApiVersion = "2026-10-20" as const;
export const affinityOrderStatuses = [
  "draft",
  "submitted",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "failed",
] as const;
export const affinityWebhookEventTypes = [
  "order.cancelled",
  "order.delivered",
  "order.failed",
  "order.processing",
  "order.shipped",
  "order.submitted",
  "order.updated",
  "webhook_endpoint.test",
] as const;
export const affinityWebhookSignatureHeader = "affinity-signature" as const;
export type AffinityWebhookEventType = (typeof affinityWebhookEventTypes)[number];
export type AffinityOrderWebhookEventType = Exclude<
  AffinityWebhookEventType,
  "webhook_endpoint.test"
>;
export type AffinityOrderStatus = (typeof affinityOrderStatuses)[number];
export type AffinityPublicId<Prefix extends string> = `${Prefix}_${string}`;
export type AffinityOrganizationId =
  | AffinityPublicId<"plat">
  | AffinityPublicId<"prac">
  | AffinityPublicId<"pharm">;
export type AffinityOrderWebhookObject = {
  cancelRequestedAt: string | null;
  externalOrderId: string | null;
  failureReason: string | null;
  id: string;
  shipments: Array<{
    carrier: string | null;
    trackingNumber: string;
    trackingUrl: string | null;
    [key: string]: unknown;
  }>;
  status:
    | ("draft" | "submitted" | "processing" | "shipped" | "delivered" | "cancelled" | "failed")
    | string;
  updatedAt: string;
  [key: string]: unknown;
};
/** Unknown event types and additive fields are retained for forward compatibility. */
export interface AffinityWebhookEvent {
  id: AffinityPublicId<"evt">;
  type: AffinityWebhookEventType | (string & {});
  createdAt: string;
  data: { order?: AffinityOrderWebhookObject; [key: string]: unknown };
}
export interface AffinityOrderWebhookEvent extends AffinityWebhookEvent {
  type: AffinityOrderWebhookEventType;
  data: { order: AffinityOrderWebhookObject; [key: string]: unknown };
}
export interface AffinityWebhookEndpointTestEvent extends AffinityWebhookEvent {
  type: "webhook_endpoint.test";
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
  const clock = (input.now ?? new Date()).getTime();
  if (!Number.isFinite(clock)) {
    throw new AffinityWebhookVerificationError(
      "invalid_timestamp",
      "Webhook verification clock is invalid",
    );
  }
  const now = Math.floor(clock / 1_000);
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
  return parseAffinityWebhookEvent(value);
}

export function parseAffinityWebhookEvent(value: unknown): AffinityWebhookEvent {
  try {
    const event = requireRecord(value, "event");
    requireFields(event, ["id", "type", "createdAt", "data"]);
    requirePublicId(event.id, "evt");
    if (typeof event.type !== "string" || !event.type) throw new Error("type is invalid");
    requireDateTime(event.createdAt, "createdAt");
    const data = requireRecord(event.data, "data");
    const knownOrderEvent =
      affinityWebhookEventTypes.includes(event.type as AffinityWebhookEventType) &&
      event.type !== "webhook_endpoint.test";
    if (knownOrderEvent || data.order !== undefined) {
      const order = requireRecord(data.order, "data.order");
      requireFields(order, [
        "id",
        "externalOrderId",
        "status",
        "failureReason",
        "cancelRequestedAt",
        "shipments",
        "updatedAt",
      ]);
      requirePublicId(order.id, "ord");
      if (typeof order.status !== "string" || !order.status) throw new Error("status is invalid");
      requireOptionalNullableString(order, "externalOrderId");
      requireOptionalNullableString(order, "failureReason");
      if (order.cancelRequestedAt !== null)
        requireDateTime(order.cancelRequestedAt, "cancelRequestedAt");
      requireDateTime(order.updatedAt, "updatedAt");
      if (!Array.isArray(order.shipments)) throw new Error("shipments is invalid");
      for (const value of order.shipments) {
        const shipment = requireRecord(value, "shipment");
        requireFields(shipment, ["carrier", "trackingNumber", "trackingUrl"]);
        requireOptionalNullableString(shipment, "carrier");
        requireOptionalNullableString(shipment, "trackingUrl");
        if (typeof shipment.trackingNumber !== "string")
          throw new Error("trackingNumber is invalid");
      }
    }
    return value as AffinityWebhookEvent;
  } catch (error) {
    if (error instanceof AffinityWebhookVerificationError) throw error;
    throw new AffinityWebhookVerificationError(
      "invalid_event",
      error instanceof Error
        ? `Webhook event is invalid: ${error.message}`
        : "Webhook event is invalid",
    );
  }
}

function requireDateTime(value: unknown, name: string) {
  if (typeof value !== "string" || !Number.isFinite(Date.parse(value)))
    throw new Error(`${name} is invalid`);
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

function requireRecord(value: unknown, name: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`${name} must be an object`);
  }
  return value as Record<string, unknown>;
}

function requireFields(
  value: Record<string, unknown>,
  allowed: readonly string[],
  optional: readonly string[] = [],
) {
  // Signed payloads may gain fields within the same API version. Validate the known
  // contract without rejecting additive fields or changing the verified raw body.
  const optionalSet = new Set(optional);
  for (const key of allowed) {
    if (!optionalSet.has(key) && !(key in value)) throw new Error(`missing field ${key}`);
  }
}

function requirePublicId(value: unknown, prefix: string) {
  if (
    typeof value !== "string" ||
    !new RegExp(`^${prefix}_[0-7][0-9a-hjkmnp-tv-z]{25}$`, "u").test(value)
  ) {
    throw new Error(`${prefix}_ ID is invalid`);
  }
}

function requireOptionalNullableString(value: Record<string, unknown>, key: string) {
  const field = value[key];
  if (field !== undefined && field !== null && typeof field !== "string") {
    throw new Error(`${key} is invalid`);
  }
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
