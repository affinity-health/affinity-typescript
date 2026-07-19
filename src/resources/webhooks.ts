// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.

import type { ListWebhookEventsRequest, PlatformWebhooksApi } from "../apis/PlatformWebhooksApi";
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
}
