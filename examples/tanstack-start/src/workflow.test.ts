import { expect, spyOn, test } from "bun:test";
import { client, medications, practices } from "./workflow.server";

test("directory rejects missing configuration and Live, ambiguous, or non-platform accounts", async () => {
  const key = process.env.AFFINITY_EXAMPLE_API_KEY;
  const url = process.env.AFFINITY_EXAMPLE_API_URL;
  try {
    delete process.env.AFFINITY_EXAMPLE_API_KEY;
    await expect(client()).rejects.toThrow("Set AFFINITY_EXAMPLE_API_KEY");
    process.env.AFFINITY_EXAMPLE_API_KEY = "synthetic-key";
    process.env.AFFINITY_EXAMPLE_API_URL = "https://api.example.test";
    for (const account of [
      { mode: "live", type: "platform" },
      { type: "platform" },
      { mode: "test", type: "practice" },
    ]) {
      const paths: string[] = [];
      const fetchSpy = spyOn(globalThis, "fetch").mockImplementation((async (
        input: RequestInfo | URL,
      ) => {
        paths.push(new URL(String(input)).pathname);
        return Response.json(account);
      }) as typeof fetch);
      try {
        await expect(practices()).rejects.toThrow();
        expect(paths).toEqual(["/v1/account"]);
      } finally {
        fetchSpy.mockRestore();
      }
    }
  } finally {
    if (key === undefined) delete process.env.AFFINITY_EXAMPLE_API_KEY;
    else process.env.AFFINITY_EXAMPLE_API_KEY = key;
    if (url === undefined) delete process.env.AFFINITY_EXAMPLE_API_URL;
    else process.env.AFFINITY_EXAMPLE_API_URL = url;
  }
});

test("directory and medication reads preserve opaque cursors and filters", async () => {
  const key = process.env.AFFINITY_EXAMPLE_API_KEY;
  process.env.AFFINITY_EXAMPLE_API_KEY = "synthetic-key";
  const urls: URL[] = [];
  const fetchSpy = spyOn(globalThis, "fetch").mockImplementation((async (
    input: RequestInfo | URL,
    init?: RequestInit,
  ) => {
    const url = new URL(String(input));
    expect(init?.method ?? "GET").toBe("GET");
    urls.push(url);
    if (url.pathname === "/v1/account") return Response.json({ mode: "test", type: "platform" });
    return Response.json({
      object: "list",
      url: url.pathname,
      data: [],
      hasMore: false,
      nextCursor: null,
    });
  }) as typeof fetch);
  try {
    await practices("opaque/+cursor=");
    await medications("Synthetic search", "another/cursor");
    expect(urls.map((url) => url.pathname)).toEqual([
      "/v1/account",
      "/v1/practices",
      "/v1/account",
      "/v1/medications",
    ]);
    expect(urls[1]!.searchParams.get("startingAfter")).toBe("opaque/+cursor=");
    expect(urls[3]!.searchParams.get("query")).toBe("Synthetic search");
    expect(urls[3]!.searchParams.get("startingAfter")).toBe("another/cursor");
  } finally {
    fetchSpy.mockRestore();
    if (key === undefined) delete process.env.AFFINITY_EXAMPLE_API_KEY;
    else process.env.AFFINITY_EXAMPLE_API_KEY = key;
  }
});
