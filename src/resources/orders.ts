// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.

import type { ListOrdersRequest, PlatformOrdersApi } from "../apis/PlatformOrdersApi";
import type { CancelOrderRequest } from "../models/CancelOrderRequest";
import type { CreateOrderRequest } from "../models/CreateOrderRequest";
import { type AffinityActor, requireAffinityActor } from "./actor";
import type { MutationOptions } from "./request-options";

export type OrderListParams = Omit<
  ListOrdersRequest,
  "affinityActorId" | "affinityActorType" | "affinityVersion"
>;

export class OrdersResource {
  constructor(
    private readonly api: PlatformOrdersApi,
    private readonly apiVersion: string,
    private readonly affinityActor?: AffinityActor,
  ) {}
  create(params: CreateOrderRequest, options: MutationOptions) {
    const actor = requireAffinityActor(this.affinityActor);
    return this.api.createOrder({
      affinityActorId: actor.id,
      affinityActorType: actor.type,
      affinityVersion: this.apiVersion,
      createOrderRequest: params,
      idempotencyKey: options.idempotencyKey,
    });
  }
  list(params: OrderListParams = {}) {
    const actor = requireAffinityActor(this.affinityActor);
    return this.api.listOrders({
      ...params,
      affinityActorId: actor.id,
      affinityActorType: actor.type,
      affinityVersion: this.apiVersion,
    });
  }
  retrieve(orderId: string) {
    const actor = requireAffinityActor(this.affinityActor);
    return this.api.getOrder({
      affinityActorId: actor.id,
      affinityActorType: actor.type,
      affinityVersion: this.apiVersion,
      orderId,
    });
  }
  cancel(orderId: string, params: CancelOrderRequest, options: MutationOptions) {
    const actor = requireAffinityActor(this.affinityActor);
    return this.api.cancelOrder({
      affinityActorId: actor.id,
      affinityActorType: actor.type,
      cancelOrderRequest: params,
      affinityVersion: this.apiVersion,
      idempotencyKey: options.idempotencyKey,
      orderId,
    });
  }
  listEvents(orderId: string) {
    const actor = requireAffinityActor(this.affinityActor);
    return this.api.listOrderEvents({
      affinityActorId: actor.id,
      affinityActorType: actor.type,
      affinityVersion: this.apiVersion,
      orderId,
    });
  }
}
