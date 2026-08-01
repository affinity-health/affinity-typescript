// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.

import type { PrescriptionSigningSessionsApi } from "../apis/PrescriptionSigningSessionsApi";
import type { CreatePrescriptionSigningSessionRequest } from "../models/CreatePrescriptionSigningSessionRequest";
import type { MutationOptions } from "./request-options";

export class PrescriptionSigningSessionsResource {
  constructor(
    private readonly api: PrescriptionSigningSessionsApi,
    private readonly apiVersion: string,
  ) {}
  create(params: CreatePrescriptionSigningSessionRequest, options: MutationOptions) {
    return this.api.createPrescriptionSigningSession({
      affinityVersion: this.apiVersion,
      createPrescriptionSigningSessionRequest: params,
      idempotencyKey: options.idempotencyKey,
    });
  }
}
