// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.

import type { AccountApi, GetAccountRequest } from "../apis/AccountApi";
import type { Practice, Patient, Order, CreatedOrder, PracticeLocation } from "../domain";
import { paginate, type ApiListPromise } from "./pagination";
import {
  commonHeaders,
  requestOverrides,
  type MutationOptions,
  type RequestOptions,
} from "./shared";

export type GetAccountParams = Omit<
  GetAccountRequest,
  | "affinityVersion"
  | "idempotencyKey"
  | "affinityActorId"
  | "affinityActorType"
  | "xAffinityOrganizationId"
>;

export class AccountResource {
  constructor(private readonly api: AccountApi) {}
  retrieve(
    params: GetAccountParams = {},
    options?: RequestOptions,
  ): ReturnType<AccountApi["getAccount"]> {
    return this.api.getAccount({ ...params, ...commonHeaders(options) }, requestOverrides(options));
  }
}
