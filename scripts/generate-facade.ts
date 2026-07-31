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
    private readonly apiVersion: string,
  ) {}
  retrieveAccess() {
    return this.accessApi.getApiAccess({ affinityVersion: this.apiVersion });
  }
  retrieve() {
    return this.platformsApi.getAccount({ affinityVersion: this.apiVersion });
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

export type CatalogListParams = Omit<ListCatalogItemsRequest, "affinityVersion">;

export class CatalogResource {
  constructor(
    private readonly api: CatalogApi,
    private readonly apiVersion: string,
  ) {}
  list(params: CatalogListParams = {}) {
    return this.api.listCatalogItems({ ...params, affinityVersion: this.apiVersion });
  }
  listShippingOptions(
    params: Omit<ListShippingOptionsRequest, "affinityVersion">,
  ) {
    return this.api.listShippingOptions({ ...params, affinityVersion: this.apiVersion });
  }
}`,
);

await output(
  "src/resources/compounders.ts",
  `import type { CatalogApi, ListCompoundersRequest } from "../apis/CatalogApi";

export type CompounderListParams = Omit<ListCompoundersRequest, "affinityVersion">;

export class CompoundersResource {
  constructor(
    private readonly api: CatalogApi,
    private readonly apiVersion: string,
  ) {}
  list(params: CompounderListParams = {}) {
    return this.api.listCompounders({ ...params, affinityVersion: this.apiVersion });
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
  constructor(
    private readonly api: BillingApi,
    private readonly apiVersion: string,
  ) {}
  retrievePaymentProfile(practiceId: string) {
    return this.api.getPracticePaymentProfile({ affinityVersion: this.apiVersion, practiceId });
  }
  createPaymentSetup(
    practiceId: string,
    params: CreatePracticePaymentSetupRequest,
    options: MutationOptions,
  ) {
    return this.api.createPracticePaymentSetup({
      affinityVersion: this.apiVersion,
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
      affinityVersion: this.apiVersion,
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
  constructor(
    private readonly api: PracticesApi,
    private readonly apiVersion: string,
  ) {}
  list(params: Omit<ListPracticesRequest, "affinityVersion"> = {}) {
    return this.api.listPractices({ ...params, affinityVersion: this.apiVersion });
  }
  retrieve(practiceId: string) {
    return this.api.getPractice({ affinityVersion: this.apiVersion, practiceId });
  }
  create(params: CreatePracticeRequest, options: MutationOptions) {
    return this.api.createPractice({
      createPracticeRequest: params,
      affinityVersion: this.apiVersion,
      idempotencyKey: options.idempotencyKey,
    });
  }
  update(practiceId: string, params: UpdatePracticeRequest, options: MutationOptions) {
    return this.api.updatePractice({
      affinityVersion: this.apiVersion,
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
  "affinityActorId" | "affinityActorType" | "affinityVersion" | "practiceId"
>;

export class PatientsResource {
  constructor(
    private readonly api: PatientsApi,
    private readonly apiVersion: string,
    private readonly affinityActor?: AffinityActor,
  ) {}
  list(practiceId: string, params: PatientListParams = {}) {
    const actor = requireAffinityActor(this.affinityActor);
    return this.api.listPatients({
      ...params,
      affinityActorId: actor.id,
      affinityActorType: actor.type,
      affinityVersion: this.apiVersion,
      practiceId,
    });
  }
  retrieve(practiceId: string, patientId: string) {
    const actor = requireAffinityActor(this.affinityActor);
    return this.api.getPatient({
      affinityActorId: actor.id,
      affinityActorType: actor.type,
      affinityVersion: this.apiVersion,
      patientId,
      practiceId,
    });
  }
  create(practiceId: string, params: CreatePatientRequest, options: MutationOptions) {
    const actor = requireAffinityActor(this.affinityActor);
    return this.api.createPatient({
      affinityActorId: actor.id,
      affinityActorType: actor.type,
      affinityVersion: this.apiVersion,
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
    const actor = requireAffinityActor(this.affinityActor);
    return this.api.updatePatient({
      affinityActorId: actor.id,
      affinityActorType: actor.type,
      affinityVersion: this.apiVersion,
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
import { type AffinityActor, requireAffinityActor } from "./actor";
import type { MutationOptions } from "./request-options";

export type OrderListParams = Omit<
  ListOrdersRequest,
  "affinityActorId" | "affinityActorType" | "affinityVersion"
>;

export class OrdersResource {
  constructor(
    private readonly api: PlatformOrdersApi,
    private readonly apiVersion: string,
    private readonly affinityActor?: AffinityActor,
  ) {}
  list(params: OrderListParams = {}) {
    const actor = requireAffinityActor(this.affinityActor);
    return this.api.listOrders({
      ...params,
      affinityActorId: actor.id,
      affinityActorType: actor.type,
      affinityVersion: this.apiVersion,
    });
  }
  retrieve(orderId: string) {
    const actor = requireAffinityActor(this.affinityActor);
    return this.api.getOrder({
      affinityActorId: actor.id,
      affinityActorType: actor.type,
      affinityVersion: this.apiVersion,
      orderId,
    });
  }
  cancel(orderId: string, params: CancelOrderRequest, options: MutationOptions) {
    const actor = requireAffinityActor(this.affinityActor);
    return this.api.cancelOrder({
      affinityActorId: actor.id,
      affinityActorType: actor.type,
      cancelOrderRequest: params,
      affinityVersion: this.apiVersion,
      idempotencyKey: options.idempotencyKey,
      orderId,
    });
  }
  listEvents(orderId: string) {
    const actor = requireAffinityActor(this.affinityActor);
    return this.api.listOrderEvents({
      affinityActorId: actor.id,
      affinityActorType: actor.type,
      affinityVersion: this.apiVersion,
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
  constructor(
    private readonly api: UsersApi,
    private readonly apiVersion: string,
  ) {}
  list(params: Omit<ListUsersRequest, "affinityVersion"> = {}) {
    return this.api.listUsers({ ...params, affinityVersion: this.apiVersion });
  }
  retrieve(userId: string) {
    return this.api.getUser({ affinityVersion: this.apiVersion, userId });
  }
  create(params: CreateUserRequest, options: MutationOptions) {
    return this.api.createUser({
      affinityVersion: this.apiVersion,
      createUserRequest: params,
      idempotencyKey: options.idempotencyKey,
    });
  }
  update(userId: string, params: UpdateUserRequest, options: MutationOptions) {
    return this.api.updateUser({
      affinityVersion: this.apiVersion,
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
  constructor(
    private readonly api: RolesApi,
    private readonly apiVersion: string,
  ) {}
  list(practiceId: string) {
    return this.api.listPracticeRoles({ affinityVersion: this.apiVersion, practiceId });
  }
  create(practiceId: string, params: CreatePracticeRoleRequest, options: MutationOptions) {
    return this.api.createPracticeRole({
      affinityVersion: this.apiVersion,
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
      affinityVersion: this.apiVersion,
      idempotencyKey: options.idempotencyKey,
      practiceId,
      roleId,
      updatePracticeRoleRequest: params,
    });
  }
  delete(practiceId: string, roleId: string, options: MutationOptions) {
    return this.api.deletePracticeRole({
      affinityVersion: this.apiVersion,
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
  constructor(
    private readonly api: MembershipsApi,
    private readonly apiVersion: string,
  ) {}
  list(practiceId: string) {
    return this.api.listPracticeMemberships({ affinityVersion: this.apiVersion, practiceId });
  }
  create(
    practiceId: string,
    params: CreatePracticeMembershipRequest,
    options: MutationOptions,
  ) {
    return this.api.createPracticeMembership({
      affinityVersion: this.apiVersion,
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
      affinityVersion: this.apiVersion,
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
  constructor(
    private readonly api: ProviderMappingsApi,
    private readonly apiVersion: string,
  ) {}
  create(params: CreateProviderMappingRequest, options: MutationOptions) {
    return this.api.createProviderMapping({
      affinityVersion: this.apiVersion,
      createProviderMappingRequest: params,
      idempotencyKey: options.idempotencyKey,
    });
  }
  retrieve(providerMappingId: string) {
    return this.api.getProviderMapping({
      affinityVersion: this.apiVersion,
      providerMappingId,
    });
  }
  list(params: Omit<ListProviderMappingsRequest, "affinityVersion"> = {}) {
    return this.api.listProviderMappings({ ...params, affinityVersion: this.apiVersion });
  }
  revoke(providerMappingId: string, options: MutationOptions) {
    const params: UpdateProviderMappingRequest = { status: "revoked" };
    return this.api.updateProviderMapping({
      affinityVersion: this.apiVersion,
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
  constructor(
    private readonly api: ComponentSessionsApi,
    private readonly apiVersion: string,
  ) {}
  create(params: CreateComponentSessionRequest, options: MutationOptions) {
    return this.api.createComponentSession({
      affinityVersion: this.apiVersion,
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
  constructor(
    private readonly api: HostedSessionsApi,
    private readonly apiVersion: string,
  ) {}
  create(params: CreateHostedSessionRequest, options: MutationOptions) {
    return this.api.createHostedSession({
      affinityVersion: this.apiVersion,
      createHostedSessionRequest: params,
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
  constructor(
    private readonly api: PlatformWebhooksApi,
    private readonly apiVersion: string,
  ) {}
  listEndpoints() {
    return this.api.listWebhookEndpoints({ affinityVersion: this.apiVersion });
  }
  createEndpoint(params: CreateWebhookEndpointRequest, options: MutationOptions) {
    return this.api.createWebhookEndpoint({
      createWebhookEndpointRequest: params,
      affinityVersion: this.apiVersion,
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
      affinityVersion: this.apiVersion,
      idempotencyKey: options.idempotencyKey,
      updateWebhookEndpointRequest: params,
    });
  }
  deleteEndpoint(endpointId: string, options: MutationOptions) {
    return this.api.deleteWebhookEndpoint({
      affinityVersion: this.apiVersion,
      endpointId,
      idempotencyKey: options.idempotencyKey,
    });
  }
  rotateSecret(endpointId: string, options: MutationOptions) {
    return this.api.rotateWebhookEndpointSecret({
      endpointId,
      affinityVersion: this.apiVersion,
      idempotencyKey: options.idempotencyKey,
    });
  }
  listEvents(params: Omit<ListWebhookEventsRequest, "affinityVersion"> = {}) {
    return this.api.listWebhookEvents({ ...params, affinityVersion: this.apiVersion });
  }
  retrieveEvent(eventId: string) {
    return this.api.getWebhookEvent({ affinityVersion: this.apiVersion, eventId });
  }
  replayEvent(eventId: string, options: MutationOptions) {
    return this.api.replayWebhookEvent({
      affinityVersion: this.apiVersion,
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
  `${generatedIndex}\n\nexport * from "./affinity";\nexport * from "./webhook-events";\nexport * from "./resources/account";\nexport * from "./resources/actor";\nexport * from "./resources/billing";\nexport * from "./resources/catalog";\nexport * from "./resources/component-sessions";\nexport * from "./resources/compounders";\nexport * from "./resources/hosted-sessions";\nexport * from "./resources/memberships";\nexport * from "./resources/orders";\nexport * from "./resources/patients";\nexport * from "./resources/practices";\nexport * from "./resources/provider-mappings";\nexport * from "./resources/request-options";\nexport * from "./resources/roles";\nexport * from "./resources/users";\nexport * from "./resources/webhooks";\n`,
);
