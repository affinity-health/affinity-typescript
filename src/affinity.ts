// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.

import { APIKeysApi } from "./apis/APIKeysApi";
import { BillingApi } from "./apis/BillingApi";
import { CatalogApi } from "./apis/CatalogApi";
import { ComponentSessionsApi } from "./apis/ComponentSessionsApi";
import { HostedSessionsApi } from "./apis/HostedSessionsApi";
import { MembershipsApi } from "./apis/MembershipsApi";
import { PatientsApi } from "./apis/PatientsApi";
import { PlatformOrdersApi } from "./apis/PlatformOrdersApi";
import { PlatformWebhooksApi } from "./apis/PlatformWebhooksApi";
import { PlatformsApi } from "./apis/PlatformsApi";
import { PracticesApi } from "./apis/PracticesApi";
import { PrescriptionSigningSessionsApi } from "./apis/PrescriptionSigningSessionsApi";
import { PrescriptionsApi } from "./apis/PrescriptionsApi";
import { ProviderMappingsApi } from "./apis/ProviderMappingsApi";
import { RolesApi } from "./apis/RolesApi";
import { UsersApi } from "./apis/UsersApi";
import { Configuration, type FetchAPI } from "./runtime";
import { AccountResource } from "./resources/account";
import { BillingResource } from "./resources/billing";
import { CatalogResource } from "./resources/catalog";
import { ComponentSessionsResource } from "./resources/component-sessions";
import { CompoundersResource } from "./resources/compounders";
import { HostedSessionsResource } from "./resources/hosted-sessions";
import { MembershipsResource } from "./resources/memberships";
import { OrdersResource } from "./resources/orders";
import { PatientsResource } from "./resources/patients";
import { PracticesResource } from "./resources/practices";
import { PrescriptionSigningSessionsResource } from "./resources/prescription-signing-sessions";
import { PrescriptionsResource } from "./resources/prescriptions";
import { ProviderMappingsResource } from "./resources/provider-mappings";
import { createRetryingFetch } from "./resources/retrying-fetch";
import { RolesResource } from "./resources/roles";
import { UsersResource } from "./resources/users";
import { WebhooksResource } from "./resources/webhooks";
import { type AffinityActor, validateAffinityActor } from "./resources/actor";

export interface AffinityOptions {
  actor?: AffinityActor;
  apiVersion?: string;
  baseUrl?: string;
  fetch?: FetchAPI;
  maxRetries?: number;
  timeout?: number;
}

export class Affinity {
  readonly account: AccountResource;
  readonly billing: BillingResource;
  readonly catalog: CatalogResource;
  readonly componentSessions: ComponentSessionsResource;
  readonly compounders: CompoundersResource;
  readonly hostedSessions: HostedSessionsResource;
  readonly memberships: MembershipsResource;
  readonly orders: OrdersResource;
  readonly patients: PatientsResource;
  readonly practices: PracticesResource;
  readonly prescriptionSigningSessions: PrescriptionSigningSessionsResource;
  readonly prescriptions: PrescriptionsResource;
  readonly providerMappings: ProviderMappingsResource;
  readonly roles: RolesResource;
  readonly users: UsersResource;
  readonly webhooks: WebhooksResource;
  private readonly apiKey: string;
  private readonly options: AffinityOptions;

  constructor(apiKey: string, options: AffinityOptions = {}) {
    if (!apiKey.trim()) throw new Error("Affinity requires a service API key");
    const actor = options.actor ? validateAffinityActor(options.actor) : undefined;
    const baseUrl = options.baseUrl ?? "https://api.joinaffinityai.com";
    const apiVersion = options.apiVersion ?? "2026-07-29";
    const timeout = options.timeout ?? 30_000;
    const maxRetries = options.maxRetries ?? 2;
    if (!Number.isFinite(timeout) || timeout <= 0) {
      throw new Error("Affinity timeout must be a positive number of milliseconds");
    }
    if (!Number.isInteger(maxRetries) || maxRetries < 0) {
      throw new Error("Affinity maxRetries must be a non-negative integer");
    }
    this.apiKey = apiKey;
    this.options = { ...options, ...(actor ? { actor } : {}) };
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
    this.billing = new BillingResource(new BillingApi(configuration), apiVersion);
    this.catalog = new CatalogResource(new CatalogApi(configuration), apiVersion);
    this.componentSessions = new ComponentSessionsResource(
      new ComponentSessionsApi(configuration),
      apiVersion,
    );
    this.compounders = new CompoundersResource(new CatalogApi(configuration), apiVersion);
    this.hostedSessions = new HostedSessionsResource(
      new HostedSessionsApi(configuration),
      apiVersion,
    );
    this.memberships = new MembershipsResource(new MembershipsApi(configuration), apiVersion);
    this.orders = new OrdersResource(new PlatformOrdersApi(configuration), apiVersion, actor);
    this.patients = new PatientsResource(new PatientsApi(configuration), apiVersion, actor);
    this.practices = new PracticesResource(new PracticesApi(configuration), apiVersion);
    this.prescriptionSigningSessions = new PrescriptionSigningSessionsResource(
      new PrescriptionSigningSessionsApi(configuration),
      apiVersion,
    );
    this.prescriptions = new PrescriptionsResource(
      new PrescriptionsApi(configuration),
      apiVersion,
      actor,
    );
    this.providerMappings = new ProviderMappingsResource(
      new ProviderMappingsApi(configuration),
      apiVersion,
    );
    this.roles = new RolesResource(new RolesApi(configuration), apiVersion);
    this.users = new UsersResource(new UsersApi(configuration), apiVersion);
    this.webhooks = new WebhooksResource(new PlatformWebhooksApi(configuration), apiVersion);
  }

  withActor(actor: AffinityActor) {
    return new Affinity(this.apiKey, { ...this.options, actor });
  }
}
