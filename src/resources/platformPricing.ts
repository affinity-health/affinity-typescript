// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.

import type {
  PlatformPricingApi,
  PlatformPublicApiSellingPricesReadSellingPriceRequest,
  PlatformPublicApiSellingPricesUpdateSellingPriceOperationRequest,
} from "../apis/PlatformPricingApi";
import type { PlatformPublicApiSellingPricesUpdateSellingPriceRequest } from "../models/PlatformPublicApiSellingPricesUpdateSellingPriceRequest";
import {
  commonHeaders,
  requestOverrides,
  type MutationOptions,
  type RequestOptions,
  requiredIdempotencyKey,
} from "./shared";

export type PlatformPricingRetrieveParams = Omit<
  PlatformPublicApiSellingPricesReadSellingPriceRequest,
  | "catalogItemId"
  | "affinityVersion"
  | "idempotencyKey"
  | "affinityActorId"
  | "affinityActorType"
  | "xAffinityOrganizationId"
>;
export type PlatformPricingUpdateParams = Omit<
  PlatformPublicApiSellingPricesUpdateSellingPriceRequest,
  "baseVersion"
> & {
  baseVersion: NonNullable<PlatformPublicApiSellingPricesUpdateSellingPriceRequest["baseVersion"]>;
};

export class PlatformPricingResource {
  constructor(private readonly api: PlatformPricingApi) {}
  retrieve(
    catalogItemId: string,
    params: PlatformPricingRetrieveParams = {},
    options?: RequestOptions,
  ): ReturnType<PlatformPricingApi["platformPublicApiSellingPricesReadSellingPrice"]> {
    return this.api.platformPublicApiSellingPricesReadSellingPrice(
      { ...params, catalogItemId: catalogItemId, ...commonHeaders(options) },
      requestOverrides(options),
    );
  }
  update(
    catalogItemId: string,
    params: PlatformPricingUpdateParams,
    options: MutationOptions,
  ): ReturnType<PlatformPricingApi["platformPublicApiSellingPricesUpdateSellingPrice"]> {
    return this.api.platformPublicApiSellingPricesUpdateSellingPrice(
      {
        catalogItemId: catalogItemId,
        platformPublicApiSellingPricesUpdateSellingPriceRequest: params,
        ...commonHeaders(options),
        idempotencyKey: requiredIdempotencyKey(options),
      },
      requestOverrides(options),
    );
  }
}
