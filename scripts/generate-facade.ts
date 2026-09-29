import { sdkContract } from "./sdk-contract";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dir, "..");
const spec = sdkContract(
  JSON.parse(await readFile(resolve(root, "spec/affinity.openapi.json"), "utf8")),
);
const generated =
  "// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.\n";
async function output(path: string, source: string) {
  const destination = resolve(root, path);
  await mkdir(resolve(destination, ".."), { recursive: true });
  await writeFile(destination, `${generated}\n${source.trim()}\n`);
}
const metadata = JSON.parse(await readFile(resolve(root, "generation.json"), "utf8"));
const operations = Object.values(
  spec.paths as Record<string, Record<string, { operationId?: string }>>,
).flatMap((path) => Object.values(path).flatMap((op) => (op.operationId ? [op.operationId] : [])));
if (
  operations.length !== Object.keys(metadata.sdkMethods).length ||
  operations.some((id) => !metadata.sdkMethods[id])
)
  throw new Error("Regenerate the SDK facade from the current contract");
await rm(resolve(root, "src"), { recursive: true, force: true });
await output("src/sdk.ts", await readFile(resolve(root, "templates/sdk.ts"), "utf8"));
await output("src/transport.ts", await readFile(resolve(root, "templates/transport.ts"), "utf8"));
await output("src/errors.ts", await readFile(resolve(root, "scripts/templates/errors.ts"), "utf8"));
await output(
  "src/index.ts",
  `export * from "./sdk";
export * from "./errors";
export type * from "./domain";
export * from "./webhook-events";
export * from "./compounding-reason";`,
);
await output(
  "src/domain.ts",
  `import type { Affinity } from "./sdk";
export type Practice = Awaited<ReturnType<Affinity["practices"]["get"]>>;
export type Patient = Awaited<ReturnType<Affinity["patients"]["get"]>>;
export type Order = Awaited<ReturnType<Affinity["orders"]["get"]>>;
export type CreatedOrder = Awaited<ReturnType<Affinity["orders"]["create"]>>;
export type CatalogItem = Awaited<ReturnType<Affinity["catalog"]["items"]["list"]>>["data"][number];
export type PracticeLocation = Awaited<ReturnType<Affinity["locations"]["get"]>>;`,
);
const webhookContract = spec["x-affinity-webhooks"] as {
  apiVersion?: string;
  eventTypes?: string[];
  orderStatuses?: string[];
  signatureHeader?: string;
};
if (
  !webhookContract.apiVersion ||
  !webhookContract.eventTypes?.length ||
  !webhookContract.orderStatuses?.length ||
  !webhookContract.signatureHeader
)
  throw new Error("The OpenAPI contract must define the complete x-affinity-webhooks contract");
const webhookTemplate = await readFile(resolve(root, "templates/webhook-events.ts"), "utf8");
await output(
  "src/webhook-events.ts",
  webhookTemplate
    .replace("__AFFINITY_WEBHOOK_API_VERSION__", JSON.stringify(webhookContract.apiVersion))
    .replace("__AFFINITY_WEBHOOK_EVENT_TYPES__", JSON.stringify(webhookContract.eventTypes))
    .replace("__AFFINITY_ORDER_STATUSES__", JSON.stringify(webhookContract.orderStatuses))
    .replace(
      "__AFFINITY_WEBHOOK_SIGNATURE_HEADER__",
      JSON.stringify(webhookContract.signatureHeader),
    ),
);

const category =
  spec.components.schemas.CreateOrderRequest.properties.prescriptions.items.properties.clinical
    .anyOf[0].properties.compoundingReason.anyOf[0].properties.category;
const values: string[] =
  category.enum ?? category.anyOf?.find((option: { enum?: string[] }) => option.enum)?.enum;
if (!values?.length) throw new Error("Missing compounding reason categories");
await output(
  "src/compounding-reason.ts",
  `export const CompoundingReason = ${JSON.stringify(Object.fromEntries(values.map((value) => [value.replace(/(^|_)([a-z])/g, (_: string, _prefix: string, letter: string) => letter.toUpperCase()), value])))} as const;
export type CompoundingReason = typeof CompoundingReason[keyof typeof CompoundingReason];`,
);
