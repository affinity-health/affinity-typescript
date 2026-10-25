import { createHash } from "node:crypto";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { sdkContract } from "./sdk-contract";
const root = resolve(import.meta.dir, "..");
const raw = await readFile(resolve(root, "spec/affinity.openapi.json"), "utf8");
const spec = sdkContract(JSON.parse(raw));
const { version } = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"));
const generated =
  "// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.\n";
async function output(path: string, source: string) {
  const dest = resolve(root, path);
  await mkdir(resolve(dest, ".."), { recursive: true });
  await writeFile(dest, generated + "\n" + source.trim() + "\n");
}
// Fail on unsupported schema constructs rather than silently widening public contracts.
function type(s: any): string {
  if (s === false) return "never";
  if (s === true || !s || Object.keys(s).length === 0) return "unknown";
  if (!s.type && !s.anyOf && !s.oneOf && !s.allOf && !s.enum && s.const === undefined && !s.$ref)
    return "unknown";
  if (s.$ref) throw new Error(`Unsupported reference ${s.$ref}`);
  if (s.enum) return s.enum.map((v: unknown) => JSON.stringify(v)).join(" | ");
  if (s.const !== undefined) return JSON.stringify(s.const);
  if (s.anyOf || s.oneOf) return (s.anyOf ?? s.oneOf).map((v: any) => `(${type(v)})`).join(" | ");
  if (s.allOf) {
    const { allOf, ...base } = s;
    return [base, ...allOf].map((v: any) => `(${type(v)})`).join(" & ");
  }
  if (Array.isArray(s.type)) return s.type.map((v: string) => type({ ...s, type: v })).join(" | ");
  switch (s.type) {
    case "null":
      return "null";
    case "string":
      return "string";
    case "integer":
    case "number":
      return "number";
    case "boolean":
      return "boolean";
    case "array":
      return `Array<${type(s.items)}>`;
    case "object": {
      const fields = Object.entries(s.properties ?? {}).map(
        ([k, v]) => `${JSON.stringify(k)}${s.required?.includes(k) ? "" : "?"}: ${type(v)};`,
      );
      if (s.additionalProperties)
        fields.push(
          `[key: string]: ${s.additionalProperties === true ? "unknown" : type(s.additionalProperties)};`,
        );
      return `{${fields.join("\n")}}`;
    }
    default:
      throw new Error(`Unsupported schema ${JSON.stringify(s)}`);
  }
}
const singular: Record<string, string> = {
  medications: "Medication",
  orders: "Order",
  practices: "Practice",
  webhooks: "Webhook",
  account: "Account",
  feedback: "Feedback",
};
const operations: Record<string, any> = {};
const methods: Record<string, string> = {};
const types: string[] = [];
const groups: Record<string, string[]> = {};
for (const [path, verbs] of Object.entries(spec.paths))
  for (const [verb, op] of Object.entries(verbs as Record<string, unknown>) as [string, any][]) {
    if (!op.operationId) continue;
    const [group, action] = op.operationId.includes(".")
      ? op.operationId.split(".")
      : ["feedback", "create"];
    const method = group === "account" ? "get" : action;
    const prefix = singular[group];
    if (!prefix) throw new Error(`Unknown group ${group}`);
    const title = prefix + method[0].toUpperCase() + method.slice(1);
    const paramsName = title + "Params",
      responseName = title + "Response";
    const parameters = op.parameters ?? [];
    const ids = parameters.filter((p: any) => p.in === "path").map((p: any) => p.name);
    const queries = parameters.filter((p: any) => p.in === "query");
    const body = op.requestBody?.content?.["application/json"]?.schema;
    if (body && queries.length) throw new Error("Mixed body and query requires explicit handling");
    const params =
      body ??
      (queries.length
        ? {
            type: "object",
            properties: Object.fromEntries(queries.map((p: any) => [p.name, p.schema])),
            required: queries.filter((p: any) => p.required).map((p: any) => p.name),
          }
        : undefined);
    const required = !!(body ? op.requestBody.required : queries.some((p: any) => p.required));
    const responses = Object.entries(op.responses)
      .filter(([code]) => /^2\d\d$/.test(code))
      .map(([, r]: any) => type(r.content?.["application/json"]?.schema ?? false));
    types.push(`export type ${responseName} = ${[...new Set(responses)].join(" | ")};`);
    if (params) types.push(`export type ${paramsName} = ${type(params)};`);
    const idempotency = parameters.some(
      (p: any) => p.in === "header" && p.name.toLowerCase() === "idempotency-key",
    );
    const record = {
      path,
      verb: verb.toUpperCase(),
      ids,
      query: queries.map((p: any) => p.name),
      body: !!body,
      idempotency,
      requiresPersistedKey: op.operationId === "orders.create",
    };
    operations[op.operationId] = record;
    methods[op.operationId] = `${group}.${method}`;
    const args = ids.map((id: string) => `${id}: string`);
    if (params) args.push(`params: ${paramsName}${required ? "" : " = {}"}`);
    args.push(
      op.operationId === "orders.create"
        ? "options: RequiredKeyOptions"
        : `options: ${idempotency ? "SDKRequestOptions" : "UnkeyedRequestOptions"} = {}`,
    );
    const invocation = `operations[${JSON.stringify(op.operationId)}], [${ids.join(",")}], ${params ? "params" : "{}"}, options`;
    (groups[group] ??= []).push(
      `${method}(${args.join(",")}): Promise<${responseName}> {return this.context.call(${invocation});}`,
    );
    if (op["x-pier-pagination"])
      groups[group].push(
        `iterate(${args.join(",")}): AsyncIterable<${responseName}["data"][number]> { return this.context.iterate(${invocation}); }`,
      );
  }
await rm(resolve(root, "src"), { recursive: true, force: true });
let sdk = (await readFile(resolve(root, "templates/sdk.ts"), "utf8"))
  .replace("__AFFINITY_SDK_VERSION__", version)
  .replace("__AFFINITY_API_VERSION__", spec.info.version);
sdk += `\nconst operations = ${JSON.stringify(operations)} as const;\n${types.join("\n")}\n`;
for (const [group, body] of Object.entries(groups))
  sdk += `export class ${singular[group]}SDKResource {constructor(private readonly context: SDKContext) {}\n${body.join("\n")}\n}\n`;
sdk += `export class Affinity {private readonly context: SDKContext; constructor(apiKey: string,options:SDKOptions = {}) {this.context=new SDKContext(new SDKTransport(apiKey,options));}\n${Object.keys(
  groups,
)
  .map((g) => `get ${g}() {return new ${singular[g]}SDKResource(this.context);}`)
  .join("\n")}\n}`;
await output("src/sdk.ts", sdk);
await output("src/transport.ts", await readFile(resolve(root, "templates/transport.ts"), "utf8"));
await output("src/errors.ts", await readFile(resolve(root, "scripts/templates/errors.ts"), "utf8"));
await output(
  "src/index.ts",
  'export * from "./sdk";\nexport * from "./errors";\nexport type * from "./domain";\nexport * from "./webhook-events";',
);
await output(
  "src/domain.ts",
  'import type { OrderCreateParams, OrderGetResponse, MedicationGetResponse, PracticeGetResponse } from "./sdk";\nexport type Patient = OrderCreateParams["patient"];\nexport type Order = OrderGetResponse;\nexport type CreatedOrder = OrderGetResponse;\nexport type Medication = MedicationGetResponse;\nexport type Practice = PracticeGetResponse;',
);
const events = spec.webhooks.orderEvent.post.requestBody.content["application/json"].schema.anyOf;
const orderEvent = events.find((e: any) => e.properties.data.properties?.order);
const eventTypes = events.flatMap((e: any) => e.properties.type.enum);
const webhook = (await readFile(resolve(root, "templates/webhook-events.ts"), "utf8"))
  .replace("__AFFINITY_KNOWN_WEBHOOK_EVENT__", type({ anyOf: events }))
  .replace("__AFFINITY_WEBHOOK_API_VERSION__", JSON.stringify(spec.info.version))
  .replace("__AFFINITY_WEBHOOK_EVENT_TYPES__", JSON.stringify(eventTypes))
  .replace(
    "__AFFINITY_ORDER_STATUSES__",
    JSON.stringify(orderEvent.properties.data.properties.order.properties.status.enum),
  )
  .replace("__AFFINITY_WEBHOOK_SIGNATURE_HEADER__", JSON.stringify("Affinity-Signature"));
await output("src/webhook-events.ts", webhook);
await writeFile(
  resolve(root, "generation.json"),
  JSON.stringify(
    {
      contractVersion: spec.info.version,
      contractSha256: createHash("sha256").update(raw).digest("hex"),
      language: "typescript",
      generator: "scripts/generate-facade.ts",
      operations: Object.fromEntries(
        Object.entries(operations).map(([id, o]) => [id, `${o.verb} ${o.path}`]),
      ),
      sdkMethods: methods,
    },
    null,
    2,
  ) + "\n",
);
