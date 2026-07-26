// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.

import type { PortalSessionsApi } from "../apis/PortalSessionsApi";
import type { CreatePortalSessionRequest } from "../models/CreatePortalSessionRequest";
import type { MutationOptions } from "./request-options";

export class PortalSessionsResource {
  constructor(
    private readonly api: PortalSessionsApi,
    private readonly apiVersion: string,
  ) {}
  create(params: CreatePortalSessionRequest, options: MutationOptions) {
    return this.api.createPortalSession({
      affinityVersion: this.apiVersion,
      createPortalSessionRequest: params,
      idempotencyKey: options.idempotencyKey,
    });
  }
}
