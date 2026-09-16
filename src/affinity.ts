// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.

import { Configuration, type FetchAPI } from "./runtime";
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

export class Affinity {
  readonly raw: RawClient;
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
    this.options = {
      ...options,
      headers,
      apiVersion: version,
      ...(actor ? { actor } : {}),
      ...(organizationId ? { organizationId } : {}),
    };
    const configuration = new Configuration({
      accessToken: apiKey,
      basePath: (options.baseUrl ?? "https://api.joinaffinityai.com").replace(/\/+$/, ""),
      fetchApi: options.fetch,
      headers: {
        ...headers,
        "Affinity-Version": version,
        ...(actor ? { "Affinity-Actor-Id": actor.id, "Affinity-Actor-Type": actor.type } : {}),
        ...(organizationId ? { "X-Affinity-Organization-Id": organizationId } : {}),
      },
    });
    const raw = new RawClient(configuration);
    this.raw = raw;
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
}
