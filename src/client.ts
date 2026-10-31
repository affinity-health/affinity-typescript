// Written by hand: the generated client with explicit defaults and a JSON check. The generated
// methods already default to production and 60 seconds, but `client.fetch()` (raw requests) only
// reads the options, so without these it had no base URL and no timeout.
import { AffinityClient as GeneratedAffinityClient } from "./generated/Client.js";
import { AffinityEnvironment } from "./generated/environments.js";
import { AffinityError } from "./generated/errors/index.js";

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
      fetch: requireJson(options.fetch),
    });
  }
}

// Every Affinity response is JSON. The generated fetcher resolves a success response that is not
// JSON (a proxy's HTML page, an empty body) as the operation's result, so a caller would receive
// something that is not the record. Refuse it at the transport, for every request.
function requireJson(fetchFn: typeof fetch | undefined): typeof fetch {
  return (async (input: RequestInfo | URL, init?: RequestInit) => {
    const response = await (fetchFn ?? fetch)(input, init);
    if (!response.ok) return response;
    const text = await response.clone().text();
    try {
      if (text.length > 0) {
        JSON.parse(text);
        return response;
      }
    } catch {}
    const contentType = response.headers.get("content-type") ?? "no content type";
    throw new AffinityError({
      message: `Affinity answered ${response.status} (${contentType}) with ${
        text.length > 0 ? "a body that is not JSON" : "an empty body"
      }. A proxy or gateway may have answered instead of Affinity.`,
      statusCode: response.status,
      body: text,
    });
  }) as typeof fetch;
}
