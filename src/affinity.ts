// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.

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
import { Configuration, type FetchAPI } from "./runtime";

export interface AffinityOptions {
  apiVersion?: string;
  baseUrl?: string;
  fetch?: FetchAPI;
  headers?: Record<string, string>;
}

export class Affinity {
  readonly account: AccountApi;
  readonly apiKeys: APIKeysApi;
  readonly catalog: CatalogApi;
  readonly locations: LocationsApi;
  readonly orders: OrdersApi;
  readonly patients: PatientsApi;
  readonly platformPricing: PlatformPricingApi;
  readonly practices: PracticesApi;
  readonly sessions: SessionsApi;
  readonly team: TeamApi;
  readonly webhooks: WebhooksApi;

  constructor(apiKey: string, options: AffinityOptions = {}) {
    if (!apiKey.trim()) throw new Error("Affinity requires a service API key");
    const configuration = new Configuration({
      accessToken: apiKey,
      basePath: (options.baseUrl ?? "https://api.joinaffinityai.com").replace(/\/+$/, ""),
      fetchApi: options.fetch,
      headers: {
        "Affinity-Version": options.apiVersion ?? "2026-08-11",
        ...options.headers,
      },
    });
    this.account = new AccountApi(configuration);
    this.apiKeys = new APIKeysApi(configuration);
    this.catalog = new CatalogApi(configuration);
    this.locations = new LocationsApi(configuration);
    this.orders = new OrdersApi(configuration);
    this.patients = new PatientsApi(configuration);
    this.platformPricing = new PlatformPricingApi(configuration);
    this.practices = new PracticesApi(configuration);
    this.sessions = new SessionsApi(configuration);
    this.team = new TeamApi(configuration);
    this.webhooks = new WebhooksApi(configuration);
  }
}
