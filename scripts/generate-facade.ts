import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dir, "..");
const spec = JSON.parse(await readFile(resolve(root, "spec/affinity.openapi.json"), "utf8"));
const apiVersion = spec.info.version as string;
const baseUrl = spec.servers?.[0]?.url as string;
if (!apiVersion || !baseUrl) {
  throw new Error("The OpenAPI contract must define info.version and servers[0].url");
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
  "createOrder",
  "createPortalSession",
  "createPractice",
  "createPracticeMembership",
  "createPracticeRole",
  "createRoutingDecision",
  "createUser",
  "createWebhookEndpoint",
  "deletePracticeRole",
  "deleteWebhookEndpoint",
  "getApiAccess",
  "getOrder",
  "getAccount",
  "getPractice",
  "getUser",
  "getWebhookEvent",
  "listCatalogItems",
  "listShippingOptions",
  "listOrderEvents",
  "listOrders",
  "listPracticeMemberships",
  "listPracticeRoles",
  "listPractices",
  "listUsers",
  "listWebhookEndpoints",
  "listWebhookEvents",
  "replayWebhookEvent",
  "rotateWebhookEndpointSecret",
  "submitOrder",
  "updateOrder",
  "updatePractice",
  "updatePracticeMembership",
  "updatePracticeRole",
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
  retrieve(organizationId?: string) {
    return this.platformsApi.getAccount({
      affinityVersion: this.apiVersion,
      orgId: organizationId,
    });
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
  "src/resources/orders.ts",
  `import type { ListOrdersRequest, PlatformOrdersApi } from "../apis/PlatformOrdersApi";
import type { CancelOrderRequest } from "../models/CancelOrderRequest";
import type { CreateOrderRequest } from "../models/CreateOrderRequest";
import type { CreateOrderRequestAnyOf } from "../models/CreateOrderRequestAnyOf";
import type { CreateOrderRequestAnyOf1 } from "../models/CreateOrderRequestAnyOf1";
import type { CreateRoutingDecisionRequest } from "../models/CreateRoutingDecisionRequest";
import type { SubmitOrderRequest } from "../models/SubmitOrderRequest";
import type { UpdateOrderRequest } from "../models/UpdateOrderRequest";
import type { MutationOptions } from "./request-options";

export type OrderListParams = Omit<ListOrdersRequest, "affinityVersion">;
export type OrderCreateParams = CreateOrderRequestAnyOf | CreateOrderRequestAnyOf1;

export class OrdersResource {
  constructor(
    private readonly api: PlatformOrdersApi,
    private readonly apiVersion: string,
  ) {}
  list(params: OrderListParams = {}) {
    return this.api.listOrders({ ...params, affinityVersion: this.apiVersion });
  }
  retrieve(orderId: string) {
    return this.api.getOrder({ affinityVersion: this.apiVersion, orderId });
  }
  create(params: OrderCreateParams, options: MutationOptions) {
    return this.api.createOrder({
      createOrderRequest: params as CreateOrderRequest,
      affinityVersion: this.apiVersion,
      idempotencyKey: options.idempotencyKey,
    });
  }
  createRoutingDecision(params: CreateRoutingDecisionRequest, options: MutationOptions) {
    return this.api.createRoutingDecision({
      affinityVersion: this.apiVersion,
      createRoutingDecisionRequest: params,
      idempotencyKey: options.idempotencyKey,
    });
  }
  update(orderId: string, params: UpdateOrderRequest, options: MutationOptions) {
    return this.api.updateOrder({
      affinityVersion: this.apiVersion,
      idempotencyKey: options.idempotencyKey,
      orderId,
      updateOrderRequest: params,
    });
  }
  submit(orderId: string, options: MutationOptions & SubmitOrderRequest) {
    return this.api.submitOrder({
      affinityVersion: this.apiVersion,
      orderId,
      idempotencyKey: options.idempotencyKey,
      submitOrderRequest: { shippingOptionId: options.shippingOptionId },
    });
  }
  cancel(orderId: string, params: CancelOrderRequest, options: MutationOptions) {
    return this.api.cancelOrder({
      cancelOrderRequest: params,
      affinityVersion: this.apiVersion,
      idempotencyKey: options.idempotencyKey,
      orderId,
    });
  }
  listEvents(orderId: string) {
    return this.api.listOrderEvents({ affinityVersion: this.apiVersion, orderId });
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
  "src/resources/portal-sessions.ts",
  `import type { PortalSessionsApi } from "../apis/PortalSessionsApi";
import type { CreatePortalSessionRequest } from "../models/CreatePortalSessionRequest";
import type { MutationOptions } from "./request-options";

export class PortalSessionsResource {
  constructor(
    private readonly api: PortalSessionsApi,
    private readonly apiVersion: string,
  ) {}
  create(params: CreatePortalSessionRequest, options: MutationOptions) {
    return this.api.createPortalSession({
      affinityVersion: this.apiVersion,
      createPortalSessionRequest: params,
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

const indexPath = resolve(root, "src/index.ts");
const generatedIndex = (await readFile(indexPath, "utf8")).trimEnd();
await writeFile(
  indexPath,
  `${generatedIndex}\n\nexport * from "./affinity";\nexport * from "./resources/account";\nexport * from "./resources/catalog";\nexport * from "./resources/memberships";\nexport * from "./resources/orders";\nexport * from "./resources/portal-sessions";\nexport * from "./resources/practices";\nexport * from "./resources/request-options";\nexport * from "./resources/roles";\nexport * from "./resources/users";\nexport * from "./resources/webhooks";\n`,
);
