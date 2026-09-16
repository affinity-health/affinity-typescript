// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.

import type {
  CatalogApi,
  ListCatalogItemsRequest,
  ListPharmaciesRequest,
  ListShippingOptionsRequest,
} from "../apis/CatalogApi";
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
  ): ReturnType<CatalogApi["listCatalogItems"]> {
    return this.api.listCatalogItems(
      { ...params, ...commonHeaders(options) },
      requestOverrides(options),
    );
  }
  listPharmacies(
    params: ListPharmaciesParams = {},
    options?: RequestOptions,
  ): ReturnType<CatalogApi["listPharmacies"]> {
    return this.api.listPharmacies(
      { ...params, ...commonHeaders(options) },
      requestOverrides(options),
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
