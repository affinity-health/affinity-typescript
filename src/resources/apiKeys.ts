// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.

import type { APIKeysApi, GetApiAccessRequest } from "../apis/APIKeysApi";
import type { Practice, Patient, Order, CreatedOrder, PracticeLocation } from "../domain";
import { paginate, type ApiListPromise } from "./pagination";
import {
  commonHeaders,
  requestOverrides,
  type MutationOptions,
  type RequestOptions,
} from "./shared";

export class APIKeysResource {
  constructor(private readonly api: APIKeysApi) {}
  retrieve(options?: RequestOptions): ReturnType<APIKeysApi["getApiAccess"]> {
    return this.api.getApiAccess({ ...commonHeaders(options) }, requestOverrides(options));
  }
}
