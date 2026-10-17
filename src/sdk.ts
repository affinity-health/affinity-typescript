// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.

import { createTransport } from "./transport";
import { affinityConnectionError, affinityErrorFromResponse } from "./errors";

const sdkVersion = "1.17.0";
export const affinityApiVersion = "2026-10-20" as const;

export interface SDKOptions {
  baseUrl?: string;
  fetch?: typeof fetch;
  timeout?: number;
  maxNetworkRetries?: number;
  apiVersion?: string;
}
export interface SDKRequestOptions {
  signal?: AbortSignal;
}
export type RequiredKeyOptions = SDKRequestOptions & { idempotencyKey: string };

type Operation = {
  path: string;
  verb: string;
  ids: readonly string[];
  query: readonly string[];
  body: boolean;
  idempotency: boolean;
};
class SDKContext {
  private readonly fetcher: typeof fetch;
  private readonly baseUrl: string;
  constructor(
    private readonly apiKey: string,
    private readonly options: SDKOptions,
  ) {
    if (!apiKey.trim()) throw new Error("An API key is required");
    this.baseUrl = (options.baseUrl ?? "https://api.affinityrx.com").replace(/\/$/, "");
    this.fetcher = createTransport(options.fetch ?? globalThis.fetch, {
      timeout: options.timeout ?? 60_000,
      maxNetworkRetries: options.maxNetworkRetries ?? 0,
    });
  }
  async call<T>(
    op: Operation,
    ids: string[],
    params: Record<string, unknown> = {},
    options: SDKRequestOptions | RequiredKeyOptions = {},
  ): Promise<T> {
    options.signal?.throwIfAborted();
    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.apiKey}`,
      "Affinity-Version": this.options.apiVersion ?? affinityApiVersion,
      "User-Agent": `affinity-typescript/${sdkVersion}`,
    };
    if (op.idempotency) {
      const key = "idempotencyKey" in options ? options.idempotencyKey : undefined;
      if (typeof key !== "string" || !/^[\x20-\x7e]{1,255}$/u.test(key))
        throw new Error(
          "A persisted idempotencyKey of 1–255 printable ASCII characters is required",
        );
      headers["Idempotency-Key"] = key;
    }
    let path = op.path;
    if (ids.length !== op.ids.length) throw new Error("Missing resource ID");
    op.ids.forEach((name, index) => {
      const id = ids[index];
      if (typeof id !== "string" || !id.trim()) throw new Error(`${name} is required`);
      path = path.replace(`{${name}}`, encodeURIComponent(id));
    });
    const query = new URLSearchParams();
    for (const name of op.query) {
      const value = params[name];
      if (value !== undefined && value !== null)
        for (const item of Array.isArray(value) ? value : [value]) query.append(name, String(item));
    }
    let response: Response;
    try {
      response = await this.fetcher(this.baseUrl + path + (query.size ? `?${query}` : ""), {
        method: op.verb,
        redirect: "error",
        headers: { ...headers, ...(op.body ? { "Content-Type": "application/json" } : {}) },
        ...(op.body ? { body: JSON.stringify(params) } : {}),
        signal: options.signal,
      });
    } catch (error) {
      if (options.signal?.aborted) throw error;
      throw affinityConnectionError(error, {
        timedOut: error instanceof Error && error.name === "TimeoutError",
      });
    }
    if (!response.ok) {
      const error = await affinityErrorFromResponse(response);
      error.message = `Affinity API request failed (${response.status} ${error.code})`;
      throw error;
    }
    return response.status === 204 ? (undefined as T) : response.json();
  }
  async *iterate<T>(
    op: Operation,
    params: Record<string, unknown>,
    options: SDKRequestOptions,
  ): AsyncIterable<T> {
    const query = { ...params };
    if (query.endingBefore !== undefined)
      throw new Error("iterate supports forward pagination; use list for endingBefore");
    const seen = new Set<unknown>();
    for (;;) {
      const page = await this.call<{ data: T[]; hasMore: boolean; nextCursor: string | null }>(
        op,
        [],
        query,
        options,
      );
      for (const item of page.data) {
        options.signal?.throwIfAborted();
        yield item;
      }
      if (!page.hasMore) return;
      const cursor = page.nextCursor;
      if (!cursor || cursor === query.startingAfter || seen.has(cursor))
        throw new Error("Pagination did not advance");
      seen.add(cursor);
      query.startingAfter = cursor;
    }
  }
}

const operations = {
  "account.account": {
    path: "/v1/account",
    verb: "GET",
    ids: [],
    query: [],
    body: false,
    idempotency: false,
  },
  createFeedback: {
    path: "/v1/feedback",
    verb: "POST",
    ids: [],
    query: [],
    body: true,
    idempotency: false,
  },
  "medications.list": {
    path: "/v1/medications",
    verb: "GET",
    ids: [],
    query: ["limit", "startingAfter", "name", "pharmacyId", "query"],
    body: false,
    idempotency: false,
  },
  "medications.get": {
    path: "/v1/medications/{medicationId}",
    verb: "GET",
    ids: ["medicationId"],
    query: [],
    body: false,
    idempotency: false,
  },
  "orders.create": {
    path: "/v1/orders",
    verb: "POST",
    ids: [],
    query: [],
    body: true,
    idempotency: true,
  },
  "orders.list": {
    path: "/v1/orders",
    verb: "GET",
    ids: [],
    query: [
      "endingBefore",
      "limit",
      "startingAfter",
      "patientId",
      "practiceId",
      "query",
      "status",
      "sort",
    ],
    body: false,
    idempotency: false,
  },
  "orders.get": {
    path: "/v1/orders/{orderId}",
    verb: "GET",
    ids: ["orderId"],
    query: [],
    body: false,
    idempotency: false,
  },
  "orders.cancel": {
    path: "/v1/orders/{orderId}/cancel",
    verb: "POST",
    ids: ["orderId"],
    query: [],
    body: false,
    idempotency: false,
  },
  "practices.create": {
    path: "/v1/practices",
    verb: "POST",
    ids: [],
    query: [],
    body: true,
    idempotency: true,
  },
  "practices.list": {
    path: "/v1/practices",
    verb: "GET",
    ids: [],
    query: ["endingBefore", "limit", "startingAfter", "query", "sort"],
    body: false,
    idempotency: false,
  },
  "practices.get": {
    path: "/v1/practices/{practiceId}",
    verb: "GET",
    ids: ["practiceId"],
    query: [],
    body: false,
    idempotency: false,
  },
  "practices.update": {
    path: "/v1/practices/{practiceId}",
    verb: "PATCH",
    ids: ["practiceId"],
    query: [],
    body: true,
    idempotency: false,
  },
  "webhooks.list": {
    path: "/v1/webhook-endpoints",
    verb: "GET",
    ids: [],
    query: ["endingBefore", "limit", "startingAfter"],
    body: false,
    idempotency: false,
  },
  "webhooks.create": {
    path: "/v1/webhook-endpoints",
    verb: "POST",
    ids: [],
    query: [],
    body: true,
    idempotency: false,
  },
  "webhooks.update": {
    path: "/v1/webhook-endpoints/{webhookEndpointId}",
    verb: "PATCH",
    ids: ["webhookEndpointId"],
    query: [],
    body: true,
    idempotency: false,
  },
  "webhooks.remove": {
    path: "/v1/webhook-endpoints/{webhookEndpointId}",
    verb: "DELETE",
    ids: ["webhookEndpointId"],
    query: [],
    body: false,
    idempotency: false,
  },
} as const;

export type AccountGetResponse = {
  id: string;
  name: string;
  phone: string | null;
  address: {
    line1: string;
    line2: string | null;
    city: string;
    state: string;
    postalCode: string;
  } | null;
  testEnabled: boolean;
  liveEnabled: boolean;
  createdAt: string;
  mode: "test" | "live";
  type: "platform" | "practice" | "pharmacy";
};
export type FeedbackCreateResponse = { id: string };
export type FeedbackCreateParams = {
  message: string;
  pageUrl?: string | null;
  requestId?: string | null;
};
export type MedicationListResponse = {
  data: Array<{
    coldChain: { price: number } | null;
    compoundingReasons: Array<string>;
    defaultDirections: string | null;
    form: string | null;
    id: string;
    name: string;
    pharmacy: { id: string; name: string };
    price: number;
    quantities: Array<number>;
    quantityUnit: string | null;
    requirements: Array<string>;
    restrictedStates: Array<string>;
    shippingOptions: Array<{ id: string; name: string; price: number }>;
    strength: string | null;
  }>;
  hasMore: boolean;
  nextCursor: string | null;
  object: "list";
  url: string;
};
export type MedicationListParams = {
  limit?: number | null;
  startingAfter?: string | null;
  name?: string | null;
  pharmacyId?: string | null;
  query?: string | null;
};
export type MedicationGetResponse = {
  coldChain: { price: number } | null;
  compoundingReasons: Array<string>;
  defaultDirections: string | null;
  form: string | null;
  id: string;
  name: string;
  pharmacy: { id: string; name: string };
  price: number;
  quantities: Array<number>;
  quantityUnit: string | null;
  requirements: Array<string>;
  restrictedStates: Array<string>;
  shippingOptions: Array<{ id: string; name: string; price: number }>;
  strength: string | null;
};
export type OrderCreateResponse = {
  cancelRequestedAt: string | null;
  createdAt: string;
  externalOrderId: string | null;
  failureReason: string | null;
  id: string;
  mode: "test" | "live";
  patient: {
    address: {
      line1: string;
      line2: string | null;
      city: string;
      state: string;
      postalCode: string;
    };
    allergies: Array<{
      category: "drug" | "food" | "insect" | "latex" | "mold" | "pet" | "pollen";
      display: string;
    }>;
    dateOfBirth: string;
    email: string;
    firstName: string;
    gender: "female" | "male" | "unknown";
    lastName: string;
    middleName: string | null;
    phone: string;
  };
  patientId: string;
  pharmacy: { id: string; name: string };
  practiceId: string;
  prescriber: { firstName: string; lastName: string; npi: string } | null;
  prescriptions: Array<{
    compoundingReason: string | null;
    directions: string;
    id: string;
    medication: { form: string | null; id: string; name: string; strength: string | null };
    notes: string | null;
    price: number;
    quantity: number;
    refills: number;
    substitutionPermitted: boolean;
  }>;
  coldChain: { price: number } | null;
  shippingOption: { id: string; name: string; price: number } | null;
  shipments: Array<{ carrier: string | null; trackingNumber: string; trackingUrl: string | null }>;
  status: "draft" | "submitted" | "processing" | "shipped" | "delivered" | "cancelled" | "failed";
  statusHistory: Array<{
    createdAt: string;
    status: "draft" | "submitted" | "processing" | "shipped" | "delivered" | "cancelled" | "failed";
  }>;
  total: number;
  updatedAt: string;
};
export type OrderCreateParams = {
  externalOrderId?: (string | null) | null;
  patient: {
    address: {
      line1: string;
      line2?: (string | null) | null;
      city: string;
      state: string;
      postalCode: string;
    };
    allergies: Array<{
      category: "drug" | "food" | "insect" | "latex" | "mold" | "pet" | "pollen";
      display: string;
    }>;
    dateOfBirth: string;
    email: string;
    firstName: string;
    gender: "female" | "male" | "unknown";
    lastName: string;
    middleName?: (string | null) | null;
    phone: string;
    externalId?: (string | null) | null;
    id?: string | null;
  };
  practiceId: string;
  prescriber?: { firstName: string; lastName: string; npi: string } | null;
  prescriptions: Array<{
    compoundingReason?: (string | null) | null;
    directions: string;
    medicationId: string;
    notes?: (string | null) | null;
    quantity: number;
    refills: number;
    substitutionPermitted?: boolean | null;
  }>;
  shippingOptionId: string;
  signatureAttestation: true;
};
export type OrderListResponse = {
  data: Array<{
    cancelRequestedAt: string | null;
    createdAt: string;
    externalOrderId: string | null;
    failureReason: string | null;
    id: string;
    mode: "test" | "live";
    patient: {
      address: {
        line1: string;
        line2: string | null;
        city: string;
        state: string;
        postalCode: string;
      };
      allergies: Array<{
        category: "drug" | "food" | "insect" | "latex" | "mold" | "pet" | "pollen";
        display: string;
      }>;
      dateOfBirth: string;
      email: string;
      firstName: string;
      gender: "female" | "male" | "unknown";
      lastName: string;
      middleName: string | null;
      phone: string;
    };
    patientId: string;
    pharmacy: { id: string; name: string };
    practiceId: string;
    prescriber: { firstName: string; lastName: string; npi: string } | null;
    prescriptions: Array<{
      compoundingReason: string | null;
      directions: string;
      id: string;
      medication: { form: string | null; id: string; name: string; strength: string | null };
      notes: string | null;
      price: number;
      quantity: number;
      refills: number;
      substitutionPermitted: boolean;
    }>;
    coldChain: { price: number } | null;
    shippingOption: { id: string; name: string; price: number } | null;
    shipments: Array<{
      carrier: string | null;
      trackingNumber: string;
      trackingUrl: string | null;
    }>;
    status: "draft" | "submitted" | "processing" | "shipped" | "delivered" | "cancelled" | "failed";
    statusHistory: Array<{
      createdAt: string;
      status:
        | "draft"
        | "submitted"
        | "processing"
        | "shipped"
        | "delivered"
        | "cancelled"
        | "failed";
    }>;
    total: number;
    updatedAt: string;
  }>;
  hasMore: boolean;
  nextCursor: string | null;
  object: "list";
  url: string;
};
export type OrderListParams = {
  endingBefore?: string | null;
  limit?: number | null;
  startingAfter?: string | null;
  patientId?: string | null;
  practiceId?: string | null;
  query?: string | null;
  status?:
    | ("draft" | "submitted" | "processing" | "shipped" | "delivered" | "cancelled" | "failed")
    | null;
  sort?: ("patient" | "-patient" | "created" | "-created") | null;
};
export type OrderGetResponse = {
  cancelRequestedAt: string | null;
  createdAt: string;
  externalOrderId: string | null;
  failureReason: string | null;
  id: string;
  mode: "test" | "live";
  patient: {
    address: {
      line1: string;
      line2: string | null;
      city: string;
      state: string;
      postalCode: string;
    };
    allergies: Array<{
      category: "drug" | "food" | "insect" | "latex" | "mold" | "pet" | "pollen";
      display: string;
    }>;
    dateOfBirth: string;
    email: string;
    firstName: string;
    gender: "female" | "male" | "unknown";
    lastName: string;
    middleName: string | null;
    phone: string;
  };
  patientId: string;
  pharmacy: { id: string; name: string };
  practiceId: string;
  prescriber: { firstName: string; lastName: string; npi: string } | null;
  prescriptions: Array<{
    compoundingReason: string | null;
    directions: string;
    id: string;
    medication: { form: string | null; id: string; name: string; strength: string | null };
    notes: string | null;
    price: number;
    quantity: number;
    refills: number;
    substitutionPermitted: boolean;
  }>;
  coldChain: { price: number } | null;
  shippingOption: { id: string; name: string; price: number } | null;
  shipments: Array<{ carrier: string | null; trackingNumber: string; trackingUrl: string | null }>;
  status: "draft" | "submitted" | "processing" | "shipped" | "delivered" | "cancelled" | "failed";
  statusHistory: Array<{
    createdAt: string;
    status: "draft" | "submitted" | "processing" | "shipped" | "delivered" | "cancelled" | "failed";
  }>;
  total: number;
  updatedAt: string;
};
export type OrderCancelResponse = {
  cancelRequestedAt: string | null;
  createdAt: string;
  externalOrderId: string | null;
  failureReason: string | null;
  id: string;
  mode: "test" | "live";
  patient: {
    address: {
      line1: string;
      line2: string | null;
      city: string;
      state: string;
      postalCode: string;
    };
    allergies: Array<{
      category: "drug" | "food" | "insect" | "latex" | "mold" | "pet" | "pollen";
      display: string;
    }>;
    dateOfBirth: string;
    email: string;
    firstName: string;
    gender: "female" | "male" | "unknown";
    lastName: string;
    middleName: string | null;
    phone: string;
  };
  patientId: string;
  pharmacy: { id: string; name: string };
  practiceId: string;
  prescriber: { firstName: string; lastName: string; npi: string } | null;
  prescriptions: Array<{
    compoundingReason: string | null;
    directions: string;
    id: string;
    medication: { form: string | null; id: string; name: string; strength: string | null };
    notes: string | null;
    price: number;
    quantity: number;
    refills: number;
    substitutionPermitted: boolean;
  }>;
  coldChain: { price: number } | null;
  shippingOption: { id: string; name: string; price: number } | null;
  shipments: Array<{ carrier: string | null; trackingNumber: string; trackingUrl: string | null }>;
  status: "draft" | "submitted" | "processing" | "shipped" | "delivered" | "cancelled" | "failed";
  statusHistory: Array<{
    createdAt: string;
    status: "draft" | "submitted" | "processing" | "shipped" | "delivered" | "cancelled" | "failed";
  }>;
  total: number;
  updatedAt: string;
};
export type PracticeCreateResponse = {
  id: string;
  name: string;
  phone: string | null;
  address: {
    line1: string;
    line2: string | null;
    city: string;
    state: string;
    postalCode: string;
  } | null;
  testEnabled: boolean;
  liveEnabled: boolean;
  createdAt: string;
};
export type PracticeCreateParams = {
  address?:
    | ({
        line1: string;
        line2: string | null;
        city: string;
        state: string;
        postalCode: string;
      } | null)
    | null;
  liveEnabled?: boolean | null;
  name: string;
  phone?: (string | null) | null;
};
export type PracticeListResponse = {
  data: Array<{
    id: string;
    name: string;
    phone: string | null;
    address: {
      line1: string;
      line2: string | null;
      city: string;
      state: string;
      postalCode: string;
    } | null;
    testEnabled: boolean;
    liveEnabled: boolean;
    createdAt: string;
  }>;
  hasMore: boolean;
  nextCursor: string | null;
  object: "list";
  url: string;
};
export type PracticeListParams = {
  endingBefore?: string | null;
  limit?: number | null;
  startingAfter?: string | null;
  query?: string | null;
  sort?:
    | ("name" | "-name" | "location" | "-location" | "mode" | "-mode" | "created" | "-created")
    | null;
};
export type PracticeGetResponse = {
  id: string;
  name: string;
  phone: string | null;
  address: {
    line1: string;
    line2: string | null;
    city: string;
    state: string;
    postalCode: string;
  } | null;
  testEnabled: boolean;
  liveEnabled: boolean;
  createdAt: string;
};
export type PracticeUpdateResponse = {
  id: string;
  name: string;
  phone: string | null;
  address: {
    line1: string;
    line2: string | null;
    city: string;
    state: string;
    postalCode: string;
  } | null;
  testEnabled: boolean;
  liveEnabled: boolean;
  createdAt: string;
};
export type PracticeUpdateParams = {
  address?:
    | ({
        line1?: string;
        line2?: string | null;
        city?: string;
        state?: string;
        postalCode?: string;
      } | null)
    | null;
  liveEnabled?: boolean | null;
  name?: string | null;
  phone?: (string | null) | null;
};
export type WebhookEndpointListResponse = {
  data: Array<{ createdAt: string; id: string; url: string }>;
  hasMore: boolean;
  nextCursor: string | null;
  object: "list";
  url: string;
};
export type WebhookEndpointListParams = {
  endingBefore?: string | null;
  limit?: number | null;
  startingAfter?: string | null;
};
export type WebhookEndpointCreateResponse = {
  createdAt: string;
  id: string;
  url: string;
  secret: string;
};
export type WebhookEndpointCreateParams = { url: string };
export type WebhookEndpointUpdateResponse = { createdAt: string; id: string; url: string };
export type WebhookEndpointUpdateParams = { url: string };
export type WebhookEndpointDeleteResponse = { deleted: true; id: string };

class AccountResource {
  constructor(private readonly context: SDKContext) {}
  get(options: SDKRequestOptions = {}): Promise<AccountGetResponse> {
    return this.context.call(operations["account.account"], [], {}, options);
  }
}
class FeedbackResource {
  constructor(private readonly context: SDKContext) {}
  create(
    params: FeedbackCreateParams,
    options: SDKRequestOptions = {},
  ): Promise<FeedbackCreateResponse> {
    return this.context.call(operations["createFeedback"], [], params, options);
  }
}
class MedicationResource {
  constructor(private readonly context: SDKContext) {}
  list(
    params: MedicationListParams = {},
    options: SDKRequestOptions = {},
  ): Promise<MedicationListResponse> {
    return this.context.call(operations["medications.list"], [], params, options);
  }
  iterate(
    params: MedicationListParams = {},
    options: SDKRequestOptions = {},
  ): AsyncIterable<MedicationListResponse["data"][number]> {
    return this.context.iterate(operations["medications.list"], params, options);
  }
  get(medicationId: string, options: SDKRequestOptions = {}): Promise<MedicationGetResponse> {
    return this.context.call(operations["medications.get"], [medicationId], {}, options);
  }
}
class OrderResource {
  constructor(private readonly context: SDKContext) {}
  create(params: OrderCreateParams, options: RequiredKeyOptions): Promise<OrderCreateResponse> {
    return this.context.call(operations["orders.create"], [], params, options);
  }
  list(params: OrderListParams = {}, options: SDKRequestOptions = {}): Promise<OrderListResponse> {
    return this.context.call(operations["orders.list"], [], params, options);
  }
  iterate(
    params: OrderListParams = {},
    options: SDKRequestOptions = {},
  ): AsyncIterable<OrderListResponse["data"][number]> {
    return this.context.iterate(operations["orders.list"], params, options);
  }
  get(orderId: string, options: SDKRequestOptions = {}): Promise<OrderGetResponse> {
    return this.context.call(operations["orders.get"], [orderId], {}, options);
  }
  cancel(orderId: string, options: SDKRequestOptions = {}): Promise<OrderCancelResponse> {
    return this.context.call(operations["orders.cancel"], [orderId], {}, options);
  }
}
class PracticeResource {
  constructor(private readonly context: SDKContext) {}
  create(
    params: PracticeCreateParams,
    options: RequiredKeyOptions,
  ): Promise<PracticeCreateResponse> {
    return this.context.call(operations["practices.create"], [], params, options);
  }
  list(
    params: PracticeListParams = {},
    options: SDKRequestOptions = {},
  ): Promise<PracticeListResponse> {
    return this.context.call(operations["practices.list"], [], params, options);
  }
  iterate(
    params: PracticeListParams = {},
    options: SDKRequestOptions = {},
  ): AsyncIterable<PracticeListResponse["data"][number]> {
    return this.context.iterate(operations["practices.list"], params, options);
  }
  get(practiceId: string, options: SDKRequestOptions = {}): Promise<PracticeGetResponse> {
    return this.context.call(operations["practices.get"], [practiceId], {}, options);
  }
  update(
    practiceId: string,
    params: PracticeUpdateParams,
    options: SDKRequestOptions = {},
  ): Promise<PracticeUpdateResponse> {
    return this.context.call(operations["practices.update"], [practiceId], params, options);
  }
}
class WebhookEndpointResource {
  constructor(private readonly context: SDKContext) {}
  list(
    params: WebhookEndpointListParams = {},
    options: SDKRequestOptions = {},
  ): Promise<WebhookEndpointListResponse> {
    return this.context.call(operations["webhooks.list"], [], params, options);
  }
  iterate(
    params: WebhookEndpointListParams = {},
    options: SDKRequestOptions = {},
  ): AsyncIterable<WebhookEndpointListResponse["data"][number]> {
    return this.context.iterate(operations["webhooks.list"], params, options);
  }
  create(
    params: WebhookEndpointCreateParams,
    options: SDKRequestOptions = {},
  ): Promise<WebhookEndpointCreateResponse> {
    return this.context.call(operations["webhooks.create"], [], params, options);
  }
  update(
    webhookEndpointId: string,
    params: WebhookEndpointUpdateParams,
    options: SDKRequestOptions = {},
  ): Promise<WebhookEndpointUpdateResponse> {
    return this.context.call(operations["webhooks.update"], [webhookEndpointId], params, options);
  }
  delete(
    webhookEndpointId: string,
    options: SDKRequestOptions = {},
  ): Promise<WebhookEndpointDeleteResponse> {
    return this.context.call(operations["webhooks.remove"], [webhookEndpointId], {}, options);
  }
}
export class Affinity {
  readonly account: AccountResource;
  readonly feedback: FeedbackResource;
  readonly medications: MedicationResource;
  readonly orders: OrderResource;
  readonly practices: PracticeResource;
  readonly webhooks: { endpoints: WebhookEndpointResource };
  constructor(apiKey: string, options: SDKOptions = {}) {
    const context = new SDKContext(apiKey, options);
    this.account = new AccountResource(context);
    this.feedback = new FeedbackResource(context);
    this.medications = new MedicationResource(context);
    this.orders = new OrderResource(context);
    this.practices = new PracticeResource(context);
    this.webhooks = { endpoints: new WebhookEndpointResource(context) };
  }
}
