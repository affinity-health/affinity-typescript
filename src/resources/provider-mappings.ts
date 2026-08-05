// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.

import type { ListProviderMappingsRequest, ProviderMappingsApi } from "../apis/ProviderMappingsApi";
import type { CreateProviderMappingRequest } from "../models/CreateProviderMappingRequest";
import type { UpdateProviderMappingRequest } from "../models/UpdateProviderMappingRequest";
import type { MutationOptions } from "./request-options";

export class ProviderMappingsResource {
  constructor(private readonly api: ProviderMappingsApi) {}
  create(params: CreateProviderMappingRequest, options: MutationOptions) {
    return this.api.createProviderMapping({
      createProviderMappingRequest: params,
      idempotencyKey: options.idempotencyKey,
    });
  }
  retrieve(providerMappingId: string) {
    return this.api.getProviderMapping({
      providerMappingId,
    });
  }
  list(params: ListProviderMappingsRequest = {}) {
    return this.api.listProviderMappings(params);
  }
  revoke(providerMappingId: string, options: MutationOptions) {
    const params: UpdateProviderMappingRequest = { status: "revoked" };
    return this.api.updateProviderMapping({
      idempotencyKey: options.idempotencyKey,
      providerMappingId,
      updateProviderMappingRequest: params,
    });
  }
}
