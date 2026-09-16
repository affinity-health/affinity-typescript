// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.

import type {
  OrdersApi,
  CancelOrderOperationRequest,
  ListOrderEventsRequest,
  ActOnOrderExceptionOperationRequest,
  GetOrderRequest,
  ListOrdersRequest,
  CreateOrderOperationRequest,
  RejectOrderOperationRequest,
  SignOrderOperationRequest,
  SubmitOrderOperationRequest,
  CreateOrderBatchOperationRequest,
  AddOrderPrescriptionOperationRequest,
  UpdateOrderPrescriptionOperationRequest,
} from "../apis/OrdersApi";
import type { CancelOrderRequest } from "../models/CancelOrderRequest";
import type { ActOnOrderExceptionRequest } from "../models/ActOnOrderExceptionRequest";
import type { CreateOrderRequest } from "../models/CreateOrderRequest";
import type { RejectOrderRequest } from "../models/RejectOrderRequest";
import type { SignOrderRequest } from "../models/SignOrderRequest";
import type { SubmitOrderRequest } from "../models/SubmitOrderRequest";
import type { CreateOrderBatchRequest } from "../models/CreateOrderBatchRequest";
import type { AddOrderPrescriptionRequest } from "../models/AddOrderPrescriptionRequest";
import type { UpdateOrderPrescriptionRequest } from "../models/UpdateOrderPrescriptionRequest";
import {
  commonHeaders,
  requestOverrides,
  type MutationOptions,
  type RequestOptions,
  requiredIdempotencyKey,
  actorHeaders,
  type AffinityActor,
} from "./shared";

export type CancelOrderParams = Omit<CancelOrderRequest, "reason"> & {
  reason: NonNullable<CancelOrderRequest["reason"]>;
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
export type ActOnOrderExceptionParams = Omit<ActOnOrderExceptionRequest, "action"> & {
  action: NonNullable<ActOnOrderExceptionRequest["action"]>;
};
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
export type RejectOrderParams = Omit<
  RejectOrderRequest,
  "practiceId" | "userId" | "reason" | "expectedVersions"
> & {
  practiceId: NonNullable<RejectOrderRequest["practiceId"]>;
  userId: NonNullable<RejectOrderRequest["userId"]>;
  reason: NonNullable<RejectOrderRequest["reason"]>;
  expectedVersions: NonNullable<RejectOrderRequest["expectedVersions"]>;
};
export type SignOrderParams = Omit<
  SignOrderRequest,
  "practiceId" | "userId" | "signatureAttestation" | "expectedVersions"
> & {
  practiceId: NonNullable<SignOrderRequest["practiceId"]>;
  userId: NonNullable<SignOrderRequest["userId"]>;
  signatureAttestation: NonNullable<SignOrderRequest["signatureAttestation"]>;
  expectedVersions: NonNullable<SignOrderRequest["expectedVersions"]>;
};
export type SubmitOrderParams = Omit<SubmitOrderRequest, "practiceId" | "userId"> & {
  practiceId: NonNullable<SubmitOrderRequest["practiceId"]>;
  userId: NonNullable<SubmitOrderRequest["userId"]>;
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
  constructor(
    private readonly api: OrdersApi,
    private readonly defaultActor?: AffinityActor,
  ) {}
  cancel(
    orderId: string,
    params: CancelOrderParams,
    options: MutationOptions,
  ): ReturnType<OrdersApi["cancelOrder"]> {
    return this.api.cancelOrder(
      {
        orderId: orderId,
        cancelOrderRequest: params,
        ...commonHeaders(options),
        idempotencyKey: requiredIdempotencyKey(options),
        ...actorHeaders(options, this.defaultActor),
      },
      requestOverrides(options),
    );
  }
  listEvents(
    orderId: string,
    params: ListOrderEventsParams = {},
    options?: RequestOptions,
  ): ReturnType<OrdersApi["listOrderEvents"]> {
    return this.api.listOrderEvents(
      {
        ...params,
        orderId: orderId,
        ...commonHeaders(options),
        ...actorHeaders(options, this.defaultActor),
      },
      requestOverrides(options),
    );
  }
  actOnException(
    orderId: string,
    exceptionId: string,
    params: ActOnOrderExceptionParams,
    options: MutationOptions,
  ): ReturnType<OrdersApi["actOnOrderException"]> {
    return this.api.actOnOrderException(
      {
        orderId: orderId,
        exceptionId: exceptionId,
        actOnOrderExceptionRequest: params,
        ...commonHeaders(options),
        idempotencyKey: requiredIdempotencyKey(options),
        ...actorHeaders(options, this.defaultActor),
      },
      requestOverrides(options),
    );
  }
  retrieve(orderId: string, options?: RequestOptions): ReturnType<OrdersApi["getOrder"]> {
    return this.api.getOrder(
      { orderId: orderId, ...commonHeaders(options), ...actorHeaders(options, this.defaultActor) },
      requestOverrides(options),
    );
  }
  list(
    params: ListOrdersParams = {},
    options?: RequestOptions,
  ): ReturnType<OrdersApi["listOrders"]> {
    return this.api.listOrders(
      { ...params, ...commonHeaders(options), ...actorHeaders(options, this.defaultActor) },
      requestOverrides(options),
    );
  }
  create(
    params: CreateOrderParams,
    options: MutationOptions,
  ): ReturnType<OrdersApi["createOrder"]> {
    validateCreateOrderParams(params);
    return this.api.createOrder(
      {
        createOrderRequest: params,
        ...commonHeaders(options),
        idempotencyKey: requiredIdempotencyKey(options),
        ...actorHeaders(options, this.defaultActor),
      },
      requestOverrides(options),
    );
  }
  reject(
    orderId: string,
    params: RejectOrderParams,
    options: MutationOptions,
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
  sign(
    orderId: string,
    params: SignOrderParams,
    options: MutationOptions,
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
  submit(
    orderId: string,
    params: SubmitOrderParams,
    options: MutationOptions,
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
  createBatch(
    params: CreateOrderBatchParams,
    options: MutationOptions,
  ): ReturnType<OrdersApi["createOrderBatch"]> {
    validateCreateOrderBatchParams(params);
    return this.api.createOrderBatch(
      {
        createOrderBatchRequest: params,
        ...commonHeaders(options),
        idempotencyKey: requiredIdempotencyKey(options),
        ...actorHeaders(options, this.defaultActor),
      },
      requestOverrides(options),
    );
  }
  addPrescription(
    orderId: string,
    params: AddOrderPrescriptionParams,
    options: MutationOptions,
  ): ReturnType<OrdersApi["addOrderPrescription"]> {
    return this.api.addOrderPrescription(
      {
        orderId: orderId,
        addOrderPrescriptionRequest: params,
        ...commonHeaders(options),
        idempotencyKey: requiredIdempotencyKey(options),
        ...actorHeaders(options, this.defaultActor),
      },
      requestOverrides(options),
    );
  }
  updatePrescription(
    orderId: string,
    prescriptionId: string,
    params: UpdateOrderPrescriptionParams,
    options: MutationOptions,
  ): ReturnType<OrdersApi["updateOrderPrescription"]> {
    return this.api.updateOrderPrescription(
      {
        orderId: orderId,
        prescriptionId: prescriptionId,
        updateOrderPrescriptionRequest: params,
        ...commonHeaders(options),
        idempotencyKey: requiredIdempotencyKey(options),
        ...actorHeaders(options, this.defaultActor),
      },
      requestOverrides(options),
    );
  }
}
