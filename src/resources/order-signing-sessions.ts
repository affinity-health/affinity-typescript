// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.

import type { OrderSigningSessionsApi } from "../apis/OrderSigningSessionsApi";
import type { CreateOrderSigningSessionRequest } from "../models/CreateOrderSigningSessionRequest";
import type { MutationOptions } from "./request-options";

export class OrderSigningSessionsResource {
  constructor(
    private readonly api: OrderSigningSessionsApi,
    private readonly apiVersion: string,
  ) {}
  create(params: CreateOrderSigningSessionRequest, options: MutationOptions) {
    return this.api.createOrderSigningSession({
      affinityVersion: this.apiVersion,
      createOrderSigningSessionRequest: params,
      idempotencyKey: options.idempotencyKey,
    });
  }
}
