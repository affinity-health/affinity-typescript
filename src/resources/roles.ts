// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.

import type { RolesApi } from "../apis/RolesApi";
import type { CreatePracticeRoleRequest } from "../models/CreatePracticeRoleRequest";
import type { UpdatePracticeRoleRequest } from "../models/UpdatePracticeRoleRequest";
import type { MutationOptions } from "./request-options";

export class RolesResource {
  constructor(
    private readonly api: RolesApi,
    private readonly apiVersion: string,
  ) {}
  list(practiceId: string) {
    return this.api.listPracticeRoles({ affinityVersion: this.apiVersion, practiceId });
  }
  create(practiceId: string, params: CreatePracticeRoleRequest, options: MutationOptions) {
    return this.api.createPracticeRole({
      affinityVersion: this.apiVersion,
      createPracticeRoleRequest: params,
      idempotencyKey: options.idempotencyKey,
      practiceId,
    });
  }
  update(
    practiceId: string,
    roleId: string,
    params: UpdatePracticeRoleRequest,
    options: MutationOptions,
  ) {
    return this.api.updatePracticeRole({
      affinityVersion: this.apiVersion,
      idempotencyKey: options.idempotencyKey,
      practiceId,
      roleId,
      updatePracticeRoleRequest: params,
    });
  }
  delete(practiceId: string, roleId: string, options: MutationOptions) {
    return this.api.deletePracticeRole({
      affinityVersion: this.apiVersion,
      idempotencyKey: options.idempotencyKey,
      practiceId,
      roleId,
    });
  }
}
