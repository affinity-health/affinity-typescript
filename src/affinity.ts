// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.

import { Configuration, type FetchAPI } from "./runtime";
import { AccountApi } from "./apis/AccountApi";
import { APIKeysApi } from "./apis/APIKeysApi";
import { CatalogApi } from "./apis/CatalogApi";
import { LocationsApi } from "./apis/LocationsApi";
import { OrdersApi } from "./apis/OrdersApi";
import { PatientsApi } from "./apis/PatientsApi";
import { PlatformPricingApi } from "./apis/PlatformPricingApi";
import { PracticesApi } from "./apis/PracticesApi";
import { SessionsApi } from "./apis/SessionsApi";
import { TeamApi } from "./apis/TeamApi";
import { WebhooksApi } from "./apis/WebhooksApi";
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
    this.account = new AccountResource(new AccountApi(configuration));
    this.apiKeys = new APIKeysResource(new APIKeysApi(configuration));
    this.catalog = new CatalogResource(new CatalogApi(configuration));
    this.locations = new LocationsResource(new LocationsApi(configuration));
    this.orders = new OrdersResource(new OrdersApi(configuration), actor);
    this.patients = new PatientsResource(new PatientsApi(configuration), actor);
    this.platformPricing = new PlatformPricingResource(new PlatformPricingApi(configuration));
    this.practices = new PracticesResource(new PracticesApi(configuration));
    this.sessions = new SessionsResource(new SessionsApi(configuration));
    this.team = new TeamResource(new TeamApi(configuration));
    this.webhooks = new WebhooksResource(new WebhooksApi(configuration));
  }

  withActor(actor: AffinityActor): Affinity {
    return new Affinity(this.apiKey, { ...this.options, actor });
  }
}
