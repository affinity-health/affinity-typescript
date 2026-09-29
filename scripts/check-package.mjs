import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
const sdk = await import("../dist/index.js");
for (const name of [
  "LegacyAffinity",
  "AffinityApiClient",
  "Configuration",
  "OrdersApi",
  "ResponseError",
]) {
  if (name in sdk) throw new Error(`Removed export remains: ${name}`);
}
const docsRoot = new URL("../docs/", import.meta.url);
const generatedDocs = (await readdir(docsRoot)).filter((name) => name.endsWith(".md"));
for (const name of generatedDocs) {
  const path = resolve(docsRoot.pathname, name);
  const source = await readFile(path, "utf8");
  if (source.includes("TODO: Update the object below with actual values")) {
    throw new Error(`generated placeholder example remains in ${path}`);
  }
}

const approved = new sdk.Affinity("sk_test_package_check");
for (const path of Object.values(
  JSON.parse(await readFile(new URL("../generation.json", import.meta.url), "utf8")).sdkMethods,
)) {
  if (typeof path.split(".").reduce((node, key) => node?.[key], approved) !== "function")
    throw new Error(`Missing approved method: ${path}`);
}
if (typeof approved.forPractice !== "function" || typeof approved.patients.iterate !== "function")
  throw new Error("Missing scoped client or iterator");
