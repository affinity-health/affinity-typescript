// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.

import type { ListUsersRequest, UsersApi } from "../apis/UsersApi";
import type { CreateUserRequest } from "../models/CreateUserRequest";
import type { UpdateUserRequest } from "../models/UpdateUserRequest";
import type { MutationOptions } from "./request-options";

export class UsersResource {
  constructor(private readonly api: UsersApi) {}
  list(params: ListUsersRequest = {}) {
    return this.api.listUsers(params);
  }
  retrieve(userId: string) {
    return this.api.getUser({ userId });
  }
  create(params: CreateUserRequest, options: MutationOptions) {
    return this.api.createUser({
      createUserRequest: params,
      idempotencyKey: options.idempotencyKey,
    });
  }
  update(userId: string, params: UpdateUserRequest, options: MutationOptions) {
    return this.api.updateUser({
      idempotencyKey: options.idempotencyKey,
      updateUserRequest: params,
      userId,
    });
  }
}
