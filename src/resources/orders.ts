// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.

import type { ListOrdersRequest, PlatformOrdersApi } from "../apis/PlatformOrdersApi";
import type { CancelOrderRequest } from "../models/CancelOrderRequest";
import type { MutationOptions } from "./request-options";

export type OrderListParams = Omit<ListOrdersRequest, "affinityVersion">;

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
