// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.

import type { Configuration } from "./runtime";
import { AccountApi } from "./apis/AccountApi";
import { APIKeysApi } from "./apis/APIKeysApi";
import { CatalogApi } from "./apis/CatalogApi";
import { LocationsApi } from "./apis/LocationsApi";
import { OrdersApi } from "./apis/OrdersApi";
import { PatientsApi } from "./apis/PatientsApi";
import { PlatformPricingApi } from "./apis/PlatformPricingApi";
import { PracticesApi } from "./apis/PracticesApi";
import { TeamApi } from "./apis/TeamApi";
import { WebhooksApi } from "./apis/WebhooksApi";

/** The generated OpenAPI clients, available for lower-level escape-hatch use. */
export class RawClient {
  readonly account: AccountApi;
  readonly apiKeys: APIKeysApi;
  readonly catalog: CatalogApi;
  readonly locations: LocationsApi;
  readonly orders: OrdersApi;
  readonly patients: PatientsApi;
  readonly platformPricing: PlatformPricingApi;
  readonly practices: PracticesApi;
  readonly team: TeamApi;
  readonly webhooks: WebhooksApi;

  constructor(configuration: Configuration) {
    this.account = new AccountApi(configuration);
    this.apiKeys = new APIKeysApi(configuration);
    this.catalog = new CatalogApi(configuration);
    this.locations = new LocationsApi(configuration);
    this.orders = new OrdersApi(configuration);
    this.patients = new PatientsApi(configuration);
    this.platformPricing = new PlatformPricingApi(configuration);
    this.practices = new PracticesApi(configuration);
    this.team = new TeamApi(configuration);
    this.webhooks = new WebhooksApi(configuration);
  }
}
