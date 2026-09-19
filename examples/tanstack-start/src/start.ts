import { createMiddleware, createStart } from "@tanstack/react-start";

const protectExample = createMiddleware().server(async ({ request, next }) => {
  if (!["GET", "HEAD", "OPTIONS"].includes(request.method)) {
    const origin = request.headers.get("origin");
    if (
      origin !== new URL(request.url).origin ||
      request.headers.get("sec-fetch-site") === "cross-site"
    )
      return new Response("Cross-origin requests are not allowed.", { status: 403 });
  }
  const { accessPassword, authorized } = await import("./security.server");
  let password: string;
  try {
    password = accessPassword();
  } catch {
    return new Response("Example is locked. Configure AFFINITY_EXAMPLE_PASSWORD.", { status: 503 });
  }
  if (!authorized(request.headers.get("authorization"), password))
    return new Response("Sign in with username demo and the example access password.", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Affinity Test example", charset="UTF-8"',
        "Cache-Control": "no-store",
      },
    });
  const result = await next();
  result.response.headers.set("Cache-Control", "no-store");
  result.response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return result;
});

export const startInstance = createStart(() => ({ requestMiddleware: [protectExample] }));
