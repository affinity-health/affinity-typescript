// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.

import type { HostedSessionsApi } from "../apis/HostedSessionsApi";
import type { CreateHostedSessionRequest } from "../models/CreateHostedSessionRequest";
import type { MutationOptions } from "./request-options";

export class HostedSessionsResource {
  constructor(
    private readonly api: HostedSessionsApi,
    private readonly apiVersion: string,
  ) {}
  create(params: CreateHostedSessionRequest, options: MutationOptions) {
    return this.api.createHostedSession({
      affinityVersion: this.apiVersion,
      createHostedSessionRequest: params,
      idempotencyKey: options.idempotencyKey,
    });
  }
}
