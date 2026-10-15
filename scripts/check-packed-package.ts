import { mkdtemp, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dir, "..");
const consumer = await mkdtemp(join(tmpdir(), "affinity-sdk-consumer-"));

const consumerSource = String.raw`
import { Affinity, AffinityError, CompoundingReason, type Patient, type OrderCreateParams } from "@affinity-health/sdk";
import type {
 AffinityWebhookEvent, AffinityOrderWebhookStatus, AffinityPublicId,
 TeamPrescribersLicensesSDKResource, TeamPrescriberLicenseCreateParams,
 TeamPrescriberLicenseUpdateParams,
} from "@affinity-health/sdk";
const api = new Affinity("test");
const practice = api.forPractice("prac_example");
async function workflow() {
 const patient: Patient = await practice.patients.create({ name: {first:"Alex",last:"Example"},dateOfBirth:"1990-01-01" });
 await practice.patients.update(patient.id, {status:"archived"});
 await practice.orders.submit("ord_example", {idempotencyKey:"persisted-job"});
 for await (const row of practice.patients.iterate({limit:20})) { const id:string=row.id; void id; }
 const licenses: TeamPrescribersLicensesSDKResource = practice.team.prescribers.licenses;
 const license: TeamPrescriberLicenseCreateParams = { state: "CA", licenseNumber: "sdk-1-17-synthetic" };
 const licenseUpdate: TeamPrescriberLicenseUpdateParams = { expiresAt: null };
 await licenses.create("prov_sdk-1-17", license);
 await licenses.update("prov_sdk-1-17", "lic_sdk-1-17", licenseUpdate);
}
void workflow;
function handleExistingWebhook(event: AffinityWebhookEvent) {
 const version: "2026-08-11" | "2026-09-28" = event.api_version;
 if (event.type === "webhook_endpoint.test") {
  const endpointId: AffinityPublicId<"whe"> = event.data.object.id;
  void endpointId;
 } else {
  const status: AffinityOrderWebhookStatus | undefined = event.data.object.status;
  void status;
 }
 void version;
}
void handleExistingWebhook;
const prescription = {
 medicationId: "med_sdk-1-17", daysSupply: 30, dispensing: {},
 directions: "Synthetic test fixture", quantity: 1, quantityUnit: "mL", refills: 0,
};
// Every consequential order mutation already required a caller key in 1.16.
// @ts-expect-error persisted key required
void practice.orders.create({ prescriptions: [] });
// @ts-expect-error persisted key required
void practice.orders.cancel("ord_sdk-1-17", { reason: "synthetic" });
// @ts-expect-error persisted key required
void practice.orders.sign("ord_sdk-1-17", { signatureAttestation: true });
// @ts-expect-error persisted key required
void practice.orders.signAndSubmit("ord_sdk-1-17", { signatureAttestation: true });
// @ts-expect-error persisted key required
void practice.orders.reject("ord_sdk-1-17", { reason: "synthetic" });
// @ts-expect-error persisted key required
void practice.orders.batches.create({ orders: [] });
// @ts-expect-error persisted key required
void practice.orders.exceptions.act("ord_sdk-1-17", "exc_sdk-1-17", { action: "retry" });
// @ts-expect-error persisted key required
void practice.orders.prescriptions.add("ord_sdk-1-17", { prescription });
// @ts-expect-error persisted key required
void practice.orders.prescriptions.update("ord_sdk-1-17", "rx_sdk-1-17", { prescription });
// @ts-expect-error persisted key required
void practice.orders.testSimulation.update("ord_sdk-1-17", { mode: "manual", scenario: "successful" });
const reason: CompoundingReason = CompoundingReason.ConcentrationAdjustment;
// @ts-expect-error persisted key required
void practice.orders.submit("ord_example");
// @ts-expect-error removed method
void practice.patients.retrieve("pat_example");
// @ts-expect-error removed client method
void api.withActor({id:"user",type:"user"});
void reason; void AffinityError;
`;

const forbiddenSource = String.raw`
import { LegacyAffinity, AffinityApiClient, Configuration, OrdersApi, CreateOrderRequestToJSON } from "@affinity-health/sdk";
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
const api = new Affinity("test", { fetch: async (input) => {
  const path = new URL(String(input)).pathname;
  paths.push(path);
  return Response.json(path.endsWith("/access")
    ? { serviceAccount: { subjectType: "platform", subjectId: "acct_example" } }
    : { id: "pat_example" });
}});
const patient = await api.forPractice("prac_example").patients.get("pat_example");
if (patient.id !== "pat_example" || paths[1] !== "/v1/practices/prac_example/patients/pat_example") throw new Error("Packed scoped client failed");`;
  await Bun.$`node --input-type=module -e ${approvedRuntime}`.cwd(consumer).quiet();
  await Bun.$`bun -e ${approvedRuntime}`.cwd(consumer).quiet();
} finally {
  await rm(consumer, { force: true, recursive: true });
}
