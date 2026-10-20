import { createTransport } from "./transport";
import { affinityConnectionError, affinityErrorFromResponse } from "./errors";

const sdkVersion = "__AFFINITY_SDK_VERSION__";

export interface SDKOptions {
  baseUrl?: string;
  fetch?: typeof fetch;
  timeout?: number;
  maxNetworkRetries?: number;
  apiVersion?: string;
}
export interface SDKRequestOptions {
  idempotencyKey?: string;
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
class SDKTransport {
  readonly fetcher: typeof fetch;
  readonly baseUrl: string;

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
  async request(
    path: string,
    method: string,
    body: unknown,
    headers: Record<string, string>,
    signal?: AbortSignal,
  ): Promise<any> {
    const init: RequestInit = {
      method,
      redirect: "error",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Affinity-Version": this.options.apiVersion ?? "__AFFINITY_API_VERSION__",
        "User-Agent": `affinity-typescript/${sdkVersion}`,
        ...headers,
        ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      signal,
    };
    let response: Response;
    try {
      response = await this.fetcher(this.baseUrl + path, init);
    } catch (error) {
      // A caller's own cancellation stays an AbortError; network failures and timeouts are typed.
      if (signal?.aborted) throw error;
      throw affinityConnectionError(error, {
        timedOut: error instanceof Error && error.name === "TimeoutError",
      });
    }
    if (!response.ok) {
      // Problem detail can describe submitted data, so it stays on error.problem, not in the message.
      const error = await affinityErrorFromResponse(response);
      error.message = `Affinity API request failed (${response.status} ${error.code})`;
      throw error;
    }
    return response.status === 204 ? undefined : response.json();
  }
}

class SDKContext {
  constructor(readonly transport: SDKTransport) {}
  async call(
    op: Operation,
    ids: string[],
    params: Record<string, unknown> = {},
    options: SDKRequestOptions = {},
  ): Promise<any> {
    options.signal?.throwIfAborted();
    const key = options.idempotencyKey;
    if (key !== undefined && !/^[\x21-\x7e]{1,255}$/.test(key))
      throw new Error("idempotencyKey must contain 1 to 255 printable ASCII characters");
    if (op.idempotency && !key)
      throw new Error("A persisted idempotencyKey is required for this operation");
    if (!op.idempotency && key) throw new Error("This endpoint does not support idempotency keys");
    let path = op.path;
    if (ids.length !== op.ids.length) throw new Error("Missing resource ID");
    op.ids.forEach((name, index) => {
      const id = ids[index];
      if (typeof id !== "string" || !id.trim()) throw new Error(`${name} is required`);
      path = path.replace(`{${name}}`, encodeURIComponent(id));
    });
    const data = { ...params };
    const query = new URLSearchParams();
    // Array parameters repeat their key, as the API's form-exploded query contract requires.
    for (const name of op.query)
      if (data[name] !== undefined && data[name] !== null) {
        const value = data[name];
        for (const item of Array.isArray(value) ? value : [value]) query.append(name, String(item));
        delete data[name];
      }
    const headers: Record<string, string> = {};
    if (key) headers["Idempotency-Key"] = key;
    return this.transport.request(
      path + (query.size ? `?${query}` : ""),
      op.verb,
      op.body ? data : undefined,
      headers,
      options.signal,
    );
  }
  async *iterate<T extends { id: string }>(
    op: Operation,
    ids: string[],
    params: Record<string, unknown>,
    options: SDKRequestOptions,
  ): AsyncIterable<T> {
    const query = { ...params };
    if (query.endingBefore !== undefined)
      throw new Error("iterate supports forward pagination; use list for endingBefore");
    for (;;) {
      options.signal?.throwIfAborted();
      const page = await this.call(op, ids, query, options);
      for (const item of page.data) {
        options.signal?.throwIfAborted();
        yield item;
      }
      if (!page.hasMore) return;
      const cursor = page.nextCursor;
      if (!cursor || cursor === query.startingAfter) throw new Error("Pagination did not advance");
      query.startingAfter = cursor;
    }
  }
}
