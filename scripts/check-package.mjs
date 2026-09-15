import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";

const sdk = await import("../dist/index.js");
const client = new sdk.Affinity("sk_test_package_check");

for (const resource of [
  "account",
  "apiKeys",
  "catalog",
  "locations",
  "orders",
  "patients",
  "platformPricing",
  "practices",
  "sessions",
  "team",
  "webhooks",
]) {
  if (!(resource in client)) throw new Error(`${resource} resource missing`);
}

for (const [group, method] of [
  ["apiKeys", "getApiAccess"],
  ["catalog", "listCatalogItems"],
  ["locations", "listPracticeLocations"],
  ["orders", "listOrders"],
  ["patients", "listPatients"],
  ["practices", "listPractices"],
  ["sessions", "createHostedSession"],
  ["team", "getPracticeTeam"],
  ["webhooks", "listWebhookEndpoints"],
]) {
  if (typeof client[group][method] !== "function") {
    throw new Error(`${group}.${method} method missing`);
  }
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
