// Installs the packed tarball into a new project, type-checks the documented examples against its
// declarations (NodeNext and Bundler, lib checks on), and runs it under Node and Bun.
import { mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dir, "..");
const consumer = await mkdtemp(join(tmpdir(), "affinity-sdk-consumer-"));

// Runs in the consumer under Node and Bun: one request through the packed bundle.
const runtime = String.raw`import { Affinity, AffinityClient, verifyAffinityWebhook } from "@affinity-health/sdk";
const seen = [];
const client = new AffinityClient({ token: "sk_test_synthetic", maxRetries: 0, fetch: async (input, init) => {
  const request = new Request(input, init);
  seen.push(request.method + " " + new URL(request.url).pathname + " " + request.headers.get("affinity-version") + " " + request.headers.get("idempotency-key"));
  if (request.method === "POST") return new Response(JSON.stringify({ type: "about:blank", title: "Invalid", status: 422, code: "invalid_order", detail: "d", instance: "/v1/orders", requestId: "r", issues: [{ code: "required", field: "x", path: ["x"], message: "m" }] }), { status: 422, headers: { "content-type": "application/problem+json" } });
  return new Response(JSON.stringify({ id: "plat_x", type: "platform", mode: "test" }), { headers: { "content-type": "application/json" } });
}});
const account = await client.account.get();
if (account.mode !== "test") throw new Error("account");
const error = await client.orders.create({ idempotencyKey: "k1" }).catch((e) => e);
if (!(error instanceof Affinity.UnprocessableEntityError) || error.body.issues[0].field !== "x") throw new Error("422 " + error);
if (seen.join("|") !== "GET /v1/account 2026-10-28 null|POST /v1/orders 2026-10-28 k1") throw new Error(seen.join("|"));
if (typeof verifyAffinityWebhook !== "function") throw new Error("webhooks");`;

try {
  await Bun.$`bun pm pack --destination ${consumer}`.cwd(root).quiet();
  const archive = (await readdir(consumer)).find((file) => file.endsWith(".tgz"));
  if (!archive) throw new Error("bun pm pack wrote no archive");
  const files = (await Bun.$`tar tzf ${join(consumer, archive)}`.text())
    .split("\n")
    .filter(Boolean);
  for (const leaked of files.filter((file) =>
    /^package\/(src|test|scripts|spec|fern|examples)\//u.test(file),
  ))
    throw new Error(`The package includes ${leaked}`);

  await writeFile(
    join(consumer, "package.json"),
    JSON.stringify({ name: "affinity-sdk-consumer", private: true, type: "module" }),
  );
  await writeFile(
    join(consumer, "docs-examples.ts"),
    (await readFile(resolve(root, "test/types/docs-examples.ts"), "utf8")).replace(
      '"../../src"',
      '"@affinity-health/sdk"',
    ),
  );
  await Bun.$`bun add ${join(consumer, archive)} @types/node@20`.cwd(consumer).quiet();

  const tsgo = resolve(root, "node_modules/.bin/tsgo");
  for (const [module, moduleResolution] of [
    ["NodeNext", "NodeNext"],
    ["ESNext", "Bundler"],
  ])
    await Bun.$`${tsgo} --noEmit --pretty false --strict --skipLibCheck false --target ES2022 --lib ES2022,DOM --types node --module ${module} --moduleResolution ${moduleResolution} docs-examples.ts`.cwd(
      consumer,
    );

  await Bun.$`node --input-type=module -e ${runtime}`.cwd(consumer);
  await Bun.$`bun -e ${runtime}`.cwd(consumer);
  console.log(
    `Packed ${archive}: ${files.length} files; types check under NodeNext and Bundler; runs under Node and Bun.`,
  );
} finally {
  await rm(consumer, { force: true, recursive: true });
}
