// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.

import type { FetchAPI } from "../runtime";

type RetryOptions = { maxRetries: number; timeout: number };

export function createRetryingFetch(fetchApi: FetchAPI, options: RetryOptions): FetchAPI {
  return async (input, init) => {
    const method = (
      init?.method ?? (input instanceof Request ? input.method : "GET")
    ).toUpperCase();
    const headers = new Headers(input instanceof Request ? input.headers : undefined);
    new Headers(init?.headers).forEach((value, key) => headers.set(key, value));
    const retryableRequest =
      ["GET", "HEAD", "OPTIONS"].includes(method) || headers.has("Idempotency-Key");
    let lastError: unknown;

    for (let attempt = 0; attempt <= options.maxRetries; attempt += 1) {
      const controller = new AbortController();
      const abortFromCaller = () => controller.abort(init?.signal?.reason);
      if (init?.signal?.aborted) abortFromCaller();
      init?.signal?.addEventListener("abort", abortFromCaller, { once: true });
      const timer = setTimeout(
        () => controller.abort(new Error("Affinity request timed out")),
        options.timeout,
      );
      try {
        const response = await fetchApi(input, { ...init, signal: controller.signal });
        if (
          !retryableRequest ||
          attempt === options.maxRetries ||
          (![408, 429].includes(response.status) && response.status < 500)
        ) {
          return response;
        }
        await waitBeforeRetry(attempt, response.headers.get("retry-after"));
      } catch (error) {
        lastError = error;
        if (!retryableRequest || attempt === options.maxRetries || init?.signal?.aborted)
          throw error;
        await waitBeforeRetry(attempt, null);
      } finally {
        clearTimeout(timer);
        init?.signal?.removeEventListener("abort", abortFromCaller);
      }
    }
    throw lastError ?? new Error("Affinity request failed");
  };
}

async function waitBeforeRetry(attempt: number, retryAfter: string | null) {
  const retryAfterSeconds = retryAfter ? Number(retryAfter) : Number.NaN;
  const delay = Number.isFinite(retryAfterSeconds)
    ? Math.max(0, retryAfterSeconds * 1_000)
    : Math.min(250 * 2 ** attempt, 2_000);
  await new Promise((resolve) => setTimeout(resolve, delay));
}
