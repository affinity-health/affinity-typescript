// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.

import type {
  OrdersApi,
  ListOrdersRequest,
  CreateOrderOperationRequest,
  GetOrderRequest,
  CancelOrderOperationRequest,
  ActOnOrderExceptionOperationRequest,
  ListOrderEventsRequest,
  PreviewOrderOperationRequest,
  SignOrderOperationRequest,
  SignAndSubmitOrderOperationRequest,
  SubmitOrderOperationRequest,
  RejectOrderOperationRequest,
  AddOrderPrescriptionOperationRequest,
  UpdateOrderPrescriptionOperationRequest,
  CreateOrderBatchOperationRequest,
} from "../apis/OrdersApi";
import type { Practice, Patient, Order, CreatedOrder, PracticeLocation } from "../domain";
import { paginate, type ApiListPromise } from "./pagination";
import type { CreateOrderRequest } from "../models/CreateOrderRequest";
import type { CancelOrderRequest } from "../models/CancelOrderRequest";
import type { ActOnOrderExceptionRequest } from "../models/ActOnOrderExceptionRequest";
import type { PreviewOrderRequest } from "../models/PreviewOrderRequest";
import type { SignOrderRequest } from "../models/SignOrderRequest";
import type { SignAndSubmitOrderRequest } from "../models/SignAndSubmitOrderRequest";
import type { SubmitOrderRequest } from "../models/SubmitOrderRequest";
import type { RejectOrderRequest } from "../models/RejectOrderRequest";
import type { AddOrderPrescriptionRequest } from "../models/AddOrderPrescriptionRequest";
import type { UpdateOrderPrescriptionRequest } from "../models/UpdateOrderPrescriptionRequest";
import type { CreateOrderBatchRequest } from "../models/CreateOrderBatchRequest";
import {
  commonHeaders,
  requestOverrides,
  type MutationOptions,
  type RequestOptions,
  requiredIdempotencyKey,
} from "./shared";

export type ListOrdersParams = Omit<
  ListOrdersRequest,
  | "affinityVersion"
  | "idempotencyKey"
  | "affinityActorId"
  | "affinityActorType"
  | "xAffinityOrganizationId"
>;
export type OrderQuantity = number | "Infinity" | "-Infinity" | "NaN";
export type CreateOrderPrescriptionParams = Omit<
  CreateOrderRequest["prescriptions"][number],
  "quantity"
> & { quantity: OrderQuantity };
export type CreateOrderParams = Omit<
  CreateOrderRequest,
  "practiceId" | "patientId" | "patient" | "prescriptions"
> & {
  practiceId: NonNullable<CreateOrderRequest["practiceId"]>;
  prescriptions: CreateOrderPrescriptionParams[];
} & (
    | { patientId: string; patient?: never }
    | { patient: NonNullable<CreateOrderRequest["patient"]>; patientId?: never }
  );
export type CancelOrderParams = Omit<CancelOrderRequest, "reason"> & {
  reason: NonNullable<CancelOrderRequest["reason"]>;
};
export type ActOnOrderExceptionParams = Omit<ActOnOrderExceptionRequest, "action"> & {
  action: NonNullable<ActOnOrderExceptionRequest["action"]>;
};
export type ListOrderEventsParams = Omit<
  ListOrderEventsRequest,
  | "orderId"
  | "affinityVersion"
  | "idempotencyKey"
  | "affinityActorId"
  | "affinityActorType"
  | "xAffinityOrganizationId"
>;
export type PreviewOrderParams = Omit<
  PreviewOrderRequest,
  "patientId" | "patientExternalId" | "patient"
> &
  (
    | { patientId: string; patientExternalId?: never; patient?: never }
    | { patientExternalId: string; patientId?: never; patient?: never }
    | {
        patient: NonNullable<PreviewOrderRequest["patient"]>;
        patientId?: never;
        patientExternalId?: never;
      }
  );
export type SignOrderParams = Omit<
  SignOrderRequest,
  "practiceId" | "signatureAttestation" | "expectedVersions"
> & {
  practiceId: NonNullable<SignOrderRequest["practiceId"]>;
  signatureAttestation: NonNullable<SignOrderRequest["signatureAttestation"]>;
  expectedVersions: NonNullable<SignOrderRequest["expectedVersions"]>;
};
export type SignAndSubmitOrderParams = Omit<
  SignAndSubmitOrderRequest,
  "practiceId" | "signatureAttestation" | "expectedVersions"
> & {
  practiceId: NonNullable<SignAndSubmitOrderRequest["practiceId"]>;
  signatureAttestation: NonNullable<SignAndSubmitOrderRequest["signatureAttestation"]>;
  expectedVersions: NonNullable<SignAndSubmitOrderRequest["expectedVersions"]>;
};
export type SubmitOrderParams = Omit<SubmitOrderRequest, "practiceId"> & {
  practiceId: NonNullable<SubmitOrderRequest["practiceId"]>;
};
export type RejectOrderParams = Omit<
  RejectOrderRequest,
  "practiceId" | "reason" | "expectedVersions"
> & {
  practiceId: NonNullable<RejectOrderRequest["practiceId"]>;
  reason: NonNullable<RejectOrderRequest["reason"]>;
  expectedVersions: NonNullable<RejectOrderRequest["expectedVersions"]>;
};
export type AddOrderPrescriptionParams = Omit<
  AddOrderPrescriptionRequest,
  "practiceId" | "expectedVersions" | "prescription"
> & {
  practiceId: NonNullable<AddOrderPrescriptionRequest["practiceId"]>;
  expectedVersions: NonNullable<AddOrderPrescriptionRequest["expectedVersions"]>;
  prescription: NonNullable<AddOrderPrescriptionRequest["prescription"]>;
};
export type UpdateOrderPrescriptionParams = Omit<
  UpdateOrderPrescriptionRequest,
  "practiceId" | "expectedVersions" | "prescription"
> & {
  practiceId: NonNullable<UpdateOrderPrescriptionRequest["practiceId"]>;
  expectedVersions: NonNullable<UpdateOrderPrescriptionRequest["expectedVersions"]>;
  prescription: NonNullable<UpdateOrderPrescriptionRequest["prescription"]>;
};
export type CreateOrderBatchOrderParams = Omit<
  CreateOrderBatchRequest["orders"][number],
  "patientId" | "patient" | "prescriptions"
> & {
  prescriptions: CreateOrderBatchPrescriptionParams[];
} & (
    | { patientId: string; patient?: never }
    | {
        patient: NonNullable<CreateOrderBatchRequest["orders"][number]["patient"]>;
        patientId?: never;
      }
  );
export type CreateOrderBatchPrescriptionParams = Omit<
  CreateOrderBatchRequest["orders"][number]["prescriptions"][number],
  "quantity"
> & { quantity: OrderQuantity };
export type CreateOrderBatchParams = Omit<CreateOrderBatchRequest, "practiceId" | "orders"> & {
  practiceId: NonNullable<CreateOrderBatchRequest["practiceId"]>;
  orders: CreateOrderBatchOrderParams[];
};
function validateOrderPatient(
  params: { patientId?: unknown; patient?: unknown },
  label: string,
): void {
  const hasPatientId = params.patientId !== undefined && params.patientId !== null;
  const hasPatient = params.patient !== undefined && params.patient !== null;
  if (hasPatientId === hasPatient)
    throw new Error(label + " requires exactly one of patientId or patient");
  if (hasPatientId && (typeof params.patientId !== "string" || !params.patientId.trim()))
    throw new Error(label + " requires a non-empty patientId");
  if (hasPatient && (typeof params.patient !== "object" || Array.isArray(params.patient)))
    throw new Error(label + " requires an inline patient object");
}

function validateCreateOrderParams(params: CreateOrderParams): void {
  if (
    !params ||
    typeof params !== "object" ||
    typeof params.practiceId !== "string" ||
    !params.practiceId.trim()
  )
    throw new Error("Create order requires a non-empty practiceId");
  validateOrderPatient(params, "Create order");
  if (
    !Array.isArray(params.prescriptions) ||
    params.prescriptions.length < 1 ||
    params.prescriptions.length > 20
  )
    throw new Error("Create order requires between 1 and 20 prescriptions");
}

function validateCreateOrderBatchParams(params: CreateOrderBatchParams): void {
  if (
    !params ||
    typeof params !== "object" ||
    typeof params.practiceId !== "string" ||
    !params.practiceId.trim()
  )
    throw new Error("Create order batch requires a non-empty practiceId");
  if (!Array.isArray(params.orders) || params.orders.length < 1 || params.orders.length > 20)
    throw new Error("Create order batch requires between 1 and 20 orders");
  for (const [index, order] of params.orders.entries()) {
    if (!order || typeof order !== "object")
      throw new Error("Order batch item " + index + " must be an order");
    validateOrderPatient(order, "Order batch item " + index);
    if (
      !Array.isArray(order.prescriptions) ||
      order.prescriptions.length < 1 ||
      order.prescriptions.length > 20
    )
      throw new Error("Order batch item " + index + " requires between 1 and 20 prescriptions");
  }
}

export class OrdersResource {
  constructor(private readonly api: OrdersApi) {}
  list(
    params: ListOrdersParams = {},
    options?: RequestOptions,
  ): ApiListPromise<Awaited<ReturnType<OrdersApi["listOrders"]>>> {
    return paginate(
      (cursor) =>
        this.api.listOrders(
          { ...params, ...commonHeaders(options), ...cursor },
          requestOverrides(options),
        ),
      params,
    );
  }
  create(params: CreateOrderParams, options?: MutationOptions): Promise<CreatedOrder> {
    validateCreateOrderParams(params);
    return this.api.createOrder(
      {
        createOrderRequest: params,
        ...commonHeaders(options),
        idempotencyKey: requiredIdempotencyKey(options),
      },
      requestOverrides(options),
    );
  }
  retrieve(orderId: string, options?: RequestOptions): Promise<Order> {
    return this.api.getOrder(
      { orderId: orderId, ...commonHeaders(options) },
      requestOverrides(options),
    );
  }
  cancel(
    orderId: string,
    params: CancelOrderParams,
    options?: MutationOptions,
  ): ReturnType<OrdersApi["cancelOrder"]> {
    return this.api.cancelOrder(
      {
        orderId: orderId,
        cancelOrderRequest: params,
        ...commonHeaders(options),
        idempotencyKey: requiredIdempotencyKey(options),
      },
      requestOverrides(options),
    );
  }
  actOnException(
    orderId: string,
    exceptionId: string,
    params: ActOnOrderExceptionParams,
    options?: MutationOptions,
  ): ReturnType<OrdersApi["actOnOrderException"]> {
    return this.api.actOnOrderException(
      {
        orderId: orderId,
        exceptionId: exceptionId,
        actOnOrderExceptionRequest: params,
        ...commonHeaders(options),
        idempotencyKey: requiredIdempotencyKey(options),
      },
      requestOverrides(options),
    );
  }
  listEvents(
    orderId: string,
    params: ListOrderEventsParams = {},
    options?: RequestOptions,
  ): ApiListPromise<Awaited<ReturnType<OrdersApi["listOrderEvents"]>>> {
    return paginate(
      (cursor) =>
        this.api.listOrderEvents(
          { ...params, orderId: orderId, ...commonHeaders(options), ...cursor },
          requestOverrides(options),
        ),
      params,
    );
  }
  preview(
    params: PreviewOrderParams,
    options?: RequestOptions,
  ): ReturnType<OrdersApi["previewOrder"]> {
    return this.api.previewOrder(
      { previewOrderRequest: params, ...commonHeaders(options) },
      requestOverrides(options),
    );
  }
  sign(
    orderId: string,
    params: SignOrderParams,
    options?: MutationOptions,
  ): ReturnType<OrdersApi["signOrder"]> {
    return this.api.signOrder(
      {
        orderId: orderId,
        signOrderRequest: params,
        ...commonHeaders(options),
        idempotencyKey: requiredIdempotencyKey(options),
      },
      requestOverrides(options),
    );
  }
  signAndSubmit(
    orderId: string,
    params: SignAndSubmitOrderParams,
    options?: MutationOptions,
  ): ReturnType<OrdersApi["signAndSubmitOrder"]> {
    return this.api.signAndSubmitOrder(
      {
        orderId: orderId,
        signAndSubmitOrderRequest: params,
        ...commonHeaders(options),
        idempotencyKey: requiredIdempotencyKey(options),
      },
      requestOverrides(options),
    );
  }
  submit(
    orderId: string,
    params: SubmitOrderParams,
    options?: MutationOptions,
  ): ReturnType<OrdersApi["submitOrder"]> {
    return this.api.submitOrder(
      {
        orderId: orderId,
        submitOrderRequest: params,
        ...commonHeaders(options),
        idempotencyKey: requiredIdempotencyKey(options),
      },
      requestOverrides(options),
    );
  }
  reject(
    orderId: string,
    params: RejectOrderParams,
    options?: MutationOptions,
  ): ReturnType<OrdersApi["rejectOrder"]> {
    return this.api.rejectOrder(
      {
        orderId: orderId,
        rejectOrderRequest: params,
        ...commonHeaders(options),
        idempotencyKey: requiredIdempotencyKey(options),
      },
      requestOverrides(options),
    );
  }
  addPrescription(
    orderId: string,
    params: AddOrderPrescriptionParams,
    options?: MutationOptions,
  ): ReturnType<OrdersApi["addOrderPrescription"]> {
    return this.api.addOrderPrescription(
      {
        orderId: orderId,
        addOrderPrescriptionRequest: params,
        ...commonHeaders(options),
        idempotencyKey: requiredIdempotencyKey(options),
      },
      requestOverrides(options),
    );
  }
  updatePrescription(
    orderId: string,
    prescriptionId: string,
    params: UpdateOrderPrescriptionParams,
    options?: MutationOptions,
  ): ReturnType<OrdersApi["updateOrderPrescription"]> {
    return this.api.updateOrderPrescription(
      {
        orderId: orderId,
        prescriptionId: prescriptionId,
        updateOrderPrescriptionRequest: params,
        ...commonHeaders(options),
        idempotencyKey: requiredIdempotencyKey(options),
      },
      requestOverrides(options),
    );
  }
  createBatch(
    params: CreateOrderBatchParams,
    options?: MutationOptions,
  ): ReturnType<OrdersApi["createOrderBatch"]> {
    validateCreateOrderBatchParams(params);
    return this.api.createOrderBatch(
      {
        createOrderBatchRequest: params,
        ...commonHeaders(options),
        idempotencyKey: requiredIdempotencyKey(options),
      },
      requestOverrides(options),
    );
  }
}
