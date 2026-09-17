// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.

import type {
  PracticesApi,
  ListPracticesRequest,
  CreatePracticeOperationRequest,
  GetPracticeRequest,
  UpdatePracticeOperationRequest,
} from "../apis/PracticesApi";
import type { Practice, Patient, Order, CreatedOrder, PracticeLocation } from "../domain";
import { paginate, type ApiListPromise } from "./pagination";
import type { CreatePracticeRequest } from "../models/CreatePracticeRequest";
import type { UpdatePracticeRequest } from "../models/UpdatePracticeRequest";
import {
  commonHeaders,
  requestOverrides,
  type MutationOptions,
  type RequestOptions,
} from "./shared";

export type ListPracticesParams = Omit<
  ListPracticesRequest,
  | "affinityVersion"
  | "idempotencyKey"
  | "affinityActorId"
  | "affinityActorType"
  | "xAffinityOrganizationId"
>;
export type CreatePracticeParams = Omit<
  CreatePracticeRequest,
  "address" | "attestations" | "name"
> & {
  address: NonNullable<CreatePracticeRequest["address"]>;
  attestations: NonNullable<CreatePracticeRequest["attestations"]>;
  name: NonNullable<CreatePracticeRequest["name"]>;
};
export type UpdatePracticeParams = UpdatePracticeRequest;

export class PracticesResource {
  constructor(private readonly api: PracticesApi) {}
  list(
    params: ListPracticesParams = {},
    options?: RequestOptions,
  ): ApiListPromise<Awaited<ReturnType<PracticesApi["listPractices"]>>> {
    return paginate(
      (cursor) =>
        this.api.listPractices(
          { ...params, ...commonHeaders(options), ...cursor },
          requestOverrides(options),
        ),
      params,
    );
  }
  create(params: CreatePracticeParams, options?: RequestOptions): Promise<Practice> {
    return this.api.createPractice(
      { createPracticeRequest: params, ...commonHeaders(options) },
      requestOverrides(options),
    );
  }
  retrieve(practiceId: string, options?: RequestOptions): Promise<Practice> {
    return this.api.getPractice(
      { practiceId: practiceId, ...commonHeaders(options) },
      requestOverrides(options),
    );
  }
  update(
    practiceId: string,
    params: UpdatePracticeParams,
    options?: RequestOptions,
  ): Promise<Practice> {
    return this.api.updatePractice(
      { practiceId: practiceId, updatePracticeRequest: params, ...commonHeaders(options) },
      requestOverrides(options),
    );
  }
}
