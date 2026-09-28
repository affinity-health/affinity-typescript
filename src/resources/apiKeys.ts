// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.

import type {
  APIKeysApi,
  CreatePlatformPracticeApiKeyOperationRequest,
  GetApiAccessRequest,
} from "../apis/APIKeysApi";
import type { Practice, Patient, Order, CreatedOrder, PracticeLocation } from "../domain";
import { paginate, type ApiListPromise } from "./pagination";
import type { CreatePlatformPracticeApiKeyRequest } from "../models/CreatePlatformPracticeApiKeyRequest";
import {
  commonHeaders,
  requestOverrides,
  type MutationOptions,
  type RequestOptions,
  requiredIdempotencyKey,
} from "./shared";

export type CreatePlatformPracticeApiKeyParams = Omit<
  CreatePlatformPracticeApiKeyRequest,
  "name"
> & { name: NonNullable<CreatePlatformPracticeApiKeyRequest["name"]> };

export class APIKeysResource {
  constructor(private readonly api: APIKeysApi) {}
  createPlatformPracticeKey(
    practiceId: string,
    params: CreatePlatformPracticeApiKeyParams,
    options?: MutationOptions,
  ): ReturnType<APIKeysApi["createPlatformPracticeApiKey"]> {
    return this.api.createPlatformPracticeApiKey(
      {
        practiceId: practiceId,
        createPlatformPracticeApiKeyRequest: params,
        ...commonHeaders(options),
        idempotencyKey: requiredIdempotencyKey(options),
      },
      requestOverrides(options),
    );
  }
  retrieve(options?: RequestOptions): ReturnType<APIKeysApi["getApiAccess"]> {
    return this.api.getApiAccess({ ...commonHeaders(options) }, requestOverrides(options));
  }
}
