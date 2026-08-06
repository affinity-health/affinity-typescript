// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.

import type {
  ListWebhookEndpointsRequest,
  ListWebhookEventsRequest,
  PlatformWebhooksApi,
} from "../apis/PlatformWebhooksApi";
import type { CreateWebhookEndpointRequest } from "../models/CreateWebhookEndpointRequest";
import type { UpdateWebhookEndpointRequest } from "../models/UpdateWebhookEndpointRequest";
import type { MutationOptions } from "./request-options";
import { cursorPage } from "./cursor-page";

export class WebhooksResource {
  constructor(private readonly api: PlatformWebhooksApi) {}
  listEndpoints(params: ListWebhookEndpointsRequest = {}) {
    return cursorPage(params, (page) => this.api.listWebhookEndpoints(page));
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
    return cursorPage(params, (page) => this.api.listWebhookEvents(page));
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
}
