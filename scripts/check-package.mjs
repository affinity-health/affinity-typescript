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
if (typeof client.raw?.orders?.getOrder !== "function") {
  throw new Error("raw transport namespace is unavailable");
}

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
  ["account", "retrieve"],
  ["apiKeys", "retrieve"],
  ["catalog", "list"],
  ["locations", "list"],
  ["orders", "list"],
  ["patients", "list"],
  ["patients", "retrieveAllergies"],
  ["practices", "list"],
  ["sessions", "createHosted"],
  ["team", "retrieve"],
  ["team", "createUser"],
  ["webhooks", "list"],
]) {
  if (typeof client[group][method] !== "function") {
    throw new Error(`${group}.${method} method missing`);
  }
}

for (const [group, method] of [
  ["apiKeys", "getApiAccess"],
  ["catalog", "listCatalogItems"],
  ["locations", "listPracticeLocations"],
  ["orders", "listOrders"],
  ["patients", "getPatientAllergies"],
  ["patients", "listPatients"],
  ["practices", "createPractice"],
  ["practices", "listPractices"],
  ["sessions", "createHostedSession"],
  ["team", "getPracticeTeam"],
  ["team", "registerUser"],
  ["webhooks", "listWebhookEndpoints"],
]) {
  if (method in client[group]) {
    throw new Error(`generated method leaked into public ${group}: ${method}`);
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
