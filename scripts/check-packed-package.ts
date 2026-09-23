import { mkdtemp, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dir, "..");
const consumer = await mkdtemp(join(tmpdir(), "affinity-sdk-consumer-"));

const consumerSource = String.raw`
import {
  Affinity,
  CompoundingReason,
  type AffinityActor,
  type CreateOrderParams,
  type ListCatalogItemsParams,
  type MutationOptions,
} from "@affinity-health/sdk";

const actor: AffinityActor = { id: "packed-check", type: "system" };
const orderInput = {
  practiceId: "prac_01j2y8m6jcc9tt24af5pw9x1bc",
  patientId: "pat_01j2y8m6jcc9tt24af5pw9x1bc",
  prescriptions: [
    {
      medicationId: "cat_01j2y8m6jcc9tt24af5pw9x1bc",
      daysSupply: 30,
      dispensing: { dispenseUponAcceptance: false },
      directions: "Take one capsule by mouth once daily",
      quantity: 30,
      quantityUnit: "capsule",
      refills: 0,
      clinical: { medicationReviewStatus: "none", currentMedications: [], diagnosisReviewStatus: "none", diagnoses: [], compoundingReason: { category: CompoundingReason.ConcentrationAdjustment } },
      structuredSig: {
        dose: "1",
        doseUnit: "capsule",
        frequency: "once daily",
        route: "oral",
      },
    },
  ],
} satisfies CreateOrderParams;

const sdk = new Affinity("sk_test_packed_consumer", {
  actor,
  apiVersion: "2026-08-11",
  organizationId: "acct_01j2y8m6jcc9tt24af5pw9x1bc",
});
void sdk.rawRequest("GET", "/v1/preview");
// @ts-expect-error generated raw clients are not part of the public client
void sdk.raw.orders.getOrder;
const mutationOptions: MutationOptions = {
  actor,
  idempotencyKey: "packed-check-order",
};
const catalogParams: ListCatalogItemsParams = {
  limit: 10,
  startingAfter: "cat_01j2y8m6jcc9tt24af5pw9x1bc",
};
void sdk.catalog.items.list(catalogParams);
void sdk.orders.create(orderInput, mutationOptions);
async function previewAndCreate() {
  const preview = await sdk.orderPreviews.create({
    practiceId: orderInput.practiceId,
    patientId: orderInput.patientId,
    prescriptions: [{ medicationId: orderInput.prescriptions[0].medicationId, preset: "default" }],
    shipping: { selection: "lowest_cost" },
  });
  const satisfied: boolean = preview.clinicalRequirementsSatisfied;
  const paths: string[] = preview.clinicalIssues.map(issue => issue.path);
  void satisfied;
  void paths;
  if (preview.status === "complete") {
    return sdk.orders.create(preview.orderInput, mutationOptions);
  }
  const absent: null = preview.orderInput;
  return absent;
}
void previewAndCreate;
const reason: CompoundingReason = "alternate_route";
// @ts-expect-error vendor codes are not Affinity reason categories
const invalidReason: CompoundingReason = "CONC_ADJUST";
async function typedReasons() {
  const options = await sdk.catalog.items.prescribingOptions.retrieve("cat_example", { practiceId: orderInput.practiceId });
  const category: CompoundingReason | undefined = options.compoundingReason.choices[0]?.category;
  return category;
}
void typedReasons;
void reason;
void invalidReason;

// Resource methods take bodies directly; request options are optional.
// @ts-expect-error generated request envelopes are not part of the public seam
void sdk.orders.create({ createOrderRequest: orderInput }, mutationOptions);
void sdk.orders.create(orderInput);
void sdk.orders.create(orderInput, {});
void sdk.practices.update("prac_example", { liveEnabled: false });
import type { Practice } from "@affinity-health/sdk";
declare const practice: Practice;
const practiceId: string = practice.id;
const liveEnabled: boolean = practice.liveEnabled;
// @ts-expect-error response IDs cannot be null
const invalidId: Practice["id"] = null;
void sdk.practices.list().autoPagingToArray({ limit: 10 });
// @ts-expect-error create-order input requires exactly one patient reference
void sdk.orders.create({ practiceId: orderInput.practiceId, prescriptions: orderInput.prescriptions }, mutationOptions);
// @ts-expect-error create-order input cannot include both patient forms
void sdk.orders.create({ ...orderInput, patient: { dateOfBirth: "1980-01-01", name: { first: "Pat", last: "Example" } } }, mutationOptions);
const invalidQuantityOrder = {
  ...orderInput,
  prescriptions: [{ ...orderInput.prescriptions[0], quantity: "30" }],
};
// @ts-expect-error quantity accepts a number or one of the contract's special values
void sdk.orders.create(invalidQuantityOrder, mutationOptions);

`;

const forbiddenSource = String.raw`
import { Configuration, OrdersApi, CreateOrderRequestToJSON } from "@affinity-health/sdk";
import { OrdersApi as SubpathOrdersApi } from "@affinity-health/sdk/dist/apis/OrdersApi.js";
import { CreateOrderRequestToJSON as SubpathSerializer } from "@affinity-health/sdk/dist/models/CreateOrderRequest.js";
void Configuration;
void OrdersApi;
void CreateOrderRequestToJSON;
void SubpathOrdersApi;
void SubpathSerializer;
`;

try {
  await Bun.$`bun pm pack --destination ${consumer}`.cwd(root).quiet();
  const archive = (await readdir(consumer)).find((file) => file.endsWith(".tgz"));
  if (!archive) throw new Error("SDK package archive was not created");

  await writeFile(
    join(consumer, "package.json"),
    JSON.stringify({ name: "affinity-sdk-consumer", private: true, type: "module" }),
  );
  await writeFile(join(consumer, "consumer.ts"), consumerSource);
  for (const [name, module, moduleResolution] of [
    ["nodenext", "NodeNext", "NodeNext"],
    ["bundler", "ESNext", "Bundler"],
  ] as const) {
    await writeFile(
      join(consumer, `tsconfig.${name}.json`),
      JSON.stringify({
        compilerOptions: {
          module,
          moduleResolution,
          noEmit: true,
          skipLibCheck: false,
          strict: true,
          target: "ES2023",
        },
        include: ["consumer.ts"],
      }),
    );
  }
  await writeFile(join(consumer, "forbidden.ts"), forbiddenSource);
  await Bun.$`bun add ${join(consumer, archive)}`.cwd(consumer).quiet();

  const tsgo = resolve(root, "node_modules/.bin/tsgo");
  for (const name of ["nodenext", "bundler"]) {
    await Bun.$`${tsgo} --noEmit --pretty false -p ${join(consumer, `tsconfig.${name}.json`)}`
      .cwd(consumer)
      .quiet();
  }

  for (const name of ["nodenext", "bundler"]) {
    const result = Bun.spawnSync(
      [
        tsgo,
        "--noEmit",
        "--pretty",
        "false",
        "--module",
        name === "nodenext" ? "NodeNext" : "ESNext",
        "--moduleResolution",
        name === "nodenext" ? "NodeNext" : "Bundler",
        "--strict",
        "--target",
        "ES2023",
        join(consumer, "forbidden.ts"),
      ],
      { cwd: consumer, stderr: "pipe", stdout: "pipe" },
    );
    const decode = (value: Uint8Array | string) =>
      typeof value === "string" ? value : new TextDecoder().decode(value);
    const diagnostics = `${decode(result.stdout)}\n${decode(result.stderr)}`;
    if (result.exitCode === 0)
      throw new Error(`forbidden generated exports compiled under ${name}`);
    for (const expected of [
      "Configuration",
      "OrdersApi",
      "CreateOrderRequestToJSON",
      "dist/apis/OrdersApi",
      "dist/models/CreateOrderRequest",
    ]) {
      if (!diagnostics.includes(expected))
        throw new Error(`missing ${expected} diagnostic under ${name}: ${diagnostics}`);
    }
  }

  const nodeImport = String.raw`import { Affinity, CompoundingReason, ResponseError, FetchError, RequiredError } from "@affinity-health/sdk";
const sdk = new Affinity("sk_test_packed_consumer");
if (!sdk.orders || "raw" in sdk || typeof sdk.rawRequest !== "function" || typeof ResponseError !== "function" || typeof FetchError !== "function" || typeof RequiredError !== "function") throw new Error("Node package exports are unavailable");
for (const path of ["@affinity-health/sdk/dist/apis/OrdersApi.js", "@affinity-health/sdk/dist/models/CreateOrderRequest.js"]) {
  try { await import(path); throw new Error("forbidden package subpath resolved: " + path); } catch (error) {
    if (
      !(error instanceof Error) ||
      !/(not exported|not defined.*exports|Cannot find|ERR_PACKAGE_PATH_NOT_EXPORTED)/i.test(
        error.message,
      )
    )
      throw error;
  }
}`;
  await Bun.$`node --input-type=module -e ${nodeImport}`.cwd(consumer).quiet();

  const bunImport = String.raw`import { Affinity, ResponseError, FetchError, RequiredError } from "@affinity-health/sdk";
const sdk = new Affinity("sk_test_packed_consumer");
if (!sdk.orders || "raw" in sdk || typeof sdk.rawRequest !== "function" || typeof ResponseError !== "function" || typeof FetchError !== "function" || typeof RequiredError !== "function") throw new Error("Bun package exports are unavailable");
for (const path of ["@affinity-health/sdk/dist/apis/OrdersApi.js", "@affinity-health/sdk/dist/models/CreateOrderRequest.js"]) {
  try { await import(path); throw new Error("forbidden package subpath resolved: " + path); } catch (error) {
    if (
      !(error instanceof Error) ||
      !/(not exported|not defined.*exports|Cannot find|ERR_PACKAGE_PATH_NOT_EXPORTED)/i.test(
        error.message,
      )
    )
      throw error;
  }
}`;
  await Bun.$`bun -e ${bunImport}`.cwd(consumer).quiet();
} finally {
  await rm(consumer, { force: true, recursive: true });
}
