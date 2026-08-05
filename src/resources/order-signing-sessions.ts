// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.

import type { OrderSigningSessionsApi } from "../apis/OrderSigningSessionsApi";
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
}
