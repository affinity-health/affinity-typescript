// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.

import type {
  PracticesApi,
  ListPracticesRequest,
  CreatePracticeOperationRequest,
  GetPracticeRequest,
  UpdatePracticeOperationRequest,
} from "../apis/PracticesApi";
import type { CreatePracticeRequest } from "../models/CreatePracticeRequest";
import type { UpdatePracticeRequest } from "../models/UpdatePracticeRequest";
import {
  commonHeaders,
  requestOverrides,
  type MutationOptions,
  type RequestOptions,
  requiredIdempotencyKey,
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
  ): ReturnType<PracticesApi["listPractices"]> {
    return this.api.listPractices(
      { ...params, ...commonHeaders(options) },
      requestOverrides(options),
    );
  }
  create(
    params: CreatePracticeParams,
    options: MutationOptions,
  ): ReturnType<PracticesApi["createPractice"]> {
    return this.api.createPractice(
      {
        createPracticeRequest: params,
        ...commonHeaders(options),
        idempotencyKey: requiredIdempotencyKey(options),
      },
      requestOverrides(options),
    );
  }
  retrieve(practiceId: string, options?: RequestOptions): ReturnType<PracticesApi["getPractice"]> {
    return this.api.getPractice(
      { practiceId: practiceId, ...commonHeaders(options) },
      requestOverrides(options),
    );
  }
  update(
    practiceId: string,
    params: UpdatePracticeParams,
    options: MutationOptions,
  ): ReturnType<PracticesApi["updatePractice"]> {
    return this.api.updatePractice(
      {
        practiceId: practiceId,
        updatePracticeRequest: params,
        ...commonHeaders(options),
        idempotencyKey: requiredIdempotencyKey(options),
      },
      requestOverrides(options),
    );
  }
}
