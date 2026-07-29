// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.

import type { CatalogApi, ListCompoundersRequest } from "../apis/CatalogApi";

export type CompounderListParams = Omit<ListCompoundersRequest, "affinityVersion">;

export class CompoundersResource {
  constructor(
    private readonly api: CatalogApi,
    private readonly apiVersion: string,
  ) {}
  list(params: CompounderListParams = {}) {
    return this.api.listCompounders({ ...params, affinityVersion: this.apiVersion });
  }
}
