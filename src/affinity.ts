// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.

import { Configuration, FetchError, ResponseError, type FetchAPI } from "./runtime";
import { RawClient } from "./raw";
import {
  AccountResource,
  APIKeysResource,
  CatalogResource,
  LocationsResource,
  OrdersResource,
  PatientsResource,
  PlatformPricingResource,
  PracticesResource,
  SessionsResource,
  TeamResource,
  WebhooksResource,
} from "./resources";
import {
  type AffinityActor,
  type RequestOptions,
  validateAffinityActor,
  validateCustomHeaders,
  validateNonEmptyOption,
} from "./resources/shared";

export interface AffinityOptions {
  actor?: AffinityActor;
  apiVersion?: string;
  baseUrl?: string;
  fetch?: FetchAPI;
  headers?: Record<string, string>;
  organizationId?: string;
}

export type RawRequestParams = Record<string, unknown>;

export interface RawRequestOptions extends RequestOptions {
  idempotencyKey?: string;
}

export class Affinity {
  readonly account: AccountResource;
  readonly apiKeys: APIKeysResource;
  readonly catalog: CatalogResource;
  readonly locations: LocationsResource;
  readonly orders: OrdersResource;
  readonly patients: PatientsResource;
  readonly platformPricing: PlatformPricingResource;
  readonly practices: PracticesResource;
  readonly sessions: SessionsResource;
  readonly team: TeamResource;
  readonly webhooks: WebhooksResource;
  private readonly apiKey: string;
  private readonly options: AffinityOptions;

  constructor(apiKey: string, options: AffinityOptions = {}) {
    if (typeof apiKey !== "string" || !apiKey.trim())
      throw new Error("Affinity requires a service API key");
    const actor = options.actor === undefined ? undefined : validateAffinityActor(options.actor);
    const headers = validateCustomHeaders(options.headers);
    const version =
      options.apiVersion !== undefined
        ? validateNonEmptyOption(options.apiVersion, "apiVersion")
        : "2026-08-11";
    const organizationId =
      options.organizationId !== undefined
        ? validateNonEmptyOption(options.organizationId, "organizationId")
        : undefined;
    this.apiKey = apiKey;
    const basePath = (options.baseUrl ?? "https://api.joinaffinityai.com").replace(/\/+$/, "");
    this.options = {
      ...options,
      baseUrl: basePath,
      headers,
      apiVersion: version,
      ...(actor ? { actor } : {}),
      ...(organizationId ? { organizationId } : {}),
    };
    const configuration = new Configuration({
      accessToken: apiKey,
      basePath,
      fetchApi: options.fetch,
      headers: {
        ...headers,
        "Affinity-Version": version,
        ...(actor ? { "Affinity-Actor-Id": actor.id, "Affinity-Actor-Type": actor.type } : {}),
        ...(organizationId ? { "X-Affinity-Organization-Id": organizationId } : {}),
      },
    });
    const raw = new RawClient(configuration);
    this.account = new AccountResource(raw.account);
    this.apiKeys = new APIKeysResource(raw.apiKeys);
    this.catalog = new CatalogResource(raw.catalog);
    this.locations = new LocationsResource(raw.locations);
    this.orders = new OrdersResource(raw.orders, actor);
    this.patients = new PatientsResource(raw.patients, actor);
    this.platformPricing = new PlatformPricingResource(raw.platformPricing);
    this.practices = new PracticesResource(raw.practices);
    this.sessions = new SessionsResource(raw.sessions);
    this.team = new TeamResource(raw.team);
    this.webhooks = new WebhooksResource(raw.webhooks);
  }

  withActor(actor: AffinityActor): Affinity {
    return new Affinity(this.apiKey, { ...this.options, actor });
  }

  async rawRequest<T = unknown>(
    method: string,
    path: string,
    params?: RawRequestParams | null,
    options: RawRequestOptions = {},
  ): Promise<T> {
    const requestMethod = method.toUpperCase();
    if (
      typeof path !== "string" ||
      !path.startsWith("/") ||
      path.startsWith("//") ||
      path.startsWith("/\\")
    ) {
      throw new Error("Affinity rawRequest path must begin with a single forward slash");
    }
    const bodyMethods = new Set(["POST", "PUT", "PATCH"]);
    if (!bodyMethods.has(requestMethod) && params && Object.keys(params).length > 0) {
      throw new Error(
        "Affinity rawRequest only supports params on POST, PUT, and PATCH requests. Add query parameters to path instead.",
      );
    }

    const headers = new Headers(this.options.headers);
    for (const [name, value] of Object.entries(validateCustomHeaders(options.headers)))
      headers.set(name, value);
    headers.set("Authorization", `Bearer ${this.apiKey}`);
    headers.set(
      "Affinity-Version",
      options.apiVersion === undefined
        ? this.options.apiVersion!
        : validateNonEmptyOption(options.apiVersion, "apiVersion"),
    );
    const organizationId = options.organizationId ?? this.options.organizationId;
    if (organizationId !== undefined)
      headers.set(
        "X-Affinity-Organization-Id",
        validateNonEmptyOption(organizationId, "organizationId"),
      );
    const actor = options.actor ?? this.options.actor;
    if (actor) {
      const validatedActor = validateAffinityActor(actor);
      headers.set("Affinity-Actor-Id", validatedActor.id);
      headers.set("Affinity-Actor-Type", validatedActor.type);
    }
    if (options.idempotencyKey !== undefined)
      headers.set(
        "Idempotency-Key",
        validateNonEmptyOption(options.idempotencyKey, "idempotencyKey"),
      );

    const hasBody = bodyMethods.has(requestMethod) && params != null;
    if (hasBody) headers.set("Content-Type", "application/json");
    let response: Response;
    try {
      response = await (this.options.fetch ?? globalThis.fetch)(`${this.options.baseUrl}${path}`, {
        method: requestMethod,
        headers,
        ...(hasBody ? { body: JSON.stringify(params) } : {}),
        ...(options.signal ? { signal: options.signal } : {}),
      });
    } catch (cause) {
      if (cause instanceof Error)
        throw new FetchError(
          cause,
          "The request failed and the transport did not return a response",
        );
      throw cause;
    }
    if (!response.ok) throw new ResponseError(response, "Response returned an error code");
    if (response.status === 204 || response.headers.get("content-length") === "0")
      return undefined as T;
    return (await response.json()) as T;
  }
}
