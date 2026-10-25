// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.

import { createTransport } from "./transport";
import { affinityConnectionError, affinityErrorFromResponse } from "./errors";

const sdkVersion = "2.0.0-beta.7";

export interface SDKOptions {
  baseUrl?: string;
  fetch?: typeof fetch;
  timeout?: number;
  maxNetworkRetries?: number;
  apiVersion?: string;
}
export interface SDKRequestOptions {
  /** Override the per-call random key. Persist your own key to retry across separate calls. */
  idempotencyKey?: string;
  signal?: AbortSignal;
}
/** Options for operations whose contract excludes Idempotency-Key. */
export type UnkeyedRequestOptions = Omit<SDKRequestOptions, "idempotencyKey"> & {
  idempotencyKey?: never;
};
/** Options for callers that persist a key across separate calls. */
export type RequiredKeyOptions = SDKRequestOptions & { idempotencyKey: string };
type Operation = {
  path: string;
  verb: string;
  ids: readonly string[];
  query: readonly string[];
  body: boolean;
  idempotency: boolean;
};
class SDKTransport {
  readonly fetcher: typeof fetch;
  readonly baseUrl: string;

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
  async request(
    path: string,
    method: string,
    body: unknown,
    headers: Record<string, string>,
    signal?: AbortSignal,
  ): Promise<any> {
    const init: RequestInit = {
      method,
      redirect: "error",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Affinity-Version": this.options.apiVersion ?? "2026-10-20",
        "User-Agent": `affinity-typescript/${sdkVersion}`,
        ...headers,
        ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      signal,
    };
    let response: Response;
    try {
      response = await this.fetcher(this.baseUrl + path, init);
    } catch (error) {
      // A caller's own cancellation stays an AbortError; network failures and timeouts are typed.
      if (signal?.aborted) throw error;
      throw affinityConnectionError(error, {
        timedOut: error instanceof Error && error.name === "TimeoutError",
      });
    }
    if (!response.ok) {
      // Problem detail can describe submitted data, so it stays on error.problem, not in the message.
      const error = await affinityErrorFromResponse(response);
      error.message = `Affinity API request failed (${response.status} ${error.code})`;
      throw error;
    }
    return response.status === 204 ? undefined : response.json();
  }
}

class SDKContext {
  constructor(readonly transport: SDKTransport) {}
  async call(
    op: Operation,
    ids: string[],
    params: Record<string, unknown> = {},
    options: SDKRequestOptions = {},
  ): Promise<any> {
    for (const name of Object.keys(options))
      if (name !== "signal" && name !== "idempotencyKey")
        throw new Error(`Unknown request option: ${name}`);
    options.signal?.throwIfAborted();
    const key =
      options.idempotencyKey ?? (op.idempotency ? globalThis.crypto.randomUUID() : undefined);
    if (key !== undefined && !/^[\x21-\x7e]{1,255}$/.test(key))
      throw new Error("idempotencyKey must contain 1 to 255 printable ASCII characters");
    if (!op.idempotency && key) throw new Error("This endpoint does not support idempotency keys");
    let path = op.path;
    if (ids.length !== op.ids.length) throw new Error("Missing resource ID");
    op.ids.forEach((name, index) => {
      const id = ids[index];
      if (typeof id !== "string" || !id.trim()) throw new Error(`${name} is required`);
      path = path.replace(`{${name}}`, encodeURIComponent(id));
    });
    if (!op.body)
      for (const name of Object.keys(params))
        if (!op.query.includes(name)) throw new Error(`Unknown query parameter: ${name}`);
    const data = { ...params };
    const query = new URLSearchParams();
    // Array parameters repeat their key, as the API's form-exploded query contract requires.
    for (const name of op.query)
      if (data[name] !== undefined && data[name] !== null) {
        const value = data[name];
        for (const item of Array.isArray(value) ? value : [value]) query.append(name, String(item));
        delete data[name];
      }
    const headers: Record<string, string> = {};
    if (key) headers["Idempotency-Key"] = key;
    return this.transport.request(
      path + (query.size ? `?${query}` : ""),
      op.verb,
      op.body ? data : undefined,
      headers,
      options.signal,
    );
  }
  async *iterate<T extends { id: string }>(
    op: Operation,
    ids: string[],
    params: Record<string, unknown>,
    options: SDKRequestOptions,
  ): AsyncIterable<T> {
    const query = { ...params };
    if (query.endingBefore !== undefined)
      throw new Error("iterate supports forward pagination; use list for endingBefore");
    for (;;) {
      options.signal?.throwIfAborted();
      const page = await this.call(op, ids, query, options);
      for (const item of page.data) {
        options.signal?.throwIfAborted();
        yield item;
      }
      if (!page.hasMore) return;
      const cursor = page.nextCursor;
      if (!cursor || cursor === query.startingAfter) throw new Error("Pagination did not advance");
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
    idempotency: true,
  },
  "medications.list": {
    path: "/v1/medications",
    verb: "GET",
    ids: [],
    query: [
      "practiceId",
      "limit",
      "startingAfter",
      "category",
      "name",
      "names",
      "pharmacyId",
      "query",
    ],
    body: false,
    idempotency: false,
  },
  "medications.get": {
    path: "/v1/medications/{medicationId}",
    verb: "GET",
    ids: ["medicationId"],
    query: ["practiceId", "expand"],
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
      "externalOrderId",
      "updatedAfter",
      "patientId",
      "practiceId",
      "query",
      "status",
      "cancelRequested",
      "recentlyShipped",
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
    idempotency: true,
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
    idempotency: true,
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
    idempotency: true,
  },
  "webhooks.update": {
    path: "/v1/webhook-endpoints/{webhookEndpointId}",
    verb: "PATCH",
    ids: ["webhookEndpointId"],
    query: [],
    body: true,
    idempotency: true,
  },
  "webhooks.remove": {
    path: "/v1/webhook-endpoints/{webhookEndpointId}",
    verb: "DELETE",
    ids: ["webhookEndpointId"],
    query: [],
    body: false,
    idempotency: false,
  },
  "webhooks.resendFailed": {
    path: "/v1/webhook-endpoints/{webhookEndpointId}/resend-failed",
    verb: "POST",
    ids: ["webhookEndpointId"],
    query: [],
    body: false,
    idempotency: true,
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
  liveEnabled: boolean;
  createdAt: string;
  mode: "test" | "live";
  type: "platform" | "practice" | "pharmacy";
};
export type FeedbackCreateResponse = { id: string };
export type FeedbackCreateParams = {
  message: string;
  pageUrl?: string;
  requestId?: string | string;
};
export type MedicationListResponse = {
  data: Array<{
    category:
      | "weight_loss"
      | "hormones"
      | "sexual_health"
      | "hair"
      | "skin"
      | "wellness"
      | "peptides"
      | "pain"
      | "other"
      | "supplies";
    coldChainRequired: boolean;
    compoundingReasons: Array<string>;
    defaultDirections: string | null;
    form: string | null;
    fullName: string;
    id: string;
    name: string;
    pharmacy: { id: string; name: string };
    price: number;
    quantities: Array<number>;
    quantityUnit: string | null;
    requirements: Array<string>;
    restrictedStates: Array<string>;
    shippingOptions: Array<{ id: string; name: string; price: number }>;
    shippingSuppliesPrice: number;
    strength: string | null;
  }>;
  hasMore: boolean;
  nextCursor: string | null;
  object: "list";
  url: string;
};
export type MedicationListParams = {
  practiceId?: string;
  limit?: string | null;
  startingAfter?: string | null;
  category?:
    | "weight_loss"
    | "hormones"
    | "sexual_health"
    | "hair"
    | "skin"
    | "wellness"
    | "peptides"
    | "pain"
    | "other"
    | "supplies";
  name?: string;
  names?: Array<string>;
  pharmacyId?: string;
  query?: string;
};
export type MedicationGetResponse = {
  category:
    | "weight_loss"
    | "hormones"
    | "sexual_health"
    | "hair"
    | "skin"
    | "wellness"
    | "peptides"
    | "pain"
    | "other"
    | "supplies";
  coldChainRequired: boolean;
  compoundingReasons: Array<string>;
  defaultDirections: string | null;
  form: string | null;
  fullName: string;
  id: string;
  name: string;
  pharmacy: { id: string; name: string };
  price: number;
  quantities: Array<number>;
  quantityUnit: string | null;
  requirements: Array<string>;
  restrictedStates: Array<string>;
  shippingOptions: Array<{ id: string; name: string; price: number }>;
  shippingSuppliesPrice: number;
  strength: string | null;
  variants?: Array<{
    category:
      | "weight_loss"
      | "hormones"
      | "sexual_health"
      | "hair"
      | "skin"
      | "wellness"
      | "peptides"
      | "pain"
      | "other"
      | "supplies";
    coldChainRequired: boolean;
    compoundingReasons: Array<string>;
    defaultDirections: string | null;
    form: string | null;
    fullName: string;
    id: string;
    name: string;
    pharmacy: { id: string; name: string };
    price: number;
    quantities: Array<number>;
    quantityUnit: string | null;
    requirements: Array<string>;
    restrictedStates: Array<string>;
    shippingOptions: Array<{ id: string; name: string; price: number }>;
    shippingSuppliesPrice: number;
    strength: string | null;
  }>;
};
export type MedicationGetParams = { practiceId?: string; expand?: Array<"variants"> };
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
  practice: {
    address: {
      line1: string;
      line2: string | null;
      city: string;
      state: string;
      postalCode: string;
    };
    name: string;
    phone: string;
    archivedAt?: string | null;
  } | null;
  practiceId: string;
  prescriber: {
    firstName: string;
    lastName: string;
    npi: string;
    phone?: string | null;
    address?: {
      line1: string;
      line2: string | null;
      city: string;
      state: string;
      postalCode: string;
    } | null;
  } | null;
  prescriptions: Array<{
    compoundingReason: string | null;
    directions: string;
    id: string;
    medication: {
      form: string | null;
      id: string;
      name: string;
      quantityUnit: string | null;
      strength: string | null;
    };
    notes: string | null;
    price: number;
    quantity: number;
    refills: number;
    substitutionPermitted: boolean;
  }>;
  shippingOption: { id: string; name: string; price: number } | null;
  shipments: Array<{ carrier: string | null; trackingNumber: string; trackingUrl: string | null }>;
  status: "submitted" | "processing" | "shipped" | "delivered" | "cancelled" | "failed";
  trackingUrl: string | null;
  statusHistory: Array<{
    createdAt: string;
    status: "submitted" | "processing" | "shipped" | "delivered" | "cancelled" | "failed";
  }>;
  total: number;
  updatedAt: string;
};
export type OrderCreateParams = {
  externalOrderId?: (string & unknown) | null;
  patient: {
    address: {
      line1: string & unknown;
      line2?: string | null;
      city: string & unknown;
      state: string;
      postalCode: string;
    };
    allergies: Array<{
      category: "drug" | "food" | "insect" | "latex" | "mold" | "pet" | "pollen";
      display: string & unknown;
    }>;
    dateOfBirth: string & unknown;
    email: string;
    firstName: string & unknown;
    gender: "female" | "male" | "unknown";
    lastName: string & unknown;
    middleName?: (string & unknown) | null;
    phone: string;
    externalId?: (string & unknown) | null;
  };
  practiceId?: string;
  prescriber?: {
    phone?: string;
    address?: {
      line1: string & unknown;
      line2?: string | null;
      city: string & unknown;
      state: string;
      postalCode: string;
    };
    firstName: string & unknown;
    lastName: string & unknown;
    npi: string;
  };
  prescriptions: Array<{
    compoundingReason?: (string & unknown) | null;
    directions: string & unknown;
    medicationId: string;
    notes?: (string & unknown) | null;
    quantity: number;
    refills: number;
    substitutionPermitted?: boolean;
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
    practice: {
      address: {
        line1: string;
        line2: string | null;
        city: string;
        state: string;
        postalCode: string;
      };
      name: string;
      phone: string;
      archivedAt?: string | null;
    } | null;
    practiceId: string;
    prescriber: {
      firstName: string;
      lastName: string;
      npi: string;
      phone?: string | null;
      address?: {
        line1: string;
        line2: string | null;
        city: string;
        state: string;
        postalCode: string;
      } | null;
    } | null;
    prescriptions: Array<{
      compoundingReason: string | null;
      directions: string;
      id: string;
      medication: {
        form: string | null;
        id: string;
        name: string;
        quantityUnit: string | null;
        strength: string | null;
      };
      notes: string | null;
      price: number;
      quantity: number;
      refills: number;
      substitutionPermitted: boolean;
    }>;
    shippingOption: { id: string; name: string; price: number } | null;
    shipments: Array<{
      carrier: string | null;
      trackingNumber: string;
      trackingUrl: string | null;
    }>;
    status: "submitted" | "processing" | "shipped" | "delivered" | "cancelled" | "failed";
    trackingUrl: string | null;
    statusHistory: Array<{
      createdAt: string;
      status: "submitted" | "processing" | "shipped" | "delivered" | "cancelled" | "failed";
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
  endingBefore?: string;
  limit?: string;
  startingAfter?: string;
  externalOrderId?: string;
  updatedAfter?: string;
  patientId?: string;
  practiceId?: string;
  query?: string;
  status?: "submitted" | "processing" | "shipped" | "delivered" | "cancelled" | "failed";
  cancelRequested?: "true" | "false";
  recentlyShipped?: "true" | "false";
  sort?: "patient" | "-patient" | "created" | "-created";
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
  practice: {
    address: {
      line1: string;
      line2: string | null;
      city: string;
      state: string;
      postalCode: string;
    };
    name: string;
    phone: string;
    archivedAt?: string | null;
  } | null;
  practiceId: string;
  prescriber: {
    firstName: string;
    lastName: string;
    npi: string;
    phone?: string | null;
    address?: {
      line1: string;
      line2: string | null;
      city: string;
      state: string;
      postalCode: string;
    } | null;
  } | null;
  prescriptions: Array<{
    compoundingReason: string | null;
    directions: string;
    id: string;
    medication: {
      form: string | null;
      id: string;
      name: string;
      quantityUnit: string | null;
      strength: string | null;
    };
    notes: string | null;
    price: number;
    quantity: number;
    refills: number;
    substitutionPermitted: boolean;
  }>;
  shippingOption: { id: string; name: string; price: number } | null;
  shipments: Array<{ carrier: string | null; trackingNumber: string; trackingUrl: string | null }>;
  status: "submitted" | "processing" | "shipped" | "delivered" | "cancelled" | "failed";
  trackingUrl: string | null;
  statusHistory: Array<{
    createdAt: string;
    status: "submitted" | "processing" | "shipped" | "delivered" | "cancelled" | "failed";
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
  practice: {
    address: {
      line1: string;
      line2: string | null;
      city: string;
      state: string;
      postalCode: string;
    };
    name: string;
    phone: string;
    archivedAt?: string | null;
  } | null;
  practiceId: string;
  prescriber: {
    firstName: string;
    lastName: string;
    npi: string;
    phone?: string | null;
    address?: {
      line1: string;
      line2: string | null;
      city: string;
      state: string;
      postalCode: string;
    } | null;
  } | null;
  prescriptions: Array<{
    compoundingReason: string | null;
    directions: string;
    id: string;
    medication: {
      form: string | null;
      id: string;
      name: string;
      quantityUnit: string | null;
      strength: string | null;
    };
    notes: string | null;
    price: number;
    quantity: number;
    refills: number;
    substitutionPermitted: boolean;
  }>;
  shippingOption: { id: string; name: string; price: number } | null;
  shipments: Array<{ carrier: string | null; trackingNumber: string; trackingUrl: string | null }>;
  status: "submitted" | "processing" | "shipped" | "delivered" | "cancelled" | "failed";
  trackingUrl: string | null;
  statusHistory: Array<{
    createdAt: string;
    status: "submitted" | "processing" | "shipped" | "delivered" | "cancelled" | "failed";
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
  liveEnabled: boolean;
  createdAt: string;
};
export type PracticeCreateParams = {
  address: {
    line1: string & unknown;
    line2?: string | null;
    city: string & unknown;
    state: string;
    postalCode: string;
  };
  liveEnabled?: boolean;
  name: string & unknown;
  phone: string;
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
    liveEnabled: boolean;
    createdAt: string;
  }>;
  hasMore: boolean;
  nextCursor: string | null;
  object: "list";
  url: string;
};
export type PracticeListParams = {
  endingBefore?: string;
  limit?: string;
  startingAfter?: string;
  query?: string;
  sort?: "name" | "-name" | "location" | "-location" | "mode" | "-mode" | "created" | "-created";
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
  liveEnabled: boolean;
  createdAt: string;
};
export type PracticeUpdateParams = {
  address?: {
    line1?: string & unknown;
    line2?: string | null;
    city?: string & unknown;
    state?: string;
    postalCode?: string;
  } | null;
  liveEnabled?: boolean;
  name?: string & unknown;
  phone?: string | null;
};
export type WebhookListResponse = {
  data: Array<{
    createdAt: string;
    updatedAt: string;
    mode: "test" | "live";
    id: string;
    url: string;
  }>;
  hasMore: boolean;
  nextCursor: string | null;
  object: "list";
  url: string;
};
export type WebhookListParams = { endingBefore?: string; limit?: string; startingAfter?: string };
export type WebhookCreateResponse = {
  createdAt: string;
  updatedAt: string;
  mode: "test" | "live";
  id: string;
  url: string;
  secret: string;
};
export type WebhookCreateParams = { url: string };
export type WebhookUpdateResponse = {
  createdAt: string;
  updatedAt: string;
  mode: "test" | "live";
  id: string;
  url: string;
};
export type WebhookUpdateParams = { url: string };
export type WebhookRemoveResponse = { deleted: true; id: string };
export type WebhookResendFailedResponse = { queued: number };
export class AccountSDKResource {
  constructor(private readonly context: SDKContext) {}
  get(options: UnkeyedRequestOptions = {}): Promise<AccountGetResponse> {
    return this.context.call(operations["account.account"], [], {}, options);
  }
}
export class FeedbackSDKResource {
  constructor(private readonly context: SDKContext) {}
  create(
    params: FeedbackCreateParams,
    options: SDKRequestOptions = {},
  ): Promise<FeedbackCreateResponse> {
    return this.context.call(operations["createFeedback"], [], params, options);
  }
}
export class MedicationSDKResource {
  constructor(private readonly context: SDKContext) {}
  list(
    params: MedicationListParams = {},
    options: UnkeyedRequestOptions = {},
  ): Promise<MedicationListResponse> {
    return this.context.call(operations["medications.list"], [], params, options);
  }
  iterate(
    params: MedicationListParams = {},
    options: UnkeyedRequestOptions = {},
  ): AsyncIterable<MedicationListResponse["data"][number]> {
    return this.context.iterate(operations["medications.list"], [], params, options);
  }
  get(
    medicationId: string,
    params: MedicationGetParams = {},
    options: UnkeyedRequestOptions = {},
  ): Promise<MedicationGetResponse> {
    return this.context.call(operations["medications.get"], [medicationId], params, options);
  }
}
export class OrderSDKResource {
  constructor(private readonly context: SDKContext) {}
  create(params: OrderCreateParams, options: SDKRequestOptions = {}): Promise<OrderCreateResponse> {
    return this.context.call(operations["orders.create"], [], params, options);
  }
  list(
    params: OrderListParams = {},
    options: UnkeyedRequestOptions = {},
  ): Promise<OrderListResponse> {
    return this.context.call(operations["orders.list"], [], params, options);
  }
  iterate(
    params: OrderListParams = {},
    options: UnkeyedRequestOptions = {},
  ): AsyncIterable<OrderListResponse["data"][number]> {
    return this.context.iterate(operations["orders.list"], [], params, options);
  }
  get(orderId: string, options: UnkeyedRequestOptions = {}): Promise<OrderGetResponse> {
    return this.context.call(operations["orders.get"], [orderId], {}, options);
  }
  cancel(orderId: string, options: SDKRequestOptions = {}): Promise<OrderCancelResponse> {
    return this.context.call(operations["orders.cancel"], [orderId], {}, options);
  }
}
export class PracticeSDKResource {
  constructor(private readonly context: SDKContext) {}
  create(
    params: PracticeCreateParams,
    options: SDKRequestOptions = {},
  ): Promise<PracticeCreateResponse> {
    return this.context.call(operations["practices.create"], [], params, options);
  }
  list(
    params: PracticeListParams = {},
    options: UnkeyedRequestOptions = {},
  ): Promise<PracticeListResponse> {
    return this.context.call(operations["practices.list"], [], params, options);
  }
  iterate(
    params: PracticeListParams = {},
    options: UnkeyedRequestOptions = {},
  ): AsyncIterable<PracticeListResponse["data"][number]> {
    return this.context.iterate(operations["practices.list"], [], params, options);
  }
  get(practiceId: string, options: UnkeyedRequestOptions = {}): Promise<PracticeGetResponse> {
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
export class WebhookSDKResource {
  constructor(private readonly context: SDKContext) {}
  list(
    params: WebhookListParams = {},
    options: UnkeyedRequestOptions = {},
  ): Promise<WebhookListResponse> {
    return this.context.call(operations["webhooks.list"], [], params, options);
  }
  iterate(
    params: WebhookListParams = {},
    options: UnkeyedRequestOptions = {},
  ): AsyncIterable<WebhookListResponse["data"][number]> {
    return this.context.iterate(operations["webhooks.list"], [], params, options);
  }
  create(
    params: WebhookCreateParams,
    options: SDKRequestOptions = {},
  ): Promise<WebhookCreateResponse> {
    return this.context.call(operations["webhooks.create"], [], params, options);
  }
  update(
    webhookEndpointId: string,
    params: WebhookUpdateParams,
    options: SDKRequestOptions = {},
  ): Promise<WebhookUpdateResponse> {
    return this.context.call(operations["webhooks.update"], [webhookEndpointId], params, options);
  }
  remove(
    webhookEndpointId: string,
    options: UnkeyedRequestOptions = {},
  ): Promise<WebhookRemoveResponse> {
    return this.context.call(operations["webhooks.remove"], [webhookEndpointId], {}, options);
  }
  resendFailed(
    webhookEndpointId: string,
    options: SDKRequestOptions = {},
  ): Promise<WebhookResendFailedResponse> {
    return this.context.call(operations["webhooks.resendFailed"], [webhookEndpointId], {}, options);
  }
}
export class Affinity {
  private readonly context: SDKContext;
  constructor(apiKey: string, options: SDKOptions = {}) {
    this.context = new SDKContext(new SDKTransport(apiKey, options));
  }
  get account() {
    return new AccountSDKResource(this.context);
  }
  get feedback() {
    return new FeedbackSDKResource(this.context);
  }
  get medications() {
    return new MedicationSDKResource(this.context);
  }
  get orders() {
    return new OrderSDKResource(this.context);
  }
  get practices() {
    return new PracticeSDKResource(this.context);
  }
  get webhooks() {
    return new WebhookSDKResource(this.context);
  }
}
