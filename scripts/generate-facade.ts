import { createHash } from "node:crypto";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { sdkContract } from "./sdk-contract";

type Schema = {
  $ref?: string;
  type?: string | string[];
  enum?: unknown[];
  const?: unknown;
  anyOf?: Schema[];
  oneOf?: Schema[];
  allOf?: Schema[];
  items?: Schema;
  properties?: Record<string, Schema>;
  required?: string[];
  additionalProperties?: boolean | Schema;
};
type Parameter = { name: string; in: string; required?: boolean; schema: Schema };
type Endpoint = {
  operationId: string;
  parameters?: Parameter[];
  requestBody?: { required?: boolean; content: Record<string, { schema: Schema }> };
  responses: Record<string, { content?: Record<string, { schema: Schema }> }>;
};
const root = resolve(import.meta.dir, "..");
const pinned = await readFile(resolve(root, "spec/affinity.openapi.json"), "utf8");
const spec = sdkContract(JSON.parse(pinned)) as {
  info: { version: string };
  paths: Record<string, Record<string, Endpoint>>;
  components?: { schemas?: Record<string, Schema> };
};
const generated =
  "// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.\n";
async function output(path: string, source: string) {
  await mkdir(resolve(root, path, ".."), { recursive: true });
  await writeFile(resolve(root, path), `${generated}\n${source.trim()}\n`);
}
function ts(schema: Schema): string {
  if (schema.$ref) {
    const target = spec.components?.schemas?.[schema.$ref.split("/").at(-1)!];
    if (!target) throw new Error(`Unsupported schema reference ${schema.$ref}`);
    return ts(target);
  }
  if ("const" in schema) return JSON.stringify(schema.const);
  if (schema.enum)
    return [...new Set(schema.enum.map((value) => JSON.stringify(value)))].join(" | ");
  const union = schema.anyOf ?? schema.oneOf;
  if (union) return [...new Set(union.map(ts))].map((value) => `(${value})`).join(" | ");
  if (schema.allOf) return schema.allOf.map((value) => `(${ts(value)})`).join(" & ");
  if (Array.isArray(schema.type))
    return schema.type.map((type) => ts({ ...schema, type })).join(" | ");
  switch (schema.type) {
    case "null":
      return "null";
    case "string":
    case "boolean":
      return schema.type;
    case "integer":
    case "number":
      return "number";
    case "array":
      return `Array<${ts(schema.items ?? {})}>`;
    case "object": {
      const fields = Object.entries(schema.properties ?? {}).map(
        ([name, value]) =>
          `${JSON.stringify(name)}${schema.required?.includes(name) ? "" : "?"}: ${ts(value)};`,
      );
      if (schema.additionalProperties && typeof schema.additionalProperties === "object")
        fields.push(`[key: string]: ${ts(schema.additionalProperties)};`);
      else if (schema.additionalProperties === true) fields.push("[key: string]: unknown;");
      return fields.length ? `{ ${fields.join(" ")} }` : "Record<string, unknown>";
    }
    default:
      throw new Error(`Unsupported JSON schema: ${JSON.stringify(schema)}`);
  }
}
const resources: Record<string, [string, string, string]> = {
  "account.account": ["account", "Account", "get"],
  createFeedback: ["feedback", "Feedback", "create"],
  "medications.list": ["medications", "Medication", "list"],
  "medications.get": ["medications", "Medication", "get"],
  "orders.create": ["orders", "Order", "create"],
  "orders.list": ["orders", "Order", "list"],
  "orders.get": ["orders", "Order", "get"],
  "orders.cancel": ["orders", "Order", "cancel"],
  "practices.create": ["practices", "Practice", "create"],
  "practices.list": ["practices", "Practice", "list"],
  "practices.get": ["practices", "Practice", "get"],
  "practices.update": ["practices", "Practice", "update"],
  "webhooks.list": ["webhooks.endpoints", "WebhookEndpoint", "list"],
  "webhooks.create": ["webhooks.endpoints", "WebhookEndpoint", "create"],
  "webhooks.update": ["webhooks.endpoints", "WebhookEndpoint", "update"],
  "webhooks.remove": ["webhooks.endpoints", "WebhookEndpoint", "delete"],
};
const operations: Record<string, unknown> = {};
const sdkMethods: Record<string, string> = {};
const operationPaths: Record<string, string> = {};
const types: string[] = [];
const groups = new Map<string, { name: string; methods: string[] }>();
for (const [path, methods] of Object.entries(spec.paths)) {
  for (const [verb, endpoint] of Object.entries(methods)) {
    const id = endpoint.operationId;
    if (!id) continue;
    const mapping = resources[id];
    if (!mapping) throw new Error(`Map the public operation ${id} before generating`);
    const [group, singular, method] = mapping;
    const cap = method[0]!.toUpperCase() + method.slice(1);
    const name = `${singular}${cap}`;
    const ids = (endpoint.parameters ?? []).filter((p) => p.in === "path").map((p) => p.name);
    const query = (endpoint.parameters ?? []).filter((p) => p.in === "query");
    const body = endpoint.requestBody?.content["application/json"]?.schema;
    const params =
      body ??
      (query.length
        ? ({
            type: "object",
            properties: Object.fromEntries(
              query.map((p) => [
                p.name,
                p.name === "limit"
                  ? // Pier describes the encoded query string; SDK callers supply an integer page size.
                    { anyOf: [{ type: "integer", minimum: 1, maximum: 100 }, { type: "null" }] }
                  : p.schema,
              ]),
            ),
            required: query.filter((p) => p.required).map((p) => p.name),
          } satisfies Schema)
        : undefined);
    const required =
      Boolean(body && endpoint.requestBody?.required) || query.some((p) => p.required);
    const key = (endpoint.parameters ?? []).some(
      (p) => p.in === "header" && p.name.toLowerCase() === "idempotency-key" && p.required,
    );
    const success = Object.entries(endpoint.responses).filter(([status]) => /^2\d\d$/.test(status));
    const returns = [
      ...new Set(
        success
          .map(([, response]) => response.content?.["application/json"]?.schema)
          .map((schema) => (schema ? ts(schema) : "void")),
      ),
    ];
    if (!returns.length) throw new Error(`Missing success response for ${id}`);
    types.push(`export type ${name}Response = ${returns.join(" | ")};`);
    if (params) types.push(`export type ${name}Params = ${ts(params)};`);
    operations[id] = {
      path,
      verb: verb.toUpperCase(),
      ids,
      query: query.map((p) => p.name),
      body: Boolean(body),
      idempotency: key,
    };
    sdkMethods[id] = `${group}.${method}`;
    operationPaths[id] = `${verb.toUpperCase()} ${path}`;
    const args = [
      ...ids.map((id) => `${id}: string`),
      ...(params ? [`params: ${name}Params${required ? "" : " = {}"}`] : []),
      `options: ${key ? "RequiredKeyOptions" : "SDKRequestOptions = {}"}`,
    ].join(", ");
    const g = groups.get(group) ?? { name: `${singular}Resource`, methods: [] };
    g.methods.push(
      `${method}(${args}): Promise<${name}Response> { return this.context.call(operations[${JSON.stringify(id)}], [${ids.join(", ")}], ${params ? "params" : "{}"}, options); }`,
    );
    if (method === "list")
      g.methods.push(
        `iterate(params: ${name}Params = {}, options: SDKRequestOptions = {}): AsyncIterable<${name}Response["data"][number]> { return this.context.iterate(operations[${JSON.stringify(id)}], params, options); }`,
      );
    groups.set(group, g);
  }
}
const classes = [...groups.values()].map(
  (g) =>
    `class ${g.name} { constructor(private readonly context: SDKContext) {} ${g.methods.join("\n")} }`,
);
const properties = [...groups.entries()].map(([group, g]) =>
  group.includes(".")
    ? `readonly webhooks: { endpoints: ${g.name} };`
    : `readonly ${group}: ${g.name};`,
);
const assignments = [...groups.entries()].map(([group, g]) =>
  group.includes(".")
    ? `this.webhooks = { endpoints: new ${g.name}(context) };`
    : `this.${group} = new ${g.name}(context);`,
);
const affinity = `export class Affinity { ${properties.join("\n")} constructor(apiKey: string, options: SDKOptions = {}) { const context = new SDKContext(apiKey, options); ${assignments.join("\n")} } }`;
await rm(resolve(root, "src"), { recursive: true, force: true });
const { version } = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"));
await output(
  "src/sdk.ts",
  (await readFile(resolve(root, "templates/sdk.ts"), "utf8"))
    .replace("__AFFINITY_SDK_VERSION__", version)
    .replace("__AFFINITY_API_VERSION__", spec.info.version)
    .replace(
      "__AFFINITY_OPERATIONS__",
      `const operations = ${JSON.stringify(operations)} as const;`,
    )
    .replace("__AFFINITY_TYPES__", types.join("\n"))
    .replace("__AFFINITY_RESOURCES__", [...classes, affinity].join("\n")),
);
await output("src/transport.ts", await readFile(resolve(root, "templates/transport.ts"), "utf8"));
await output("src/errors.ts", await readFile(resolve(root, "scripts/templates/errors.ts"), "utf8"));
const orderSchema =
  spec.paths["/v1/orders/{orderId}"]!.get!.responses["200"]!.content!["application/json"]!.schema;
const statuses = orderSchema.properties!.status!.enum as string[];
if (!statuses?.length) throw new Error("Order statuses must be defined in the pinned API contract");
await output(
  "src/webhook-events.ts",
  (await readFile(resolve(root, "templates/webhook-events.ts"), "utf8"))
    .replace("__AFFINITY_WEBHOOK_API_VERSION__", JSON.stringify(spec.info.version))
    .replace("__AFFINITY_ORDER_STATUSES__", JSON.stringify(statuses))
    .replace(
      "__AFFINITY_WEBHOOK_EVENT_TYPES__",
      JSON.stringify([
        ...statuses.filter((s) => s !== "draft").map((s) => `order.${s}`),
        "order.updated",
        "webhook_endpoint.test",
      ]),
    ),
);

await output(
  "src/domain.ts",
  `import type { AccountGetResponse, MedicationGetResponse, OrderGetResponse, OrderCreateResponse, PracticeGetResponse } from "./sdk";
export type Account = AccountGetResponse;
export type Medication = MedicationGetResponse;
export type Order = OrderGetResponse;
export type CreatedOrder = OrderCreateResponse;
export type Practice = PracticeGetResponse;
export type Patient = Order["patient"];
export type Prescription = Order["prescriptions"][number];`,
);
await output(
  "src/index.ts",
  `export * from "./sdk";\nexport * from "./errors";\nexport type * from "./domain";\nexport * from "./webhook-events";`,
);
await writeFile(
  resolve(root, "generation.json"),
  JSON.stringify(
    {
      contractVersion: spec.info.version,
      contractSha256: createHash("sha256").update(pinned).digest("hex"),
      generator: "scripts/generate-facade.ts",
      operations: operationPaths,
      sdkMethods,
    },
    null,
    2,
  ) + "\n",
);
