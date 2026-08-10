// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.

import type { CatalogApi, ListCompoundersRequest } from "../apis/CatalogApi";
import { cursorPage } from "./cursor-page";

export type CompounderListParams = ListCompoundersRequest;

export class CompoundersResource {
  constructor(private readonly api: CatalogApi) {}
  list(params: CompounderListParams = {}) {
    return cursorPage(params, (page) => this.api.listCompounders(page));
  }
}
