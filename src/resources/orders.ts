// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.

import type { ListOrdersRequest, PlatformOrdersApi } from "../apis/PlatformOrdersApi";
import type { CancelOrderRequest } from "../models/CancelOrderRequest";
import type { CreateOrderRequest } from "../models/CreateOrderRequest";
import type { CreateOrderRequestAnyOf } from "../models/CreateOrderRequestAnyOf";
import type { CreateOrderRequestAnyOf1 } from "../models/CreateOrderRequestAnyOf1";
import type { UpdateOrderRequest } from "../models/UpdateOrderRequest";
import type { MutationOptions } from "./request-options";

export type OrderListParams = Omit<ListOrdersRequest, "affinityVersion">;
export type OrderCreateParams = CreateOrderRequestAnyOf | CreateOrderRequestAnyOf1;

export class OrdersResource {
  constructor(
    private readonly api: PlatformOrdersApi,
    private readonly apiVersion: string,
  ) {}
  list(params: OrderListParams = {}) {
    return this.api.listOrders({ ...params, affinityVersion: this.apiVersion });
  }
  retrieve(orderId: string) {
    return this.api.getOrder({ affinityVersion: this.apiVersion, orderId });
  }
  create(params: OrderCreateParams, options: MutationOptions) {
    return this.api.createOrder({
      createOrderRequest: params as CreateOrderRequest,
      affinityVersion: this.apiVersion,
      idempotencyKey: options.idempotencyKey,
    });
  }
  update(orderId: string, params: UpdateOrderRequest, options: MutationOptions) {
    return this.api.updateOrder({
      affinityVersion: this.apiVersion,
      idempotencyKey: options.idempotencyKey,
      orderId,
      updateOrderRequest: params,
    });
  }
  submit(orderId: string, options: MutationOptions) {
    return this.api.submitOrder({
      affinityVersion: this.apiVersion,
      orderId,
      idempotencyKey: options.idempotencyKey,
    });
  }
  cancel(orderId: string, params: CancelOrderRequest, options: MutationOptions) {
    return this.api.cancelOrder({
      cancelOrderRequest: params,
      affinityVersion: this.apiVersion,
      idempotencyKey: options.idempotencyKey,
      orderId,
    });
  }
  listEvents(orderId: string) {
    return this.api.listOrderEvents({ affinityVersion: this.apiVersion, orderId });
  }
}
