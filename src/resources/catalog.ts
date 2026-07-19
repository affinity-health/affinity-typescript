// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.

import type { CatalogApi, ListCatalogItemsRequest } from "../apis/CatalogApi";

export type CatalogListParams = Omit<ListCatalogItemsRequest, "affinityVersion">;

export class CatalogResource {
  constructor(
    private readonly api: CatalogApi,
    private readonly apiVersion: string,
  ) {}
  list(params: CatalogListParams = {}) {
    return this.api.listCatalogItems({ ...params, affinityVersion: this.apiVersion });
  }
}
