import { createTransport } from "./transport";
import { affinityConnectionError, affinityErrorFromResponse } from "./errors";

const sdkVersion = "__AFFINITY_SDK_VERSION__";
export const affinityApiVersion = "__AFFINITY_API_VERSION__" as const;

export interface SDKOptions {
  baseUrl?: string;
  fetch?: typeof fetch;
  timeout?: number;
  maxNetworkRetries?: number;
  apiVersion?: string;
}
export interface SDKRequestOptions {
  signal?: AbortSignal;
}
export type RequiredKeyOptions = SDKRequestOptions & { idempotencyKey: string };

type Operation = {
  path: string;
  verb: string;
  ids: readonly string[];
  query: readonly string[];
  body: boolean;
  idempotency: boolean;
};
class SDKContext {
  private readonly fetcher: typeof fetch;
  private readonly baseUrl: string;
  constructor(
    private readonly apiKey: string,
    private readonly options: SDKOptions,
  ) {
    if (!apiKey.trim()) throw new Error("An API key is required");
    this.baseUrl = (options.baseUrl ?? "https://api.affinityrx.com").replace(/\/$/, "");
    this.fetcher = createTransport(options.fetch ?? globalThis.fetch, {
      timeout: options.timeout ?? 60_000,
      maxNetworkRetries: options.maxNetworkRetries ?? 0,
    });
  }
  async call<T>(
    op: Operation,
    ids: string[],
    params: Record<string, unknown> = {},
    options: SDKRequestOptions | RequiredKeyOptions = {},
  ): Promise<T> {
    options.signal?.throwIfAborted();
    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.apiKey}`,
      "Affinity-Version": this.options.apiVersion ?? affinityApiVersion,
      "User-Agent": `affinity-typescript/${sdkVersion}`,
    };
    if (op.idempotency) {
      const key = "idempotencyKey" in options ? options.idempotencyKey : undefined;
      if (typeof key !== "string" || !/^[\x21-\x7e]{1,255}$/u.test(key))
        throw new Error(
          "A persisted idempotencyKey of 1–255 printable ASCII characters is required",
        );
      headers["Idempotency-Key"] = key;
    }
    let path = op.path;
    if (ids.length !== op.ids.length) throw new Error("Missing resource ID");
    op.ids.forEach((name, index) => {
      const id = ids[index];
      if (typeof id !== "string" || !id.trim()) throw new Error(`${name} is required`);
      path = path.replace(`{${name}}`, encodeURIComponent(id));
    });
    const query = new URLSearchParams();
    for (const name of op.query) {
      const value = params[name];
      if (value !== undefined && value !== null)
        for (const item of Array.isArray(value) ? value : [value]) query.append(name, String(item));
    }
    let response: Response;
    try {
      response = await this.fetcher(this.baseUrl + path + (query.size ? `?${query}` : ""), {
        method: op.verb,
        redirect: "error",
        headers: { ...headers, ...(op.body ? { "Content-Type": "application/json" } : {}) },
        ...(op.body ? { body: JSON.stringify(params) } : {}),
        signal: options.signal,
      });
    } catch (error) {
      if (options.signal?.aborted) throw error;
      throw affinityConnectionError(error, {
        timedOut: error instanceof Error && error.name === "TimeoutError",
      });
    }
    if (!response.ok) {
      const error = await affinityErrorFromResponse(response);
      error.message = `Affinity API request failed (${response.status} ${error.code})`;
      throw error;
    }
    return response.status === 204 ? (undefined as T) : response.json();
  }
  async *iterate<T>(
    op: Operation,
    params: Record<string, unknown>,
    options: SDKRequestOptions,
  ): AsyncIterable<T> {
    const query = { ...params };
    if (query.endingBefore !== undefined)
      throw new Error("iterate supports forward pagination; use list for endingBefore");
    const seen = new Set<unknown>();
    for (;;) {
      const page = await this.call<{ data: T[]; hasMore: boolean; nextCursor: string | null }>(
        op,
        [],
        query,
        options,
      );
      for (const item of page.data) {
        options.signal?.throwIfAborted();
        yield item;
      }
      if (!page.hasMore) return;
      const cursor = page.nextCursor;
      if (!cursor || cursor === query.startingAfter || seen.has(cursor))
        throw new Error("Pagination did not advance");
      seen.add(cursor);
      query.startingAfter = cursor;
    }
  }
}

__AFFINITY_OPERATIONS__;

__AFFINITY_TYPES__;

__AFFINITY_RESOURCES__;
