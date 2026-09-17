import type { InitOverrideFunction } from "../runtime";

export type AffinityActorType = "system" | "user";
export type AffinityActor = { id?: string; type: "system" } | { id: string; type: "user" };
export interface RequestOptions {
  idempotencyKey?: string;
  actor?: AffinityActor;
  apiVersion?: string;
  headers?: Record<string, string>;
  organizationId?: string;
  signal?: AbortSignal;
}
export interface MutationOptions extends RequestOptions {
  idempotencyKey?: string;
}

export function validateNonEmptyOption(value: string, name: string): string {
  if (typeof value !== "string" || !value.trim() || /[\r\n\0]/.test(value)) {
    throw new Error(`Affinity ${name} must be a non-empty header value`);
  }
  return value;
}

export function validateAffinityActor(actor: AffinityActor): AffinityActor {
  if (!actor || (actor.type !== "user" && actor.type !== "system"))
    throw new Error("Affinity actor type must be user or system");
  if (actor.type === "system" && actor.id === undefined) return actor;
  if (typeof actor.id !== "string")
    throw new Error("Affinity user actor ID must contain 1 to 200 characters");
  const id = actor.id.trim();
  if (!id || id.length > 200 || /[\x00-\x1f\x7f]/.test(id))
    throw new Error(
      "Affinity actor ID must contain 1 to 200 characters without control characters",
    );
  return { id, type: actor.type };
}

const reservedHeaders = new Set([
  "authorization",
  "x-affinity-api-key",
  "content-type",
  "affinity-version",
  "affinity-actor-id",
  "affinity-actor-type",
  "idempotency-key",
  "x-affinity-organization-id",
]);

/** Transport identity and attribution must use the typed options, not custom headers. */
export function validateCustomHeaders(headers?: Record<string, string>): Record<string, string> {
  const normalized = new Headers();
  for (const [name, value] of Object.entries(headers ?? {})) {
    if (reservedHeaders.has(name.toLowerCase()))
      throw new Error(`Use typed Affinity options instead of the reserved ${name} header`);
    normalized.set(name, value);
  }
  return Object.fromEntries(normalized.entries());
}

export function requestOverrides(options?: RequestOptions): InitOverrideFunction {
  const custom = validateCustomHeaders(options?.headers);
  const actor = options?.actor === undefined ? undefined : validateAffinityActor(options.actor);
  const version =
    options?.apiVersion === undefined
      ? undefined
      : validateNonEmptyOption(options.apiVersion, "apiVersion");
  const organization =
    options?.organizationId === undefined
      ? undefined
      : validateNonEmptyOption(options.organizationId, "organizationId");
  return async ({ init }) => {
    const headers = new Headers(init.headers);
    for (const [name, value] of Object.entries(custom)) headers.set(name, value);
    if (options?.idempotencyKey !== undefined)
      headers.set(
        "Idempotency-Key",
        validateNonEmptyOption(options.idempotencyKey, "idempotencyKey"),
      );
    if (version !== undefined) headers.set("Affinity-Version", version);
    if (organization !== undefined) headers.set("X-Affinity-Organization-Id", organization);
    if (actor) {
      if (actor.id !== undefined) headers.set("Affinity-Actor-Id", actor.id);
      else headers.delete("Affinity-Actor-Id");
      headers.set("Affinity-Actor-Type", actor.type);
    }
    return { ...init, headers, ...(options?.signal ? { signal: options.signal } : {}) };
  };
}
export function commonHeaders(options?: RequestOptions) {
  return options?.apiVersion === undefined
    ? {}
    : { affinityVersion: validateNonEmptyOption(options.apiVersion, "apiVersion") };
}
export function actorHeaders(
  options: RequestOptions | undefined,
  defaultActor: AffinityActor | undefined,
) {
  const actor = options?.actor ?? defaultActor ?? ({ type: "system" } as const);
  const validated = validateAffinityActor(actor);
  return {
    ...(validated.id === undefined ? {} : { affinityActorId: validated.id }),
    affinityActorType: validated.type,
  };
}
export function organizationHeader(options?: RequestOptions) {
  return options?.organizationId === undefined
    ? {}
    : { xAffinityOrganizationId: validateNonEmptyOption(options.organizationId, "organizationId") };
}
export function requiredIdempotencyKey(options: MutationOptions | undefined) {
  if (options?.idempotencyKey === undefined) return crypto.randomUUID();
  return validateNonEmptyOption(options.idempotencyKey, "idempotencyKey");
}
