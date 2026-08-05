import { mkdtemp, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dir, "..");
const consumer = await mkdtemp(join(tmpdir(), "affinity-sdk-consumer-"));

try {
  await Bun.$`bun pm pack --destination ${consumer}`.cwd(root).quiet();
  const archive = (await readdir(consumer)).find((file) => file.endsWith(".tgz"));
  if (!archive) throw new Error("SDK package archive was not created");

  await writeFile(
    join(consumer, "package.json"),
    JSON.stringify({ name: "affinity-sdk-consumer", private: true, type: "module" }),
  );
  await Bun.$`bun add ${join(consumer, archive)}`.cwd(consumer).quiet();
  await Bun.$`bun -e ${`import { Affinity } from "@affinity-health/sdk";
const sdk = new Affinity("sk_test_packed_consumer");
if (!sdk.orders || !sdk.webhooks) throw new Error("packed SDK resources are unavailable");`}`
    .cwd(consumer)
    .quiet();
} finally {
  await rm(consumer, { force: true, recursive: true });
}
