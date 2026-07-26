// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.

import type { ListUsersRequest, UsersApi } from "../apis/UsersApi";
import type { CreateUserRequest } from "../models/CreateUserRequest";
import type { UpdateUserRequest } from "../models/UpdateUserRequest";
import type { MutationOptions } from "./request-options";

export class UsersResource {
  constructor(
    private readonly api: UsersApi,
    private readonly apiVersion: string,
  ) {}
  list(params: Omit<ListUsersRequest, "affinityVersion"> = {}) {
    return this.api.listUsers({ ...params, affinityVersion: this.apiVersion });
  }
  retrieve(userId: string) {
    return this.api.getUser({ affinityVersion: this.apiVersion, userId });
  }
  create(params: CreateUserRequest, options: MutationOptions) {
    return this.api.createUser({
      affinityVersion: this.apiVersion,
      createUserRequest: params,
      idempotencyKey: options.idempotencyKey,
    });
  }
  update(userId: string, params: UpdateUserRequest, options: MutationOptions) {
    return this.api.updateUser({
      affinityVersion: this.apiVersion,
      idempotencyKey: options.idempotencyKey,
      updateUserRequest: params,
      userId,
    });
  }
}
