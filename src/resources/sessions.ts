// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.

import type {
  SessionsApi,
  CreateComponentSessionOperationRequest,
  CreateHostedSessionOperationRequest,
} from "../apis/SessionsApi";
import type { Practice, Patient, Order, CreatedOrder, PracticeLocation } from "../domain";
import { paginate, type ApiListPromise } from "./pagination";
import type { CreateComponentSessionRequest } from "../models/CreateComponentSessionRequest";
import type { CreateHostedSessionRequest } from "../models/CreateHostedSessionRequest";
import {
  commonHeaders,
  requestOverrides,
  type MutationOptions,
  type RequestOptions,
  requiredIdempotencyKey,
} from "./shared";

export type CreateComponentSessionParams = Omit<
  CreateComponentSessionRequest,
  "allowedOrigin" | "components" | "consent" | "context" | "practiceId" | "userId"
> & {
  allowedOrigin: NonNullable<CreateComponentSessionRequest["allowedOrigin"]>;
  components: NonNullable<CreateComponentSessionRequest["components"]>;
  consent: NonNullable<CreateComponentSessionRequest["consent"]>;
  context: NonNullable<CreateComponentSessionRequest["context"]>;
  practiceId: NonNullable<CreateComponentSessionRequest["practiceId"]>;
  userId: NonNullable<CreateComponentSessionRequest["userId"]>;
};
export type CreateHostedSessionParams = Omit<
  CreateHostedSessionRequest,
  "flow" | "orderId" | "practiceId"
> & {
  flow: NonNullable<CreateHostedSessionRequest["flow"]>;
  orderId: NonNullable<CreateHostedSessionRequest["orderId"]>;
  practiceId: NonNullable<CreateHostedSessionRequest["practiceId"]>;
};

export class SessionsResource {
  constructor(private readonly api: SessionsApi) {}
  createComponent(
    params: CreateComponentSessionParams,
    options?: MutationOptions,
  ): ReturnType<SessionsApi["createComponentSession"]> {
    return this.api.createComponentSession(
      {
        createComponentSessionRequest: params,
        ...commonHeaders(options),
        idempotencyKey: requiredIdempotencyKey(options),
      },
      requestOverrides(options),
    );
  }
  createHosted(
    params: CreateHostedSessionParams,
    options?: MutationOptions,
  ): ReturnType<SessionsApi["createHostedSession"]> {
    return this.api.createHostedSession(
      {
        createHostedSessionRequest: params,
        ...commonHeaders(options),
        idempotencyKey: requiredIdempotencyKey(options),
      },
      requestOverrides(options),
    );
  }
}
