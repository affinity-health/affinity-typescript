import { expect, test } from "bun:test";
import { Affinity, AffinityRateLimitError } from "../src";

function rateLimited() {
  return Response.json(
    {
      code: "rate_limit_exceeded",
      detail: "Too many requests",
      instance: "/v1/webhook-endpoints",
      requestId: "req_rate_limit",
      status: 429,
      title: "Too Many Requests",
      type: "https://api.affinityrx.com/problems/rate-limit",
    },
    { status: 429, headers: { "Retry-After": "1" } },
  );
}

test("429 waits for Retry-After seconds and reuses the generated key before succeeding", async () => {
  const attempts: { time: number; key: string | null; body: string; path: string }[] = [];
  const server = Bun.serve({
    hostname: "127.0.0.1",
    port: 0,
    async fetch(request) {
      attempts.push({
        time: performance.now(),
        key: request.headers.get("Idempotency-Key"),
        body: await request.text(),
        path: new URL(request.url).pathname,
      });
      return attempts.length === 1
        ? rateLimited()
        : Response.json({ id: "whe_test", url: "https://example.test/webhook", secret: "test" });
    },
  });
  try {
    const api = new Affinity("test", { baseUrl: server.url.toString(), maxNetworkRetries: 1 });
    const result = await api.webhooks.create({ url: "https://example.test/webhook" });
    expect(result.id).toBe("whe_test");
    expect(attempts).toHaveLength(2);
    expect(attempts[1].time - attempts[0].time).toBeGreaterThanOrEqual(1_000);
    expect(attempts[0].key).toBeTruthy();
    expect(attempts[1].key).toBe(attempts[0].key);
    expect(attempts.map(({ body, path }) => ({ body, path }))).toEqual([
      { body: '{"url":"https://example.test/webhook"}', path: "/v1/webhook-endpoints" },
      { body: '{"url":"https://example.test/webhook"}', path: "/v1/webhook-endpoints" },
    ]);
  } finally {
    await server.stop(true);
  }
});

test("persistent 429 throws a typed error after exactly the configured attempts", async () => {
  const attempts: { time: number; key: string | null }[] = [];
  const server = Bun.serve({
    hostname: "127.0.0.1",
    port: 0,
    fetch(request) {
      attempts.push({ time: performance.now(), key: request.headers.get("Idempotency-Key") });
      return rateLimited();
    },
  });
  try {
    const api = new Affinity("test", { baseUrl: server.url.toString(), maxNetworkRetries: 2 });
    const error: unknown = await api.webhooks
      .create({ url: "https://example.test/webhook" }, { idempotencyKey: "persisted-test-key" })
      .catch((error: unknown) => error);
    expect(error).toBeInstanceOf(AffinityRateLimitError);
    if (!(error instanceof AffinityRateLimitError)) throw error;
    expect(error.statusCode).toBe(429);
    expect(error.category).toBe("rate_limit");
    expect(error.code).toBe("rate_limit_exceeded");
    expect(error.retryAfter).toBe(1);
    expect(error.requestId).toBe("req_rate_limit");
    expect(attempts).toHaveLength(3);
    expect(attempts.map(({ key }) => key)).toEqual(Array(3).fill("persisted-test-key"));
    for (let i = 1; i < attempts.length; i++)
      expect(attempts[i].time - attempts[i - 1].time).toBeGreaterThanOrEqual(1_000);
    await Bun.sleep(1_100);
    expect(attempts).toHaveLength(3);
  } finally {
    await server.stop(true);
  }
});
