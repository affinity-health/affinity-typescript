// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.

import type {
  CatalogApi,
  ListCatalogItemsRequest,
  ListShippingOptionsRequest,
} from "../apis/CatalogApi";

export type CatalogListParams = ListCatalogItemsRequest;

export class CatalogResource {
  constructor(private readonly api: CatalogApi) {}
  list(params: CatalogListParams = {}) {
    return this.api.listCatalogItems(params);
  }
  listShippingOptions(params: ListShippingOptionsRequest) {
    return this.api.listShippingOptions(params);
  }
}
