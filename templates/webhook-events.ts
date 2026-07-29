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
export type AffinityPublicId<Prefix extends string> = `${Prefix}_${string}`;
export type AffinityOrganizationId =
  | AffinityPublicId<"acct">
  | AffinityPublicId<"pharm">
  | AffinityPublicId<"prac">;

export interface AffinityThinOrderWebhookObject {
  id: AffinityPublicId<"ord">;
  object: "order";
}

export interface AffinityOrderWebhookObject extends AffinityThinOrderWebhookObject {
  carrier?: string | null;
  delivered_at?: string | null;
  external_order_id?: string | null;
  practice_id?: AffinityPublicId<"prac"> | null;
  shipped_at?: string | null;
  status?: AffinityOrderStatus;
  tracking_number?: string | null;
  updated_at?: string;
}

export type AffinityOrderWebhookPreviousAttributes = Partial<
  Omit<AffinityOrderWebhookObject, "id" | "object">
>;

export interface AffinityWebhookEndpointObject {
  id: AffinityPublicId<"whe">;
  object: "webhook_endpoint";
}

interface AffinityWebhookEventBase<TType extends AffinityWebhookEventType> {
  api_version: typeof affinityWebhookApiVersion;
  created: number;
  id: AffinityPublicId<"evt">;
  livemode: boolean;
  object: "event";
  organization_id: AffinityOrganizationId;
  request_id: AffinityPublicId<"req"> | null;
  type: TType;
}

export interface AffinityWebhookEndpointTestEvent extends AffinityWebhookEventBase<"webhook_endpoint.test"> {
  data: {
    object: AffinityWebhookEndpointObject;
  };
}

export interface AffinityOrderWebhookEvent<
  TType extends AffinityOrderWebhookEventType = AffinityOrderWebhookEventType,
> extends AffinityWebhookEventBase<TType> {
  data: {
    object: AffinityOrderWebhookObject;
    previous_attributes?: AffinityOrderWebhookPreviousAttributes;
  };
}

export type AffinityOrderCreatedWebhookEvent = AffinityOrderWebhookEvent<"order.created">;
export type AffinityOrderUpdatedWebhookEvent = AffinityOrderWebhookEvent<"order.updated">;
export type AffinityOrderSubmittedWebhookEvent = AffinityOrderWebhookEvent<"order.submitted">;
export type AffinityOrderAcceptedWebhookEvent = AffinityOrderWebhookEvent<"order.accepted">;
export type AffinityOrderProcessingWebhookEvent = AffinityOrderWebhookEvent<"order.processing">;
export type AffinityOrderShippedWebhookEvent = AffinityOrderWebhookEvent<"order.shipped">;
export type AffinityOrderDeliveredWebhookEvent = AffinityOrderWebhookEvent<"order.delivered">;
export type AffinityOrderBlockedWebhookEvent = AffinityOrderWebhookEvent<"order.blocked">;
export type AffinityOrderCancelledWebhookEvent = AffinityOrderWebhookEvent<"order.cancelled">;

export type AffinityWebhookEvent =
  | AffinityWebhookEndpointTestEvent
  | AffinityOrderCreatedWebhookEvent
  | AffinityOrderUpdatedWebhookEvent
  | AffinityOrderSubmittedWebhookEvent
  | AffinityOrderAcceptedWebhookEvent
  | AffinityOrderProcessingWebhookEvent
  | AffinityOrderShippedWebhookEvent
  | AffinityOrderDeliveredWebhookEvent
  | AffinityOrderBlockedWebhookEvent
  | AffinityOrderCancelledWebhookEvent;

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
    requireExactKeys(event, [
      "api_version",
      "created",
      "data",
      "id",
      "livemode",
      "object",
      "organization_id",
      "request_id",
      "type",
    ]);
    if (event.api_version !== affinityWebhookApiVersion) {
      throw new Error("api_version is unsupported");
    }
    if (
      typeof event.created !== "number" ||
      !Number.isSafeInteger(event.created) ||
      event.created < 0
    ) {
      throw new Error("created is invalid");
    }
    requirePublicId(event.id, "evt");
    if (typeof event.livemode !== "boolean") throw new Error("livemode is invalid");
    if (event.object !== "event") throw new Error("object is invalid");
    requireOrganizationId(event.organization_id);
    if (event.request_id !== null) requirePublicId(event.request_id, "req");
    if (
      typeof event.type !== "string" ||
      !affinityWebhookEventTypes.includes(event.type as AffinityWebhookEventType)
    ) {
      throw new Error("type is invalid");
    }
    const data = requireRecord(event.data, "data");
    if (event.type === "webhook_endpoint.test") {
      requireExactKeys(data, ["object"]);
      parseWebhookEndpointObject(data.object);
    } else {
      requireExactKeys(data, ["object", "previous_attributes"], ["previous_attributes"]);
      parseOrderObject(data.object, false);
      if (data.previous_attributes !== undefined) {
        parseOrderObject(data.previous_attributes, true);
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
  const signatures = parts
    .filter((part) => part.startsWith("v1="))
    .map((part) => part.slice(3))
    .filter((part) => /^[a-f0-9]{64}$/u.test(part));
  if (signatures.length === 0) {
    throw new AffinityWebhookVerificationError("invalid_signature", "Webhook signature is missing");
  }
  return { signatures, timestamp };
}

function parseWebhookEndpointObject(value: unknown) {
  const object = requireRecord(value, "data.object");
  requireExactKeys(object, ["id", "object"]);
  requirePublicId(object.id, "whe");
  if (object.object !== "webhook_endpoint") {
    throw new Error("data.object.object is invalid");
  }
}

function parseOrderObject(value: unknown, previousAttributes: boolean) {
  const object = requireRecord(
    value,
    previousAttributes ? "data.previous_attributes" : "data.object",
  );
  const snapshotKeys = [
    "carrier",
    "delivered_at",
    "external_order_id",
    "practice_id",
    "shipped_at",
    "status",
    "tracking_number",
    "updated_at",
  ];
  requireExactKeys(
    object,
    previousAttributes ? snapshotKeys : ["id", "object", ...snapshotKeys],
    snapshotKeys,
  );
  if (!previousAttributes) {
    requirePublicId(object.id, "ord");
    if (object.object !== "order") throw new Error("data.object.object is invalid");
  }
  requireOptionalNullableString(object, "carrier");
  requireOptionalDateTime(object, "delivered_at", true);
  requireOptionalNullableString(object, "external_order_id");
  if (object.practice_id !== undefined && object.practice_id !== null) {
    requirePublicId(object.practice_id, "prac");
  }
  requireOptionalDateTime(object, "shipped_at", true);
  if (
    object.status !== undefined &&
    (typeof object.status !== "string" ||
      !affinityOrderStatuses.includes(object.status as AffinityOrderStatus))
  ) {
    throw new Error("order status is invalid");
  }
  requireOptionalNullableString(object, "tracking_number");
  requireOptionalDateTime(object, "updated_at", false);
}

function requireRecord(value: unknown, name: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`${name} must be an object`);
  }
  return value as Record<string, unknown>;
}

function requireExactKeys(
  value: Record<string, unknown>,
  allowed: readonly string[],
  optional: readonly string[] = [],
) {
  const allowedSet = new Set(allowed);
  for (const key of Object.keys(value)) {
    if (!allowedSet.has(key)) throw new Error(`unexpected field ${key}`);
  }
  const optionalSet = new Set(optional);
  for (const key of allowed) {
    if (!optionalSet.has(key) && !(key in value)) throw new Error(`missing field ${key}`);
  }
}

function requirePublicId(value: unknown, prefix: string) {
  if (
    typeof value !== "string" ||
    !new RegExp(`^${prefix}_[0-9a-hjkmnp-tv-z]{26}$`, "u").test(value)
  ) {
    throw new Error(`${prefix}_ ID is invalid`);
  }
}

function requireOrganizationId(value: unknown) {
  if (typeof value !== "string" || !/^(?:acct|pharm|prac)_[0-9a-hjkmnp-tv-z]{26}$/u.test(value)) {
    throw new Error("organization_id is invalid");
  }
}

function requireOptionalNullableString(value: Record<string, unknown>, key: string) {
  const field = value[key];
  if (field !== undefined && field !== null && typeof field !== "string") {
    throw new Error(`${key} is invalid`);
  }
}

function requireOptionalDateTime(value: Record<string, unknown>, key: string, nullable: boolean) {
  const field = value[key];
  if (field === undefined || (nullable && field === null)) return;
  if (typeof field !== "string" || Number.isNaN(Date.parse(field))) {
    throw new Error(`${key} is invalid`);
  }
}

function webhookBodyBytes(value: ArrayBuffer | string | Uint8Array) {
  if (typeof value === "string") return encoder.encode(value);
  if (value instanceof Uint8Array) {
    return new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
  }
  if (value instanceof ArrayBuffer) return new Uint8Array(value);
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
