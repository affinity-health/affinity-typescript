import { mkdtemp, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dir, "..");
const consumer = await mkdtemp(join(tmpdir(), "affinity-sdk-consumer-"));

const consumerSource = String.raw`
import { Affinity, AffinityError, type Patient, type OrderCreateParams, type Medication, type MedicationGetResponse, type MedicationListParams } from "@affinity-health/sdk";
const api = new Affinity("synthetic-test-key");
declare const input: OrderCreateParams;
const patient: Patient = input.patient;
const params: MedicationListParams = {limit:"20",query:"synthetic"};
async function workflow() {
 const account = await api.account.get();
 const page = await api.medications.list(params);
 const medication: Medication = await api.medications.get(page.data[0]!.id);
 const exact: MedicationGetResponse = medication;
 const practice = await api.practices.create({name:"Synthetic Test Practice"},{idempotencyKey:"persisted-practice"});
 await api.practices.list({limit:"20"});
 await api.practices.get(practice.id);
 await api.practices.update(practice.id,{phone:null});
 const order = await api.orders.create(input,{idempotencyKey:"persisted-order"});
 await api.orders.list({practiceId:practice.id,limit:"20"});
 await api.orders.get(order.id);
 await api.orders.cancel(order.id);
 const endpoint = await api.webhooks.create({url:"https://example.test/webhook"});
 await api.webhooks.list({limit:"20"});
 await api.webhooks.update(endpoint.id,{url:"https://example.test/new-webhook"});
 await api.webhooks.resendFailed(endpoint.id,{idempotencyKey:"persisted-resend"});
 await api.webhooks.remove(endpoint.id);
 await api.feedback.create({message:"Synthetic feedback"});
 void account; void exact;
}
// Required headers are generated when request options are omitted.
void api.orders.create(input);
void api.practices.create({name:"Synthetic Test Practice"});
void api.webhooks.resendFailed("whe_example");
// @ts-expect-error There is no standalone patient resource.
void api.patients;
// @ts-expect-error The catalog resource is retired.
void api.catalog;
// @ts-expect-error Practice context belongs in API input, not a scoped client.
void api.forPractice("prac_example");
// @ts-expect-error Creation signs and submits in one request.
void api.orders.sign("ord_example");
// @ts-expect-error There is no separate submit operation.
void api.orders.submit("ord_example");
// @ts-expect-error There is no preview operation.
void api.orders.preview({});
void patient; void workflow; void AffinityError;
`;

const forbiddenSource = String.raw`
import { CompoundingReason, CatalogItem, LegacyAffinity, AffinityApiClient, Configuration, OrdersApi, CreateOrderRequestToJSON } from "@affinity-health/sdk";
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
      "CompoundingReason",
      "CatalogItem",
      "LegacyAffinity",
      "AffinityApiClient",
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

  const approvedRuntime = String.raw`import { Affinity } from "@affinity-health/sdk";
const paths = [];
const api = new Affinity("synthetic-test-key", { fetch: async (input, init) => {
  const path = new URL(String(input)).pathname;
  paths.push(path);
  const headers = new Headers(init?.headers);
  if (headers.get("Affinity-Version") !== "2026-10-20") throw new Error("Missing current API version");
  if (path.endsWith("/cancel") && !headers.get("Idempotency-Key")) throw new Error("Missing generated idempotency key");
  return Response.json({ id: "med_example", name: "Synthetic medication" });
}});
const medication = await api.medications.get("med_example");
if (medication.id !== "med_example" || paths.length !== 1 || paths[0] !== "/v1/medications/med_example") throw new Error("Packed medication lookup failed");
await api.orders.cancel("ord_example");
for (const name of ["patients", "catalog", "forPractice"]) if (name in api) throw new Error("Retired resource exported: " + name);`;

  await Bun.$`node --input-type=module -e ${approvedRuntime}`.cwd(consumer).quiet();
  await Bun.$`bun -e ${approvedRuntime}`.cwd(consumer).quiet();
} finally {
  await rm(consumer, { force: true, recursive: true });
}
