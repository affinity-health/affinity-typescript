import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

// Runs the actual production SSR bundle. No API key and no API writes.
const password = crypto.randomUUID() + crypto.randomUUID();
const app = (await import(pathToFileURL(resolve("dist/server/server.js")).href)).default;
delete process.env.AFFINITY_EXAMPLE_PASSWORD;
const locked = await app.fetch(new Request("http://localhost/"));
assert.equal(locked.status, 503);
process.env.AFFINITY_EXAMPLE_PASSWORD = password;
const anonymous = await app.fetch(new Request("http://localhost/"));
assert.equal(anonymous.status, 401);
const headers = { Authorization: `Basic ${Buffer.from(`demo:${password}`).toString("base64")}` };
const authenticated = await app.fetch(new Request("http://localhost/", { headers }));
assert.equal(authenticated.status, 200);
assert.equal(authenticated.headers.get("cache-control"), "no-store");
const html = await authenticated.text();
assert.ok(html.includes("From your EMR to an order."));
assert.ok(!html.includes(password));
const crossSite = await app.fetch(
  new Request("http://localhost/_serverFn/invalid", {
    method: "POST",
    headers: { ...headers, Origin: "https://untrusted.example", "Sec-Fetch-Site": "cross-site" },
  }),
);
assert.equal(crossSite.status, 403);
console.log(
  "SSR smoke passed: unconfigured 503, anonymous 401, authenticated 200, cross-site POST 403, no password in HTML.",
);
