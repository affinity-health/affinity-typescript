// Checks the built dist/ bundle: the public exports exist, and the client has a method for every
// operation generation.json records from the contract.
import { readFile } from "node:fs/promises";

const sdk = await import("../dist/index.js");
for (const name of [
  "AffinityClient",
  "Affinity",
  "AffinityError",
  "AffinityEnvironment",
  "verifyAffinityWebhook",
])
  if (!(name in sdk)) throw new Error(`dist/index.js does not export ${name}`);
for (const name of [
  "UnprocessableEntityError",
  "NotFoundError",
  "UnauthorizedError",
  "TooManyRequestsError",
])
  if (typeof sdk.Affinity[name] !== "function") throw new Error(`Affinity.${name} is missing`);

const { operations } = JSON.parse(
  await readFile(new URL("../generation.json", import.meta.url), "utf8"),
);
const client = new sdk.AffinityClient({ token: "sk_test_package_check" });
for (const operationId of Object.keys(operations)) {
  const [resource, method] = operationId.split(".");
  if (typeof client[resource]?.[method] !== "function")
    throw new Error(`client.${operationId} is missing`);
}
console.log(`dist exports the client and its ${Object.keys(operations).length} operations.`);
