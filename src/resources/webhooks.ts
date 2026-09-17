// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.

import type {
  WebhooksApi,
  ListWebhookEndpointsRequest,
  CreateWebhookEndpointOperationRequest,
  UpdateWebhookEndpointOperationRequest,
  DeleteWebhookEndpointRequest,
  RotateWebhookEndpointSecretRequest,
  TestWebhookEndpointRequest,
  ListWebhookEventsRequest,
  GetWebhookEventRequest,
  ReplayWebhookEventRequest,
  ListWebhookGrantsRequest,
  SaveWebhookGrantOperationRequest,
  RevokeWebhookGrantRequest,
} from "../apis/WebhooksApi";
import type { Practice, Patient, Order, CreatedOrder, PracticeLocation } from "../domain";
import { paginate, type ApiListPromise } from "./pagination";
import type { CreateWebhookEndpointRequest } from "../models/CreateWebhookEndpointRequest";
import type { UpdateWebhookEndpointRequest } from "../models/UpdateWebhookEndpointRequest";
import type { SaveWebhookGrantRequest } from "../models/SaveWebhookGrantRequest";
import {
  commonHeaders,
  requestOverrides,
  type MutationOptions,
  type RequestOptions,
  requiredIdempotencyKey,
  organizationHeader,
} from "./shared";

export type ListWebhookEndpointsParams = Omit<
  ListWebhookEndpointsRequest,
  | "affinityVersion"
  | "idempotencyKey"
  | "affinityActorId"
  | "affinityActorType"
  | "xAffinityOrganizationId"
>;
export type CreateWebhookEndpointParams = Omit<CreateWebhookEndpointRequest, "url"> & {
  url: NonNullable<CreateWebhookEndpointRequest["url"]>;
};
export type UpdateWebhookEndpointParams = Omit<
  UpdateWebhookEndpointRequest,
  "description" | "payloadStyle" | "status" | "subscribedEvents" | "url"
> & {
  description: NonNullable<UpdateWebhookEndpointRequest["description"]>;
  payloadStyle: NonNullable<UpdateWebhookEndpointRequest["payloadStyle"]>;
  status: NonNullable<UpdateWebhookEndpointRequest["status"]>;
  subscribedEvents: NonNullable<UpdateWebhookEndpointRequest["subscribedEvents"]>;
  url: NonNullable<UpdateWebhookEndpointRequest["url"]>;
};
export type ListWebhookEventsParams = Omit<
  ListWebhookEventsRequest,
  | "affinityVersion"
  | "idempotencyKey"
  | "affinityActorId"
  | "affinityActorType"
  | "xAffinityOrganizationId"
>;
export type ListWebhookGrantsParams = Omit<
  ListWebhookGrantsRequest,
  | "affinityVersion"
  | "idempotencyKey"
  | "affinityActorId"
  | "affinityActorType"
  | "xAffinityOrganizationId"
>;
export type SaveWebhookGrantParams = Omit<SaveWebhookGrantRequest, "scopes"> & {
  scopes: NonNullable<SaveWebhookGrantRequest["scopes"]>;
};

export class WebhooksResource {
  constructor(private readonly api: WebhooksApi) {}
  list(
    params: ListWebhookEndpointsParams = {},
    options?: RequestOptions,
  ): ApiListPromise<Awaited<ReturnType<WebhooksApi["listWebhookEndpoints"]>>> {
    return paginate(
      (cursor) =>
        this.api.listWebhookEndpoints(
          { ...params, ...commonHeaders(options), ...organizationHeader(options), ...cursor },
          requestOverrides(options),
        ),
      params,
    );
  }
  create(
    params: CreateWebhookEndpointParams,
    options?: MutationOptions,
  ): ReturnType<WebhooksApi["createWebhookEndpoint"]> {
    return this.api.createWebhookEndpoint(
      {
        createWebhookEndpointRequest: params,
        ...commonHeaders(options),
        idempotencyKey: requiredIdempotencyKey(options),
        ...organizationHeader(options),
      },
      requestOverrides(options),
    );
  }
  update(
    endpointId: string,
    params: UpdateWebhookEndpointParams,
    options?: MutationOptions,
  ): ReturnType<WebhooksApi["updateWebhookEndpoint"]> {
    return this.api.updateWebhookEndpoint(
      {
        endpointId: endpointId,
        updateWebhookEndpointRequest: params,
        ...commonHeaders(options),
        idempotencyKey: requiredIdempotencyKey(options),
        ...organizationHeader(options),
      },
      requestOverrides(options),
    );
  }
  delete(
    endpointId: string,
    options?: MutationOptions,
  ): ReturnType<WebhooksApi["deleteWebhookEndpoint"]> {
    return this.api.deleteWebhookEndpoint(
      {
        endpointId: endpointId,
        ...commonHeaders(options),
        idempotencyKey: requiredIdempotencyKey(options),
        ...organizationHeader(options),
      },
      requestOverrides(options),
    );
  }
  rotateSecret(
    endpointId: string,
    options?: MutationOptions,
  ): ReturnType<WebhooksApi["rotateWebhookEndpointSecret"]> {
    return this.api.rotateWebhookEndpointSecret(
      {
        endpointId: endpointId,
        ...commonHeaders(options),
        idempotencyKey: requiredIdempotencyKey(options),
        ...organizationHeader(options),
      },
      requestOverrides(options),
    );
  }
  test(
    endpointId: string,
    options?: MutationOptions,
  ): ReturnType<WebhooksApi["testWebhookEndpoint"]> {
    return this.api.testWebhookEndpoint(
      {
        endpointId: endpointId,
        ...commonHeaders(options),
        idempotencyKey: requiredIdempotencyKey(options),
        ...organizationHeader(options),
      },
      requestOverrides(options),
    );
  }
  listEvents(
    params: ListWebhookEventsParams = {},
    options?: RequestOptions,
  ): ApiListPromise<Awaited<ReturnType<WebhooksApi["listWebhookEvents"]>>> {
    return paginate(
      (cursor) =>
        this.api.listWebhookEvents(
          { ...params, ...commonHeaders(options), ...organizationHeader(options), ...cursor },
          requestOverrides(options),
        ),
      params,
    );
  }
  retrieveEvent(
    eventId: string,
    options?: RequestOptions,
  ): ReturnType<WebhooksApi["getWebhookEvent"]> {
    return this.api.getWebhookEvent(
      { eventId: eventId, ...commonHeaders(options), ...organizationHeader(options) },
      requestOverrides(options),
    );
  }
  replayEvent(
    eventId: string,
    options?: MutationOptions,
  ): ReturnType<WebhooksApi["replayWebhookEvent"]> {
    return this.api.replayWebhookEvent(
      {
        eventId: eventId,
        ...commonHeaders(options),
        idempotencyKey: requiredIdempotencyKey(options),
        ...organizationHeader(options),
      },
      requestOverrides(options),
    );
  }
  listGrants(
    params: ListWebhookGrantsParams = {},
    options?: RequestOptions,
  ): ApiListPromise<Awaited<ReturnType<WebhooksApi["listWebhookGrants"]>>> {
    return paginate(
      (cursor) =>
        this.api.listWebhookGrants(
          { ...params, ...commonHeaders(options), ...cursor },
          requestOverrides(options),
        ),
      params,
    );
  }
  saveGrant(
    platformId: string,
    params: SaveWebhookGrantParams,
    options?: MutationOptions,
  ): ReturnType<WebhooksApi["saveWebhookGrant"]> {
    return this.api.saveWebhookGrant(
      {
        platformId: platformId,
        saveWebhookGrantRequest: params,
        ...commonHeaders(options),
        idempotencyKey: requiredIdempotencyKey(options),
      },
      requestOverrides(options),
    );
  }
  revokeGrant(
    platformId: string,
    options?: MutationOptions,
  ): ReturnType<WebhooksApi["revokeWebhookGrant"]> {
    return this.api.revokeWebhookGrant(
      {
        platformId: platformId,
        ...commonHeaders(options),
        idempotencyKey: requiredIdempotencyKey(options),
      },
      requestOverrides(options),
    );
  }
}
