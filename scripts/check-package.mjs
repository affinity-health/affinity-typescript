import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";

const sdk = await import("../dist/index.js");
const client = new sdk.Affinity("sk_test_package_check");

for (const name of [
  "OrdersApi",
  "Configuration",
  "CreateOrderRequestToJSON",
  "CreateOrderRequestFromJSON",
]) {
  if (name in sdk) throw new Error(`generated transport export leaked from package root: ${name}`);
}
for (const name of ["ResponseError", "FetchError", "RequiredError"]) {
  if (typeof sdk[name] !== "function") throw new Error(`transport error export missing: ${name}`);
}
if ("raw" in client || typeof client.rawRequest !== "function") {
  throw new Error("rawRequest is unavailable or generated raw clients are public");
}

if ("sessions" in client) throw new Error("Session creation must remain absent from the package");

for (const path of [
  "account.retrieve",
  "auth.access.retrieve",
  "catalog.items.list",
  "pharmacies.list",
  "practices.locations.list",
  "practices.patients.allergies.retrieve",
  "practices.team.members.list",
  "practices.team.prescribers.licenses.create",
  "orders.events.list",
  "orders.prescriptions.create",
  "orderBatches.create",
  "orderPreviews.create",
  "webhookEndpoints.list",
  "webhookEvents.list",
  "webhookGrants.list",
]) {
  if (typeof path.split(".").reduce((node, key) => node?.[key], client) !== "function")
    throw new Error(`Missing public method: ${path}`);
}
for (const name of [
  "apiKeys",
  "locations",
  "patients",
  "platformPricing",
  "team",
  "webhooks",
  "hostedSessions",
  "componentSessions",
]) {
  if (name in client) throw new Error(`Retired resource still exposed: ${name}`);
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
