// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.

import type { MembershipsApi } from "../apis/MembershipsApi";
import type { CreatePracticeMembershipRequest } from "../models/CreatePracticeMembershipRequest";
import type { UpdatePracticeMembershipRequest } from "../models/UpdatePracticeMembershipRequest";
import type { MutationOptions } from "./request-options";

export class MembershipsResource {
  constructor(
    private readonly api: MembershipsApi,
    private readonly apiVersion: string,
  ) {}
  list(practiceId: string) {
    return this.api.listPracticeMemberships({ affinityVersion: this.apiVersion, practiceId });
  }
  create(practiceId: string, params: CreatePracticeMembershipRequest, options: MutationOptions) {
    return this.api.createPracticeMembership({
      affinityVersion: this.apiVersion,
      createPracticeMembershipRequest: params,
      idempotencyKey: options.idempotencyKey,
      practiceId,
    });
  }
  update(
    practiceId: string,
    membershipId: string,
    params: UpdatePracticeMembershipRequest,
    options: MutationOptions,
  ) {
    return this.api.updatePracticeMembership({
      affinityVersion: this.apiVersion,
      idempotencyKey: options.idempotencyKey,
      membershipId,
      practiceId,
      updatePracticeMembershipRequest: params,
    });
  }
}
