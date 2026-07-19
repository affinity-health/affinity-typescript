// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.

import type { ListPracticesRequest, PracticesApi } from "../apis/PracticesApi";
import type { CreatePracticeRequest } from "../models/CreatePracticeRequest";
import type { UpdatePracticeRequest } from "../models/UpdatePracticeRequest";
import type { MutationOptions } from "./request-options";

export class PracticesResource {
  constructor(
    private readonly api: PracticesApi,
    private readonly apiVersion: string,
  ) {}
  list(params: Omit<ListPracticesRequest, "affinityVersion"> = {}) {
    return this.api.listPractices({ ...params, affinityVersion: this.apiVersion });
  }
  retrieve(practiceId: string) {
    return this.api.getPractice({ affinityVersion: this.apiVersion, practiceId });
  }
  create(params: CreatePracticeRequest, options: MutationOptions) {
    return this.api.createPractice({
      createPracticeRequest: params,
      affinityVersion: this.apiVersion,
      idempotencyKey: options.idempotencyKey,
    });
  }
  update(practiceId: string, params: UpdatePracticeRequest, options: MutationOptions) {
    return this.api.updatePractice({
      affinityVersion: this.apiVersion,
      idempotencyKey: options.idempotencyKey,
      practiceId,
      updatePracticeRequest: params,
    });
  }
}
