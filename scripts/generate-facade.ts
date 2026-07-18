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
  "createPractice",
  "createWebhookEndpoint",
  "deleteWebhookEndpoint",
  "getApiAccess",
  "getOrder",
  "getPlatformOrganization",
  "getPractice",
  "getWebhookEvent",
  "listCatalogItems",
  "listOrderEvents",
  "listOrders",
  "listPractices",
  "listWebhookEndpoints",
  "listWebhookEvents",
  "replayWebhookEvent",
  "rotateWebhookEndpointSecret",
  "submitOrder",
  "updateOrder",
  "updatePractice",
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
import { PlatformOrdersApi } from "./apis/PlatformOrdersApi";
import { PlatformWebhooksApi } from "./apis/PlatformWebhooksApi";
import { PlatformsApi } from "./apis/PlatformsApi";
import { PracticesApi } from "./apis/PracticesApi";
import { Configuration, type FetchAPI } from "./runtime";
import { AccountResource } from "./resources/account";
import { CatalogResource } from "./resources/catalog";
import { OrdersResource } from "./resources/orders";
import { PracticesResource } from "./resources/practices";
import { createRetryingFetch } from "./resources/retrying-fetch";
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
  readonly orders: OrdersResource;
  readonly practices: PracticesResource;
  readonly webhooks: WebhooksResource;

  constructor(apiKey: string, options: AffinityOptions = {}) {
    if (!apiKey.trim()) throw new Error("Affinity requires a service API key");
    const baseUrl = options.baseUrl ?? "${baseUrl}";
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
      headers: { "Affinity-Version": options.apiVersion ?? "${apiVersion}" },
    });
    this.account = new AccountResource(
      new APIKeysApi(configuration),
      new PlatformsApi(configuration),
    );
    this.catalog = new CatalogResource(new CatalogApi(configuration));
    this.orders = new OrdersResource(new PlatformOrdersApi(configuration));
    this.practices = new PracticesResource(new PracticesApi(configuration));
    this.webhooks = new WebhooksResource(new PlatformWebhooksApi(configuration));
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
  ) {}
  retrieveAccess() {
    return this.accessApi.getApiAccess();
  }
  retrieve(organizationId?: string) {
    return this.platformsApi.getPlatformOrganization({ orgId: organizationId });
  }
}`,
);

await output(
  "src/resources/catalog.ts",
  `import type { CatalogApi, ListCatalogItemsRequest } from "../apis/CatalogApi";

export type CatalogListParams = ListCatalogItemsRequest;

export class CatalogResource {
  constructor(private readonly api: CatalogApi) {}
  list(params: CatalogListParams = {}) {
    return this.api.listCatalogItems(params);
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
  "src/resources/orders.ts",
  `import type { ListOrdersRequest, PlatformOrdersApi } from "../apis/PlatformOrdersApi";
import type { CancelOrderRequest } from "../models/CancelOrderRequest";
import type { CreateOrderRequest } from "../models/CreateOrderRequest";
import type { CreateOrderRequestAnyOf } from "../models/CreateOrderRequestAnyOf";
import type { CreateOrderRequestAnyOf1 } from "../models/CreateOrderRequestAnyOf1";
import type { UpdateOrderRequest } from "../models/UpdateOrderRequest";
import type { MutationOptions } from "./request-options";

export type OrderListParams = ListOrdersRequest;
export type OrderCreateParams = CreateOrderRequestAnyOf | CreateOrderRequestAnyOf1;

export class OrdersResource {
  constructor(private readonly api: PlatformOrdersApi) {}
  list(params: OrderListParams = {}) {
    return this.api.listOrders(params);
  }
  retrieve(orderId: string) {
    return this.api.getOrder({ orderId });
  }
  create(params: OrderCreateParams, options: MutationOptions) {
    return this.api.createOrder({
      createOrderRequest: params as CreateOrderRequest,
      idempotencyKey: options.idempotencyKey,
    });
  }
  update(orderId: string, params: UpdateOrderRequest, options: MutationOptions) {
    return this.api.updateOrder({
      idempotencyKey: options.idempotencyKey,
      orderId,
      updateOrderRequest: params,
    });
  }
  submit(orderId: string, options: MutationOptions) {
    return this.api.submitOrder({ orderId, idempotencyKey: options.idempotencyKey });
  }
  cancel(orderId: string, params: CancelOrderRequest, options: MutationOptions) {
    return this.api.cancelOrder({
      cancelOrderRequest: params,
      idempotencyKey: options.idempotencyKey,
      orderId,
    });
  }
  listEvents(orderId: string) {
    return this.api.listOrderEvents({ orderId });
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
    return this.api.deleteWebhookEndpoint({ endpointId, idempotencyKey: options.idempotencyKey });
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
    return this.api.replayWebhookEvent({ eventId, idempotencyKey: options.idempotencyKey });
  }
}`,
);

const indexPath = resolve(root, "src/index.ts");
const generatedIndex = (await readFile(indexPath, "utf8")).trimEnd();
await writeFile(
  indexPath,
  `${generatedIndex}\n\nexport * from "./affinity";\nexport * from "./resources/account";\nexport * from "./resources/catalog";\nexport * from "./resources/orders";\nexport * from "./resources/practices";\nexport * from "./resources/request-options";\nexport * from "./resources/webhooks";\n`,
);
