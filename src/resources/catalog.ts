// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.

import type {
  CatalogApi,
  ListCatalogItemsRequest,
  ListPharmaciesRequest,
  ListShippingOptionsRequest,
} from "../apis/CatalogApi";
import type { Practice, Patient, Order, CreatedOrder, PracticeLocation } from "../domain";
import { paginate, type ApiListPromise } from "./pagination";
import {
  commonHeaders,
  requestOverrides,
  type MutationOptions,
  type RequestOptions,
} from "./shared";

export type ListCatalogItemsParams = Omit<
  ListCatalogItemsRequest,
  | "affinityVersion"
  | "idempotencyKey"
  | "affinityActorId"
  | "affinityActorType"
  | "xAffinityOrganizationId"
>;
export type ListPharmaciesParams = Omit<
  ListPharmaciesRequest,
  | "affinityVersion"
  | "idempotencyKey"
  | "affinityActorId"
  | "affinityActorType"
  | "xAffinityOrganizationId"
>;
export type ListShippingOptionsParams = Omit<
  ListShippingOptionsRequest,
  | "catalogItemId"
  | "affinityVersion"
  | "idempotencyKey"
  | "affinityActorId"
  | "affinityActorType"
  | "xAffinityOrganizationId"
  | "destinationState"
> & { destinationState: NonNullable<ListShippingOptionsRequest["destinationState"]> };

export class CatalogResource {
  constructor(private readonly api: CatalogApi) {}
  list(
    params: ListCatalogItemsParams = {},
    options?: RequestOptions,
  ): ApiListPromise<Awaited<ReturnType<CatalogApi["listCatalogItems"]>>> {
    return paginate(
      (cursor) =>
        this.api.listCatalogItems(
          { ...params, ...commonHeaders(options), ...cursor },
          requestOverrides(options),
        ),
      params,
    );
  }
  listPharmacies(
    params: ListPharmaciesParams = {},
    options?: RequestOptions,
  ): ApiListPromise<Awaited<ReturnType<CatalogApi["listPharmacies"]>>> {
    return paginate(
      (cursor) =>
        this.api.listPharmacies(
          { ...params, ...commonHeaders(options), ...cursor },
          requestOverrides(options),
        ),
      params,
    );
  }
  listShippingOptions(
    catalogItemId: string,
    params: ListShippingOptionsParams,
    options?: RequestOptions,
  ): ReturnType<CatalogApi["listShippingOptions"]> {
    return this.api.listShippingOptions(
      { ...params, catalogItemId: catalogItemId, ...commonHeaders(options) },
      requestOverrides(options),
    );
  }
}
