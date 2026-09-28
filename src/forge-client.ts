// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.

import { AffinityApiClient as GeneratedClient } from "./forge/index.js";

/** Generated resource clients with Affinity's release version and conservative retry defaults. */
export class AffinityApiClient extends GeneratedClient {
  constructor(options: GeneratedClient.Options) {
    super({
      ...options,
      affinityVersion: options.affinityVersion ?? "2026-09-28",
      maxRetries: options.maxRetries ?? 0,
    });
  }
}
