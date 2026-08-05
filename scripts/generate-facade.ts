import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dir, "..");
const spec = JSON.parse(await readFile(resolve(root, "spec/affinity.openapi.json"), "utf8"));
const apiVersion = spec.info.version as string;
const baseUrl = spec.servers?.[0]?.url as string;
if (!apiVersion || !baseUrl) {
  throw new Error("The OpenAPI contract must define info.version and servers[0].url");
}
const webhookContract = spec["x-affinity-webhooks"] as
  | {
      apiVersion?: string;
      eventTypes?: string[];
      orderStatuses?: string[];
      signatureHeader?: string;
    }
  | undefined;
if (
  webhookContract?.apiVersion !== apiVersion ||
  !webhookContract.eventTypes?.includes("webhook_endpoint.test") ||
  !webhookContract.eventTypes.some((eventType) => eventType.startsWith("order.")) ||
  !webhookContract.orderStatuses?.length ||
  !webhookContract.signatureHeader
) {
  throw new Error("The OpenAPI contract must define the complete x-affinity-webhooks contract");
}

const operationIds = Object.values(
  spec.paths as Record<string, Record<string, { operationId?: string }>>,
)
  .flatMap((path) => Object.values(path))
  .map((operation) => operation.operationId)
  .filter(Boolean)
  .sort();
const supportedOperations = [
  "cancelOrder",
  "completePracticePaymentSetup",
  "createComponentSession",
  "createHostedSession",
  "createOrder",
  "createOrderSigningSession",
  "createPatient",
  "createPractice",
  "createPracticeMembership",
  "createPracticePaymentSetup",
  "createPracticeRole",
  "createProviderMapping",
  "createUser",
  "createWebhookEndpoint",
  "deletePracticeRole",
  "deleteWebhookEndpoint",
  "getApiAccess",
  "getAccount",
  "getOrder",
  "getPatient",
  "getPractice",
  "getPracticePaymentProfile",
  "getProviderMapping",
  "getUser",
  "getWebhookEvent",
  "listCatalogItems",
  "listCompounders",
  "listShippingOptions",
  "listOrderEvents",
  "listOrders",
  "listPatients",
  "listPracticeMemberships",
  "listPracticeRoles",
  "listPractices",
  "listProviderMappings",
  "listUsers",
  "listWebhookEndpoints",
  "listWebhookEvents",
  "replayWebhookEvent",
  "rotateWebhookEndpointSecret",
  "updatePatient",
  "updatePractice",
  "updatePracticeMembership",
  "updatePracticeRole",
  "updateProviderMapping",
  "updateUser",
  "updateWebhookEndpoint",
].sort();
if (JSON.stringify(operationIds) !== JSON.stringify(supportedOperations)) {
  throw new Error(
    `The SDK resource map is out of date.\nContract: ${operationIds.join(", ")}\nMapped: ${supportedOperations.join(", ")}`,
  );
}

const generated =
  "// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.\n";
async function output(path: string, source: string) {
  const destination = resolve(root, path);
  await mkdir(resolve(destination, ".."), { recursive: true });
  await writeFile(destination, `${generated}\n${source.trim()}\n`);
}

await output(
  "src/affinity.ts",
  `import { APIKeysApi } from "./apis/APIKeysApi";
import { BillingApi } from "./apis/BillingApi";
import { CatalogApi } from "./apis/CatalogApi";
import { ComponentSessionsApi } from "./apis/ComponentSessionsApi";
import { HostedSessionsApi } from "./apis/HostedSessionsApi";
import { MembershipsApi } from "./apis/MembershipsApi";
import { OrderSigningSessionsApi } from "./apis/OrderSigningSessionsApi";
import { PatientsApi } from "./apis/PatientsApi";
import { PlatformOrdersApi } from "./apis/PlatformOrdersApi";
import { PlatformWebhooksApi } from "./apis/PlatformWebhooksApi";
import { PlatformsApi } from "./apis/PlatformsApi";
import { PracticesApi } from "./apis/PracticesApi";
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
import { OrderSigningSessionsResource } from "./resources/order-signing-sessions";
import { OrdersResource } from "./resources/orders";
import { PatientsResource } from "./resources/patients";
import { PracticesResource } from "./resources/practices";
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
  readonly orderSigningSessions: OrderSigningSessionsResource;
  readonly orders: OrdersResource;
  readonly patients: PatientsResource;
  readonly practices: PracticesResource;
  readonly providerMappings: ProviderMappingsResource;
  readonly roles: RolesResource;
  readonly users: UsersResource;
  readonly webhooks: WebhooksResource;
  private readonly apiKey: string;
  private readonly options: AffinityOptions;

  constructor(apiKey: string, options: AffinityOptions = {}) {
    if (!apiKey.trim()) throw new Error("Affinity requires a service API key");
    const actor = options.actor ? validateAffinityActor(options.actor) : undefined;
    const baseUrl = options.baseUrl ?? "${baseUrl}";
    const apiVersion = options.apiVersion ?? "${apiVersion}";
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
      basePath: (baseUrl.includes("://") ? baseUrl : \`https://\${baseUrl}\`).replace(/\\/+$/, ""),
      fetchApi,
      headers: {
        "Affinity-Version": apiVersion,
        ...(actor
          ? { "Affinity-Actor-Id": actor.id, "Affinity-Actor-Type": actor.type }
          : {}),
      },
    });
    this.account = new AccountResource(
      new APIKeysApi(configuration),
      new PlatformsApi(configuration),
    );
    this.billing = new BillingResource(new BillingApi(configuration));
    this.catalog = new CatalogResource(new CatalogApi(configuration));
    this.componentSessions = new ComponentSessionsResource(
      new ComponentSessionsApi(configuration),
    );
    this.compounders = new CompoundersResource(new CatalogApi(configuration));
    this.hostedSessions = new HostedSessionsResource(
      new HostedSessionsApi(configuration),
    );
    this.memberships = new MembershipsResource(new MembershipsApi(configuration));
    this.orderSigningSessions = new OrderSigningSessionsResource(
      new OrderSigningSessionsApi(configuration),
    );
    this.orders = new OrdersResource(new PlatformOrdersApi(configuration), actor);
    this.patients = new PatientsResource(new PatientsApi(configuration), actor);
    this.practices = new PracticesResource(new PracticesApi(configuration));
    this.providerMappings = new ProviderMappingsResource(
      new ProviderMappingsApi(configuration),
    );
    this.roles = new RolesResource(new RolesApi(configuration));
    this.users = new UsersResource(new UsersApi(configuration));
    this.webhooks = new WebhooksResource(new PlatformWebhooksApi(configuration));
  }

  withActor(actor: AffinityActor) {
    return new Affinity(this.apiKey, { ...this.options, actor });
  }
}`,
);

await output(
  "src/resources/retrying-fetch.ts",
  `import type { FetchAPI } from "../runtime";

type RetryOptions = { maxRetries: number; timeout: number };

export function createRetryingFetch(fetchApi: FetchAPI, options: RetryOptions): FetchAPI {
  return async (input, init) => {
    const method = (init?.method ?? (input instanceof Request ? input.method : "GET")).toUpperCase();
    const headers = new Headers(input instanceof Request ? input.headers : undefined);
    new Headers(init?.headers).forEach((value, key) => headers.set(key, value));
    const retryableRequest =
      ["GET", "HEAD", "OPTIONS"].includes(method) || headers.has("Idempotency-Key");
    let lastError: unknown;

    for (let attempt = 0; attempt <= options.maxRetries; attempt += 1) {
      const controller = new AbortController();
      const abortFromCaller = () => controller.abort(init?.signal?.reason);
      if (init?.signal?.aborted) abortFromCaller();
      init?.signal?.addEventListener("abort", abortFromCaller, { once: true });
      const timer = setTimeout(() => controller.abort(new Error("Affinity request timed out")), options.timeout);
      try {
        const response = await fetchApi(input, { ...init, signal: controller.signal });
        if (
          !retryableRequest ||
          attempt === options.maxRetries ||
          ![408, 429].includes(response.status) && response.status < 500
        ) {
          return response;
        }
        await waitBeforeRetry(attempt, response.headers.get("retry-after"));
      } catch (error) {
        lastError = error;
        if (!retryableRequest || attempt === options.maxRetries || init?.signal?.aborted) throw error;
        await waitBeforeRetry(attempt, null);
      } finally {
        clearTimeout(timer);
        init?.signal?.removeEventListener("abort", abortFromCaller);
      }
    }
    throw lastError ?? new Error("Affinity request failed");
  };
}

async function waitBeforeRetry(attempt: number, retryAfter: string | null) {
  const retryAfterSeconds = retryAfter ? Number(retryAfter) : Number.NaN;
  const delay = Number.isFinite(retryAfterSeconds)
    ? Math.max(0, retryAfterSeconds * 1_000)
    : Math.min(250 * 2 ** attempt, 2_000);
  await new Promise((resolve) => setTimeout(resolve, delay));
}`,
);

await output(
  "src/resources/actor.ts",
  `export type AffinityActorType = "system" | "user";

export interface AffinityActor {
  id: string;
  type: AffinityActorType;
}

export function validateAffinityActor(actor: AffinityActor): AffinityActor {
  const id = actor.id.trim();
  if (!id || id.length > 200) {
    throw new Error("Affinity actor ID must contain 1 to 200 characters");
  }
  if (actor.type !== "user" && actor.type !== "system") {
    throw new Error("Affinity actor type must be user or system");
  }
  return { id, type: actor.type };
}

export function requireAffinityActor(actor: AffinityActor | undefined) {
  if (!actor) {
    throw new Error(
      "Patient and order requests require actor attribution; call affinity.withActor(...) first",
    );
  }
  return actor;
}`,
);

await output(
  "src/resources/request-options.ts",
  `export interface MutationOptions {
  idempotencyKey: string;
}`,
);

await output(
  "src/resources/account.ts",
  `import type { APIKeysApi } from "../apis/APIKeysApi";
import type { PlatformsApi } from "../apis/PlatformsApi";

export class AccountResource {
  constructor(
    private readonly accessApi: APIKeysApi,
    private readonly platformsApi: PlatformsApi,
  ) {}
  retrieveAccess() {
    return this.accessApi.getApiAccess();
  }
  retrieve() {
    return this.platformsApi.getAccount();
  }
}`,
);

await output(
  "src/resources/catalog.ts",
  `import type {
  CatalogApi,
  ListCatalogItemsRequest,
  ListShippingOptionsRequest,
} from "../apis/CatalogApi";

export type CatalogListParams = ListCatalogItemsRequest;

export class CatalogResource {
  constructor(private readonly api: CatalogApi) {}
  list(params: CatalogListParams = {}) {
    return this.api.listCatalogItems(params);
  }
  listShippingOptions(params: ListShippingOptionsRequest) {
    return this.api.listShippingOptions(params);
  }
}`,
);

await output(
  "src/resources/compounders.ts",
  `import type { CatalogApi, ListCompoundersRequest } from "../apis/CatalogApi";

export type CompounderListParams = ListCompoundersRequest;

export class CompoundersResource {
  constructor(private readonly api: CatalogApi) {}
  list(params: CompounderListParams = {}) {
    return this.api.listCompounders(params);
  }
}`,
);

await output(
  "src/resources/billing.ts",
  `import type { BillingApi } from "../apis/BillingApi";
import type { CompletePracticePaymentSetupRequest } from "../models/CompletePracticePaymentSetupRequest";
import type { CreatePracticePaymentSetupRequest } from "../models/CreatePracticePaymentSetupRequest";
import type { MutationOptions } from "./request-options";

export class BillingResource {
  constructor(private readonly api: BillingApi) {}
  retrievePaymentProfile(practiceId: string) {
    return this.api.getPracticePaymentProfile({ practiceId });
  }
  createPaymentSetup(
    practiceId: string,
    params: CreatePracticePaymentSetupRequest,
    options: MutationOptions,
  ) {
    return this.api.createPracticePaymentSetup({
      createPracticePaymentSetupRequest: params,
      idempotencyKey: options.idempotencyKey,
      practiceId,
    });
  }
  completePaymentSetup(
    practiceId: string,
    params: CompletePracticePaymentSetupRequest,
    options: MutationOptions,
  ) {
    return this.api.completePracticePaymentSetup({
      completePracticePaymentSetupRequest: params,
      idempotencyKey: options.idempotencyKey,
      practiceId,
    });
  }
}`,
);

await output(
  "src/resources/practices.ts",
  `import type { ListPracticesRequest, PracticesApi } from "../apis/PracticesApi";
import type { CreatePracticeRequest } from "../models/CreatePracticeRequest";
import type { UpdatePracticeRequest } from "../models/UpdatePracticeRequest";
import type { MutationOptions } from "./request-options";

export class PracticesResource {
  constructor(private readonly api: PracticesApi) {}
  list(params: ListPracticesRequest = {}) {
    return this.api.listPractices(params);
  }
  retrieve(practiceId: string) {
    return this.api.getPractice({ practiceId });
  }
  create(params: CreatePracticeRequest, options: MutationOptions) {
    return this.api.createPractice({
      createPracticeRequest: params,
      idempotencyKey: options.idempotencyKey,
    });
  }
  update(practiceId: string, params: UpdatePracticeRequest, options: MutationOptions) {
    return this.api.updatePractice({
      idempotencyKey: options.idempotencyKey,
      practiceId,
      updatePracticeRequest: params,
    });
  }
}`,
);

await output(
  "src/resources/patients.ts",
  `import type { ListPatientsRequest, PatientsApi } from "../apis/PatientsApi";
import type { CreatePatientRequest } from "../models/CreatePatientRequest";
import type { UpdatePatientRequest } from "../models/UpdatePatientRequest";
import { type AffinityActor, requireAffinityActor } from "./actor";
import type { MutationOptions } from "./request-options";

export type PatientListParams = Omit<
  ListPatientsRequest,
  "practiceId"
>;

export class PatientsResource {
  constructor(
    private readonly api: PatientsApi,
    private readonly affinityActor?: AffinityActor,
  ) {}
  list(practiceId: string, params: PatientListParams = {}) {
    requireAffinityActor(this.affinityActor);
    return this.api.listPatients({
      ...params,
      practiceId,
    });
  }
  retrieve(practiceId: string, patientId: string) {
    requireAffinityActor(this.affinityActor);
    return this.api.getPatient({
      patientId,
      practiceId,
    });
  }
  create(practiceId: string, params: CreatePatientRequest, options: MutationOptions) {
    requireAffinityActor(this.affinityActor);
    return this.api.createPatient({
      createPatientRequest: params,
      idempotencyKey: options.idempotencyKey,
      practiceId,
    });
  }
  update(
    practiceId: string,
    patientId: string,
    params: UpdatePatientRequest,
    options: MutationOptions,
  ) {
    requireAffinityActor(this.affinityActor);
    return this.api.updatePatient({
      idempotencyKey: options.idempotencyKey,
      patientId,
      practiceId,
      updatePatientRequest: params,
    });
  }
}`,
);

await output(
  "src/resources/orders.ts",
  `import type { ListOrdersRequest, PlatformOrdersApi } from "../apis/PlatformOrdersApi";
import type { CancelOrderRequest } from "../models/CancelOrderRequest";
import type { CreateOrderRequest } from "../models/CreateOrderRequest";
import { type AffinityActor, requireAffinityActor } from "./actor";
import type { MutationOptions } from "./request-options";

export type OrderListParams = ListOrdersRequest;

export class OrdersResource {
  constructor(
    private readonly api: PlatformOrdersApi,
    private readonly affinityActor?: AffinityActor,
  ) {}
  create(params: CreateOrderRequest, options: MutationOptions) {
    requireAffinityActor(this.affinityActor);
    return this.api.createOrder({
      createOrderRequest: params,
      idempotencyKey: options.idempotencyKey,
    });
  }
  list(params: OrderListParams = {}) {
    requireAffinityActor(this.affinityActor);
    return this.api.listOrders({
      ...params,
    });
  }
  retrieve(orderId: string) {
    requireAffinityActor(this.affinityActor);
    return this.api.getOrder({
      orderId,
    });
  }
  cancel(orderId: string, params: CancelOrderRequest, options: MutationOptions) {
    requireAffinityActor(this.affinityActor);
    return this.api.cancelOrder({
      cancelOrderRequest: params,
      idempotencyKey: options.idempotencyKey,
      orderId,
    });
  }
  listEvents(orderId: string) {
    requireAffinityActor(this.affinityActor);
    return this.api.listOrderEvents({
      orderId,
    });
  }
}`,
);

await output(
  "src/resources/users.ts",
  `import type { ListUsersRequest, UsersApi } from "../apis/UsersApi";
import type { CreateUserRequest } from "../models/CreateUserRequest";
import type { UpdateUserRequest } from "../models/UpdateUserRequest";
import type { MutationOptions } from "./request-options";

export class UsersResource {
  constructor(private readonly api: UsersApi) {}
  list(params: ListUsersRequest = {}) {
    return this.api.listUsers(params);
  }
  retrieve(userId: string) {
    return this.api.getUser({ userId });
  }
  create(params: CreateUserRequest, options: MutationOptions) {
    return this.api.createUser({
      createUserRequest: params,
      idempotencyKey: options.idempotencyKey,
    });
  }
  update(userId: string, params: UpdateUserRequest, options: MutationOptions) {
    return this.api.updateUser({
      idempotencyKey: options.idempotencyKey,
      updateUserRequest: params,
      userId,
    });
  }
}`,
);

await output(
  "src/resources/roles.ts",
  `import type { RolesApi } from "../apis/RolesApi";
import type { CreatePracticeRoleRequest } from "../models/CreatePracticeRoleRequest";
import type { UpdatePracticeRoleRequest } from "../models/UpdatePracticeRoleRequest";
import type { MutationOptions } from "./request-options";

export class RolesResource {
  constructor(private readonly api: RolesApi) {}
  list(practiceId: string) {
    return this.api.listPracticeRoles({ practiceId });
  }
  create(practiceId: string, params: CreatePracticeRoleRequest, options: MutationOptions) {
    return this.api.createPracticeRole({
      createPracticeRoleRequest: params,
      idempotencyKey: options.idempotencyKey,
      practiceId,
    });
  }
  update(
    practiceId: string,
    roleId: string,
    params: UpdatePracticeRoleRequest,
    options: MutationOptions,
  ) {
    return this.api.updatePracticeRole({
      idempotencyKey: options.idempotencyKey,
      practiceId,
      roleId,
      updatePracticeRoleRequest: params,
    });
  }
  delete(practiceId: string, roleId: string, options: MutationOptions) {
    return this.api.deletePracticeRole({
      idempotencyKey: options.idempotencyKey,
      practiceId,
      roleId,
    });
  }
}`,
);

await output(
  "src/resources/memberships.ts",
  `import type { MembershipsApi } from "../apis/MembershipsApi";
import type { CreatePracticeMembershipRequest } from "../models/CreatePracticeMembershipRequest";
import type { UpdatePracticeMembershipRequest } from "../models/UpdatePracticeMembershipRequest";
import type { MutationOptions } from "./request-options";

export class MembershipsResource {
  constructor(private readonly api: MembershipsApi) {}
  list(practiceId: string) {
    return this.api.listPracticeMemberships({ practiceId });
  }
  create(
    practiceId: string,
    params: CreatePracticeMembershipRequest,
    options: MutationOptions,
  ) {
    return this.api.createPracticeMembership({
      createPracticeMembershipRequest: params,
      idempotencyKey: options.idempotencyKey,
      practiceId,
    });
  }
  update(
    practiceId: string,
    membershipId: string,
    params: UpdatePracticeMembershipRequest,
    options: MutationOptions,
  ) {
    return this.api.updatePracticeMembership({
      idempotencyKey: options.idempotencyKey,
      membershipId,
      practiceId,
      updatePracticeMembershipRequest: params,
    });
  }
}`,
);

await output(
  "src/resources/provider-mappings.ts",
  `import type { ListProviderMappingsRequest, ProviderMappingsApi } from "../apis/ProviderMappingsApi";
import type { CreateProviderMappingRequest } from "../models/CreateProviderMappingRequest";
import type { UpdateProviderMappingRequest } from "../models/UpdateProviderMappingRequest";
import type { MutationOptions } from "./request-options";

export class ProviderMappingsResource {
  constructor(private readonly api: ProviderMappingsApi) {}
  create(params: CreateProviderMappingRequest, options: MutationOptions) {
    return this.api.createProviderMapping({
      createProviderMappingRequest: params,
      idempotencyKey: options.idempotencyKey,
    });
  }
  retrieve(providerMappingId: string) {
    return this.api.getProviderMapping({
      providerMappingId,
    });
  }
  list(params: ListProviderMappingsRequest = {}) {
    return this.api.listProviderMappings(params);
  }
  revoke(providerMappingId: string, options: MutationOptions) {
    const params: UpdateProviderMappingRequest = { status: "revoked" };
    return this.api.updateProviderMapping({
      idempotencyKey: options.idempotencyKey,
      providerMappingId,
      updateProviderMappingRequest: params,
    });
  }
}`,
);

await output(
  "src/resources/component-sessions.ts",
  `import type { ComponentSessionsApi } from "../apis/ComponentSessionsApi";
import type { CreateComponentSessionRequest } from "../models/CreateComponentSessionRequest";
import type { MutationOptions } from "./request-options";

export class ComponentSessionsResource {
  constructor(private readonly api: ComponentSessionsApi) {}
  create(params: CreateComponentSessionRequest, options: MutationOptions) {
    return this.api.createComponentSession({
      createComponentSessionRequest: params,
      idempotencyKey: options.idempotencyKey,
    });
  }
}`,
);

await output(
  "src/resources/hosted-sessions.ts",
  `import type { HostedSessionsApi } from "../apis/HostedSessionsApi";
import type { CreateHostedSessionRequest } from "../models/CreateHostedSessionRequest";
import type { MutationOptions } from "./request-options";

export class HostedSessionsResource {
  constructor(private readonly api: HostedSessionsApi) {}
  create(params: CreateHostedSessionRequest, options: MutationOptions) {
    return this.api.createHostedSession({
      createHostedSessionRequest: params,
      idempotencyKey: options.idempotencyKey,
    });
  }
}`,
);

await output(
  "src/resources/order-signing-sessions.ts",
  `import type { OrderSigningSessionsApi } from "../apis/OrderSigningSessionsApi";
import type { CreateOrderSigningSessionRequest } from "../models/CreateOrderSigningSessionRequest";
import type { MutationOptions } from "./request-options";

export class OrderSigningSessionsResource {
  constructor(private readonly api: OrderSigningSessionsApi) {}
  create(params: CreateOrderSigningSessionRequest, options: MutationOptions) {
    return this.api.createOrderSigningSession({
      createOrderSigningSessionRequest: params,
      idempotencyKey: options.idempotencyKey,
    });
  }
}`,
);

await output(
  "src/resources/webhooks.ts",
  `import type { ListWebhookEventsRequest, PlatformWebhooksApi } from "../apis/PlatformWebhooksApi";
import type { CreateWebhookEndpointRequest } from "../models/CreateWebhookEndpointRequest";
import type { UpdateWebhookEndpointRequest } from "../models/UpdateWebhookEndpointRequest";
import type { MutationOptions } from "./request-options";

export class WebhooksResource {
  constructor(private readonly api: PlatformWebhooksApi) {}
  listEndpoints() {
    return this.api.listWebhookEndpoints();
  }
  createEndpoint(params: CreateWebhookEndpointRequest, options: MutationOptions) {
    return this.api.createWebhookEndpoint({
      createWebhookEndpointRequest: params,
      idempotencyKey: options.idempotencyKey,
    });
  }
  updateEndpoint(
    endpointId: string,
    params: UpdateWebhookEndpointRequest,
    options: MutationOptions,
  ) {
    return this.api.updateWebhookEndpoint({
      endpointId,
      idempotencyKey: options.idempotencyKey,
      updateWebhookEndpointRequest: params,
    });
  }
  deleteEndpoint(endpointId: string, options: MutationOptions) {
    return this.api.deleteWebhookEndpoint({
      endpointId,
      idempotencyKey: options.idempotencyKey,
    });
  }
  rotateSecret(endpointId: string, options: MutationOptions) {
    return this.api.rotateWebhookEndpointSecret({
      endpointId,
      idempotencyKey: options.idempotencyKey,
    });
  }
  listEvents(params: ListWebhookEventsRequest = {}) {
    return this.api.listWebhookEvents(params);
  }
  retrieveEvent(eventId: string) {
    return this.api.getWebhookEvent({ eventId });
  }
  replayEvent(eventId: string, options: MutationOptions) {
    return this.api.replayWebhookEvent({
      eventId,
      idempotencyKey: options.idempotencyKey,
    });
  }
}`,
);

const webhookTemplate = await readFile(resolve(root, "templates/webhook-events.ts"), "utf8");
await output(
  "src/webhook-events.ts",
  webhookTemplate
    .replace("__AFFINITY_WEBHOOK_API_VERSION__", JSON.stringify(webhookContract.apiVersion))
    .replace(
      "__AFFINITY_WEBHOOK_EVENT_TYPES__",
      JSON.stringify(webhookContract.eventTypes, null, 2),
    )
    .replace("__AFFINITY_ORDER_STATUSES__", JSON.stringify(webhookContract.orderStatuses, null, 2))
    .replace(
      "__AFFINITY_WEBHOOK_SIGNATURE_HEADER__",
      JSON.stringify(webhookContract.signatureHeader),
    ),
);

const indexPath = resolve(root, "src/index.ts");
const generatedIndex = (await readFile(indexPath, "utf8")).trimEnd();
await writeFile(
  indexPath,
  `${generatedIndex}\n\nexport * from "./affinity";\nexport * from "./webhook-events";\nexport * from "./resources/account";\nexport * from "./resources/actor";\nexport * from "./resources/billing";\nexport * from "./resources/catalog";\nexport * from "./resources/component-sessions";\nexport * from "./resources/compounders";\nexport * from "./resources/hosted-sessions";\nexport * from "./resources/memberships";\nexport * from "./resources/order-signing-sessions";\nexport * from "./resources/orders";\nexport * from "./resources/patients";\nexport * from "./resources/practices";\nexport * from "./resources/provider-mappings";\nexport * from "./resources/request-options";\nexport * from "./resources/roles";\nexport * from "./resources/users";\nexport * from "./resources/webhooks";\n`,
);
