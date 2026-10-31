// Written by hand: the generated client with explicit defaults. The generated methods already
// default to production and 60 seconds, but `client.fetch()` (raw requests) only reads the
// options, so without these it had no base URL and no timeout.
import { AffinityClient as GeneratedAffinityClient } from "./generated/Client.js";
import { AffinityEnvironment } from "./generated/environments.js";

export declare namespace AffinityClient {
  export type Options = GeneratedAffinityClient.Options;
  export type RequestOptions = GeneratedAffinityClient.RequestOptions;
}

/** The Affinity API client. Production (`https://api.affinityrx.com`) unless `baseUrl` is set. */
export class AffinityClient extends GeneratedAffinityClient {
  constructor(options: AffinityClient.Options) {
    super({
      ...options,
      environment: options.environment ?? AffinityEnvironment.Default,
      timeoutInSeconds: options.timeoutInSeconds ?? 60,
    });
  }
}
// The bundle renames this class to avoid the generated one's name; logs should show the real name.
Object.defineProperty(AffinityClient, "name", { value: "AffinityClient" });
