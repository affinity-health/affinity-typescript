// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.

import type { MembershipsApi } from "../apis/MembershipsApi";
import type { CreatePracticeMembershipRequest } from "../models/CreatePracticeMembershipRequest";
import type { UpdatePracticeMembershipRequest } from "../models/UpdatePracticeMembershipRequest";
import type { MutationOptions } from "./request-options";

export class MembershipsResource {
  constructor(private readonly api: MembershipsApi) {}
  list(practiceId: string) {
    return this.api.listPracticeMemberships({ practiceId });
  }
  create(practiceId: string, params: CreatePracticeMembershipRequest, options: MutationOptions) {
    return this.api.createPracticeMembership({
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
      idempotencyKey: options.idempotencyKey,
      membershipId,
      practiceId,
      updatePracticeMembershipRequest: params,
    });
  }
}
