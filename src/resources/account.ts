// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.

import type { APIKeysApi } from "../apis/APIKeysApi";
import type { PlatformsApi } from "../apis/PlatformsApi";

export class AccountResource {
  constructor(
    private readonly accessApi: APIKeysApi,
    private readonly platformsApi: PlatformsApi,
    private readonly apiVersion: string,
  ) {}
  retrieveAccess() {
    return this.accessApi.getApiAccess({ affinityVersion: this.apiVersion });
  }
  retrieve() {
    return this.platformsApi.getAccount({ affinityVersion: this.apiVersion });
  }
}
