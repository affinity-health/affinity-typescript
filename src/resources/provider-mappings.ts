// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.

import type { ProviderMappingsApi } from "../apis/ProviderMappingsApi";
import type { CreateProviderMappingRequest } from "../models/CreateProviderMappingRequest";
import type { UpdateProviderMappingRequest } from "../models/UpdateProviderMappingRequest";
import type { MutationOptions } from "./request-options";

export class ProviderMappingsResource {
  constructor(
    private readonly api: ProviderMappingsApi,
    private readonly apiVersion: string,
  ) {}
  create(params: CreateProviderMappingRequest, options: MutationOptions) {
    return this.api.createProviderMapping({
      affinityVersion: this.apiVersion,
      createProviderMappingRequest: params,
      idempotencyKey: options.idempotencyKey,
    });
  }
  retrieve(providerMappingId: string) {
    return this.api.getProviderMapping({
      affinityVersion: this.apiVersion,
      providerMappingId,
    });
  }
  revoke(providerMappingId: string, options: MutationOptions) {
    const params: UpdateProviderMappingRequest = { status: "revoked" };
    return this.api.updateProviderMapping({
      affinityVersion: this.apiVersion,
      idempotencyKey: options.idempotencyKey,
      providerMappingId,
      updateProviderMappingRequest: params,
    });
  }
}
