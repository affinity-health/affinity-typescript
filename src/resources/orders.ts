// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.

import type { ListOrdersRequest, PlatformOrdersApi } from "../apis/PlatformOrdersApi";
import type { CancelOrderRequest } from "../models/CancelOrderRequest";
import type { CreateOrderRequest } from "../models/CreateOrderRequest";
import { type AffinityActor, requireAffinityActor } from "./actor";
import type { MutationOptions } from "./request-options";

export type OrderListParams = ListOrdersRequest;

export class OrdersResource {
  constructor(
    private readonly api: PlatformOrdersApi,
    private readonly affinityActor?: AffinityActor,
  ) {}
  create(params: CreateOrderRequest, options: MutationOptions) {
    requireAffinityActor(this.affinityActor);
    return this.api.createOrder({
      createOrderRequest: params,
      idempotencyKey: options.idempotencyKey,
    });
  }
  list(params: OrderListParams = {}) {
    requireAffinityActor(this.affinityActor);
    return this.api.listOrders({
      ...params,
    });
  }
  retrieve(orderId: string) {
    requireAffinityActor(this.affinityActor);
    return this.api.getOrder({
      orderId,
    });
  }
  cancel(orderId: string, params: CancelOrderRequest, options: MutationOptions) {
    requireAffinityActor(this.affinityActor);
    return this.api.cancelOrder({
      cancelOrderRequest: params,
      idempotencyKey: options.idempotencyKey,
      orderId,
    });
  }
  listEvents(orderId: string) {
    requireAffinityActor(this.affinityActor);
    return this.api.listOrderEvents({
      orderId,
    });
  }
}
