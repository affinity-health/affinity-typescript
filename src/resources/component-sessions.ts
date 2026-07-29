// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.

import type { ComponentSessionsApi } from "../apis/ComponentSessionsApi";
import type { CreateComponentSessionRequest } from "../models/CreateComponentSessionRequest";
import type { MutationOptions } from "./request-options";

export class ComponentSessionsResource {
  constructor(
    private readonly api: ComponentSessionsApi,
    private readonly apiVersion: string,
  ) {}
  create(params: CreateComponentSessionRequest, options: MutationOptions) {
    return this.api.createComponentSession({
      affinityVersion: this.apiVersion,
      createComponentSessionRequest: params,
      idempotencyKey: options.idempotencyKey,
    });
  }
}
