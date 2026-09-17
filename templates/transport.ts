import type { FetchAPI } from "../runtime";

export interface TransportOptions {
  /** Milliseconds per attempt, including response body. Default: 80,000. */
  timeout?: number;
  /** Retries after the first attempt. Default: 2. Writes require an idempotency key. */
  maxNetworkRetries?: number;
}

export function createTransport(fetcher: FetchAPI, options: TransportOptions): FetchAPI {
  const timeout = options.timeout ?? 80_000;
  const retries = options.maxNetworkRetries ?? 2;
  if (!Number.isFinite(timeout) || timeout <= 0) throw new Error("timeout must be positive");
  if (!Number.isInteger(retries) || retries < 0 || retries > 10)
    throw new Error("maxNetworkRetries must be an integer between 0 and 10");
  return async (input, init) => {
    const method = (init?.method ?? "GET").toUpperCase();
    const safe =
      ["GET", "HEAD", "OPTIONS"].includes(method) ||
      new Headers(init?.headers).has("Idempotency-Key");
    const maxRetries = safe ? retries : 0;
    for (let attempt = 0; ; attempt++) {
      init?.signal?.throwIfAborted();
      const controller = new AbortController();
      const cancel = () => controller.abort(init?.signal?.reason);
      init?.signal?.addEventListener("abort", cancel, { once: true });
      const timer = setTimeout(
        () => controller.abort(new DOMException("Request timed out", "TimeoutError")),
        timeout,
      );
      let response: Response | undefined;
      try {
        response = await withAbort(controller.signal, async () => {
          const result = await fetcher(input, { ...init, signal: controller.signal });
          // Keep the timeout active through body consumption, not just response headers.
          const body = await result.arrayBuffer();
          return new Response(body.byteLength ? body : null, {
            status: result.status,
            statusText: result.statusText,
            headers: result.headers,
          });
        });
        if (attempt >= maxRetries || ![429, 500, 502, 503, 504].includes(response.status))
          return response;
      } catch (error) {
        if (init?.signal?.aborted || attempt >= maxRetries) throw error;
      } finally {
        clearTimeout(timer);
        init?.signal?.removeEventListener("abort", cancel);
      }
      const retryAfter = response?.headers.get("Retry-After");
      const requestedDelay =
        retryAfter === null || retryAfter === undefined
          ? 0
          : /^\d+(\.\d+)?$/.test(retryAfter)
            ? Number(retryAfter) * 1000
            : Date.parse(retryAfter) - Date.now();
      const delay = Math.min(
        30_000,
        Math.max(250 * 2 ** attempt, Number.isFinite(requestedDelay) ? requestedDelay : 0),
      );
      await new Promise<void>((resolve, reject) => {
        const signal = init?.signal;
        const abort = () => {
          clearTimeout(timer);
          signal?.removeEventListener("abort", abort);
          reject(signal?.reason);
        };
        const timer = setTimeout(() => {
          signal?.removeEventListener("abort", abort);
          resolve();
        }, delay);
        signal?.addEventListener("abort", abort, { once: true });
        if (signal?.aborted) abort();
      });
    }
  };
}

async function withAbort<T>(signal: AbortSignal, operation: () => Promise<T>): Promise<T> {
  signal.throwIfAborted();
  let cancel: () => void = () => {};
  const aborted = new Promise<never>((_resolve, reject) => {
    cancel = () => reject(signal.reason);
    signal.addEventListener("abort", cancel, { once: true });
  });
  try {
    return await Promise.race([operation(), aborted]);
  } finally {
    signal.removeEventListener("abort", cancel);
  }
}
