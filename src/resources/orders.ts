// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.

import type { ListOrdersRequest, PlatformOrdersApi } from "../apis/PlatformOrdersApi";
import type { CancelOrderRequest } from "../models/CancelOrderRequest";
import type { CreateOrdersRequest } from "../models/CreateOrdersRequest";
import type { CreateOrdersRequestPatientOrdersInner } from "../models/CreateOrdersRequestPatientOrdersInner";
import type { CreateOrdersResponse } from "../models/CreateOrdersResponse";
import type { CreateOrdersResponseOrdersInner } from "../models/CreateOrdersResponseOrdersInner";
import { type AffinityActor, requireAffinityActor } from "./actor";
import { cursorPage } from "./cursor-page";
import type { MutationOptions } from "./request-options";

export type OrderListParams = ListOrdersRequest;
/** @deprecated Use CreateOrdersRequest with a patientOrders array for multi-patient checkout. */
export type CreateOrderRequest = Omit<CreateOrdersRequest, "patientOrders"> &
  CreateOrdersRequestPatientOrdersInner;
/** @deprecated Multi-patient checkout returns CreateOrdersResponse. */
export type CreateOrderResponse = CreateOrdersResponseOrdersInner;

export class OrdersResource {
  constructor(
    private readonly api: PlatformOrdersApi,
    private readonly affinityActor?: AffinityActor,
  ) {}
  create(params: CreateOrderRequest, options: MutationOptions): Promise<CreateOrderResponse>;
  create(params: CreateOrdersRequest, options: MutationOptions): Promise<CreateOrdersResponse>;
  async create(
    params: CreateOrderRequest | CreateOrdersRequest,
    options: MutationOptions,
  ): Promise<CreateOrderResponse | CreateOrdersResponse> {
    requireAffinityActor(this.affinityActor);
    const multiPatient = "patientOrders" in params;
    const createOrdersRequest: CreateOrdersRequest = multiPatient
      ? params
      : {
          patientOrders: [
            {
              patientId: params.patientId,
              prescriptions: params.prescriptions,
            },
          ],
          practiceId: params.practiceId,
          providerMappingId: params.providerMappingId,
        };
    const batch = await this.api.createOrders({
      createOrdersRequest,
      idempotencyKey: options.idempotencyKey,
    });
    if (multiPatient) return batch;
    const order = batch.orders[0];
    if (!order) throw new Error("Affinity returned an empty order batch");
    return order;
  }
  list(params: OrderListParams = {}) {
    requireAffinityActor(this.affinityActor);
    return cursorPage(params, (page) => this.api.listOrders(page));
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
  listEvents(
    orderId: string,
    params: Omit<import("../apis/PlatformOrdersApi").ListOrderEventsRequest, "orderId"> = {},
  ) {
    requireAffinityActor(this.affinityActor);
    return cursorPage(params, (page) =>
      this.api.listOrderEvents({
        ...page,
        orderId,
      }),
    );
  }
}
