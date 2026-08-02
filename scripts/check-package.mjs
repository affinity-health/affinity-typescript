import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";

const sdk = await import("../dist/index.js");
const client = new sdk.Affinity("sk_test_package_check");

for (const resource of [
  "billing",
  "componentSessions",
  "compounders",
  "hostedSessions",
  "orders",
  "orderSigningSessions",
  "patients",
  "providerMappings",
]) {
  if (!(resource in client)) throw new Error(`${resource} resource missing`);
}

for (const webhookExport of ["parseAffinityWebhookEvent", "verifyAffinityWebhook"]) {
  if (typeof sdk[webhookExport] !== "function") {
    throw new Error(`${webhookExport} export missing`);
  }
}

for (const legacyResource of ["portalSessions", "prescriptions", "prescriptionSigningSessions"]) {
  if (legacyResource in client) throw new Error(`legacy ${legacyResource} resource remains`);
}

for (const legacyMethod of ["createRoutingDecision", "submit", "update"]) {
  if (legacyMethod in client.orders) throw new Error(`legacy orders.${legacyMethod} remains`);
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
