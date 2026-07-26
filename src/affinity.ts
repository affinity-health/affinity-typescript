// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.

import { APIKeysApi } from "./apis/APIKeysApi";
import { CatalogApi } from "./apis/CatalogApi";
import { MembershipsApi } from "./apis/MembershipsApi";
import { PlatformOrdersApi } from "./apis/PlatformOrdersApi";
import { PlatformWebhooksApi } from "./apis/PlatformWebhooksApi";
import { PlatformsApi } from "./apis/PlatformsApi";
import { PortalSessionsApi } from "./apis/PortalSessionsApi";
import { PracticesApi } from "./apis/PracticesApi";
import { RolesApi } from "./apis/RolesApi";
import { UsersApi } from "./apis/UsersApi";
import { Configuration, type FetchAPI } from "./runtime";
import { AccountResource } from "./resources/account";
import { CatalogResource } from "./resources/catalog";
import { MembershipsResource } from "./resources/memberships";
import { OrdersResource } from "./resources/orders";
import { PortalSessionsResource } from "./resources/portal-sessions";
import { PracticesResource } from "./resources/practices";
import { createRetryingFetch } from "./resources/retrying-fetch";
import { RolesResource } from "./resources/roles";
import { UsersResource } from "./resources/users";
import { WebhooksResource } from "./resources/webhooks";

export interface AffinityOptions {
  apiVersion?: string;
  baseUrl?: string;
  fetch?: FetchAPI;
  maxRetries?: number;
  timeout?: number;
}

export class Affinity {
  readonly account: AccountResource;
  readonly catalog: CatalogResource;
  readonly memberships: MembershipsResource;
  readonly orders: OrdersResource;
  readonly portalSessions: PortalSessionsResource;
  readonly practices: PracticesResource;
  readonly roles: RolesResource;
  readonly users: UsersResource;
  readonly webhooks: WebhooksResource;

  constructor(apiKey: string, options: AffinityOptions = {}) {
    if (!apiKey.trim()) throw new Error("Affinity requires a service API key");
    const baseUrl = options.baseUrl ?? "https://api.joinaffinityai.com";
    const apiVersion = options.apiVersion ?? "2026-07-26";
    const timeout = options.timeout ?? 30_000;
    const maxRetries = options.maxRetries ?? 2;
    if (!Number.isFinite(timeout) || timeout <= 0) {
      throw new Error("Affinity timeout must be a positive number of milliseconds");
    }
    if (!Number.isInteger(maxRetries) || maxRetries < 0) {
      throw new Error("Affinity maxRetries must be a non-negative integer");
    }
    const fetchApi = createRetryingFetch(options.fetch ?? globalThis.fetch, {
      maxRetries,
      timeout,
    });
    const configuration = new Configuration({
      accessToken: apiKey,
      basePath: (baseUrl.includes("://") ? baseUrl : `https://${baseUrl}`).replace(/\/+$/, ""),
      fetchApi,
      headers: { "Affinity-Version": apiVersion },
    });
    this.account = new AccountResource(
      new APIKeysApi(configuration),
      new PlatformsApi(configuration),
      apiVersion,
    );
    this.catalog = new CatalogResource(new CatalogApi(configuration), apiVersion);
    this.memberships = new MembershipsResource(new MembershipsApi(configuration), apiVersion);
    this.orders = new OrdersResource(new PlatformOrdersApi(configuration), apiVersion);
    this.portalSessions = new PortalSessionsResource(
      new PortalSessionsApi(configuration),
      apiVersion,
    );
    this.practices = new PracticesResource(new PracticesApi(configuration), apiVersion);
    this.roles = new RolesResource(new RolesApi(configuration), apiVersion);
    this.users = new UsersResource(new UsersApi(configuration), apiVersion);
    this.webhooks = new WebhooksResource(new PlatformWebhooksApi(configuration), apiVersion);
  }
}
