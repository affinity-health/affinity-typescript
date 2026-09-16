import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { facadeOperationMap, validateFacadeOperationCoverage } from "./facade-map";

const root = resolve(import.meta.dir, "..");
const spec = JSON.parse(
  await readFile(resolve(root, "spec/affinity.openapi.json"), "utf8"),
) as Spec;
const apiVersion = spec.info?.version;
const baseUrl = spec.servers?.[0]?.url;
if (!apiVersion || !baseUrl)
  throw new Error("The OpenAPI contract must define info.version and servers[0].url");
validateFacadeOperationCoverage(spec, facadeOperationMap);

const generated =
  "// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.\n";
const httpMethods = new Set(["get", "put", "post", "delete", "options", "head", "patch", "trace"]);
const resourceDefinitions = {
  account: { className: "AccountResource", apiClass: "AccountApi", apiFile: "AccountApi" },
  apiKeys: { className: "APIKeysResource", apiClass: "APIKeysApi", apiFile: "APIKeysApi" },
  catalog: { className: "CatalogResource", apiClass: "CatalogApi", apiFile: "CatalogApi" },
  locations: { className: "LocationsResource", apiClass: "LocationsApi", apiFile: "LocationsApi" },
  orders: { className: "OrdersResource", apiClass: "OrdersApi", apiFile: "OrdersApi" },
  patients: { className: "PatientsResource", apiClass: "PatientsApi", apiFile: "PatientsApi" },
  platformPricing: {
    className: "PlatformPricingResource",
    apiClass: "PlatformPricingApi",
    apiFile: "PlatformPricingApi",
  },
  practices: { className: "PracticesResource", apiClass: "PracticesApi", apiFile: "PracticesApi" },
  sessions: { className: "SessionsResource", apiClass: "SessionsApi", apiFile: "SessionsApi" },
  team: { className: "TeamResource", apiClass: "TeamApi", apiFile: "TeamApi" },
  webhooks: { className: "WebhooksResource", apiClass: "WebhooksApi", apiFile: "WebhooksApi" },
} as const;

type Schema = {
  type?: string;
  minItems?: number;
  maxItems?: number;
  nullable?: boolean;
  required?: string[];
  properties?: Record<string, Schema>;
  anyOf?: Schema[];
  oneOf?: Schema[];
  allOf?: Schema[];
  items?: Schema;
  $ref?: string;
  enum?: Array<string | number | boolean | null>;
};
type Parameter = {
  name?: string;
  in?: string;
  required?: boolean;
  schema?: Schema;
  $ref?: string;
};
type Operation = {
  operationId?: string;
  tags?: string[];
  parameters?: Parameter[];
  requestBody?: { content?: Record<string, { schema?: Schema }> };
};
type PathItem = { parameters?: Parameter[]; [method: string]: Operation | Parameter[] | undefined };
type Spec = {
  info?: { version?: string };
  servers?: Array<{ url?: string }>;
  paths?: Record<string, PathItem>;
  components?: { schemas?: Record<string, Schema>; parameters?: Record<string, Parameter> };
  [extension: string]: unknown;
};
type OperationDetails = {
  operationId: string;
  resource: keyof typeof resourceDefinitions;
  publicMethod: string;
  apiMethod: string;
  apiRequestType: string;
  apiFile: string;
  pathParameters: Parameter[];
  queryParameters: Parameter[];
  headers: Parameter[];
  requiredHeaders: Parameter[];
  bodySchemaName?: string;
  bodySchema?: Schema;
};

function pascalCase(value: string): string {
  return value
    .replace(/[^A-Za-z0-9]+(.)/g, (_, character: string) => character.toUpperCase())
    .replace(/^./, (character) => character.toUpperCase());
}
function camelCaseOperationId(operationId: string): string {
  return operationId.replace(/[^A-Za-z0-9]+(.)/g, (_, character: string) =>
    character.toUpperCase(),
  );
}
function schemaRefName(schema?: Schema): string | undefined {
  const ref = schema?.$ref;
  return ref?.startsWith("#/components/schemas/") ? ref.split("/").pop() : undefined;
}
function resolveParameter(parameter: Parameter): Parameter {
  if (!parameter.$ref) return parameter;
  const name = parameter.$ref.split("/").pop();
  const resolved = name ? spec.components?.parameters?.[name] : undefined;
  if (!resolved) throw new Error(`Unable to resolve OpenAPI parameter ${parameter.$ref}`);
  return resolved;
}

const sourceCache = new Map<string, string>();
async function readSource(file: string) {
  const cached = sourceCache.get(file);
  if (cached) return cached;
  const source = await readFile(resolve(root, `src/apis/${file}.ts`), "utf8");
  sourceCache.set(file, source);
  return source;
}
function loadedSource(file: string): string {
  const source = sourceCache.get(file);
  if (!source) throw new Error(`Generated API source ${file}.ts was not loaded`);
  return source;
}

async function operationEntries(): Promise<OperationDetails[]> {
  const entries: OperationDetails[] = [];
  for (const [path, pathItem] of Object.entries(spec.paths ?? {})) {
    const inherited = (pathItem.parameters ?? []).map(resolveParameter);
    for (const [method, candidate] of Object.entries(pathItem)) {
      if (!httpMethods.has(method) || Array.isArray(candidate)) continue;
      const operation = candidate as Operation;
      const operationId = operation.operationId;
      if (!operationId)
        throw new Error(
          `OpenAPI operation is missing operationId for ${method.toUpperCase()} ${path}`,
        );
      const mapping = facadeOperationMap[operationId as keyof typeof facadeOperationMap];
      if (!mapping) continue;
      if ("rawOnly" in mapping) continue;
      const parameters = [...inherited, ...(operation.parameters ?? [])].map(resolveParameter);
      if (parameters.some((parameter) => !parameter.name || !parameter.in))
        throw new Error(`Facade encountered an unnamed OpenAPI parameter for ${operationId}`);
      const unsupportedParameters = parameters.filter(
        (parameter) => !["path", "query", "header"].includes(parameter.in!),
      );
      if (unsupportedParameters.length > 0)
        throw new Error(
          `Facade does not support ${unsupportedParameters
            .map((parameter) => `${parameter.in}:${parameter.name}`)
            .join(", ")} for ${operationId}`,
        );
      if (operation.requestBody && parameters.some((parameter) => parameter.in === "query"))
        throw new Error(
          `Facade does not support operations with both a body and query parameters: ${operationId}`,
        );
      const supportedHeaders = new Set([
        "affinity-version",
        "idempotency-key",
        "affinity-actor-id",
        "affinity-actor-type",
        "x-affinity-organization-id",
      ]);
      const unsupportedHeaders = parameters.filter(
        (parameter) =>
          parameter.in === "header" && !supportedHeaders.has(parameter.name!.toLowerCase()),
      );
      if (unsupportedHeaders.length > 0)
        throw new Error(
          `Facade does not support headers ${unsupportedHeaders
            .map((parameter) => parameter.name)
            .join(", ")} for ${operationId}`,
        );
      if (
        parameters.some(
          (parameter) =>
            parameter.in === "path" &&
            parameter.schema?.type !== undefined &&
            parameter.schema.type !== "string",
        )
      )
        throw new Error(`Facade path parameters must be strings for ${operationId}`);
      const bodySchema = operation.requestBody?.content?.["application/json"]?.schema;
      const bodySchemaName = schemaRefName(bodySchema);
      if (operation.requestBody && !bodySchemaName)
        throw new Error(`Facade only supports JSON schema references for ${operationId}`);
      const tag = operation.tags?.[0];
      if (!tag) throw new Error(`OpenAPI operation ${operationId} must have a resource tag`);
      const resource = mapping.resource as keyof typeof resourceDefinitions;
      const definition = resourceDefinitions[resource];
      if (!definition) throw new Error(`Unknown facade resource ${resource}`);
      const apiMethod = camelCaseOperationId(operationId);
      const interfaces = [
        ...loadedSource(definition.apiFile).matchAll(/export interface ([A-Za-z0-9_]+)\s*\{/g),
      ].map(([, name]) => name);
      const candidates = [
        `${pascalCase(apiMethod)}${bodySchemaName ? "Operation" : ""}Request`,
        `${pascalCase(apiMethod)}Request`,
      ];
      const apiRequestType = candidates.find((name) => interfaces.includes(name));
      if (!apiRequestType)
        throw new Error(
          `Generated API ${definition.apiFile} has no request type for ${operationId}`,
        );
      const pathNames = [...path.matchAll(/\{([^}]+)\}/g)].map(([, name]) => name);
      const pathParameters = parameters
        .filter((parameter) => parameter.in === "path")
        .sort((left, right) => pathNames.indexOf(left.name!) - pathNames.indexOf(right.name!));
      entries.push({
        operationId,
        resource,
        publicMethod: mapping.method,
        apiMethod,
        apiRequestType,
        apiFile: definition.apiFile,
        pathParameters,
        queryParameters: parameters.filter((parameter) => parameter.in === "query"),
        headers: parameters.filter((parameter) => parameter.in === "header"),
        requiredHeaders: parameters.filter(
          (parameter) => parameter.in === "header" && parameter.required === true,
        ),
        bodySchemaName,
        bodySchema: bodySchemaName ? spec.components?.schemas?.[bodySchemaName] : undefined,
      });
    }
  }
  return entries;
}

for (const resource of Object.values(resourceDefinitions)) await readSource(resource.apiFile);
const details = await operationEntries();

function acceptsNull(schema?: Schema): boolean {
  if (!schema) return false;
  if (schema.nullable || schema.type === "null") return true;
  return [...(schema.anyOf ?? []), ...(schema.oneOf ?? []), ...(schema.allOf ?? [])].some(
    acceptsNull,
  );
}
function nonNullableRequiredKeys(schema?: Schema): string[] {
  return (schema?.required ?? []).filter((key) => !acceptsNull(schema?.properties?.[key]));
}
function typeAlias(alias: string, expression: string): string {
  return `export type ${alias} = ${expression};`;
}
function primitiveSchemaExpression(schema?: Schema): string | undefined {
  if (!schema) return undefined;
  if (schema.anyOf || schema.oneOf) {
    const members = [...(schema.anyOf ?? []), ...(schema.oneOf ?? [])]
      .map(primitiveSchemaExpression)
      .filter((member): member is string => Boolean(member));
    return members.length > 0 ? [...new Set(members)].join(" | ") : undefined;
  }
  if (schema.enum) return schema.enum.map((value) => JSON.stringify(value)).join(" | ");
  if (schema.type === "number" || schema.type === "integer") return "number";
  if (schema.type === "string") return "string";
  if (schema.type === "boolean") return "boolean";
  return undefined;
}
function orderQuantityExpression(operation: OperationDetails): string {
  const schema =
    operation.operationId === "createOrder"
      ? operation.bodySchema?.properties?.prescriptions?.items?.properties?.quantity
      : operation.bodySchema?.properties?.orders?.items?.properties?.prescriptions?.items
          ?.properties?.quantity;
  const expression = primitiveSchemaExpression(schema);
  if (!expression)
    throw new Error(`Unable to derive the order quantity type for ${operation.operationId}`);
  return expression;
}
function assertOrderBounds(): void {
  const create = spec.components?.schemas?.CreateOrderRequest;
  const batch = spec.components?.schemas?.CreateOrderBatchRequest;
  const collections = [
    create?.properties?.prescriptions,
    batch?.properties?.orders,
    batch?.properties?.orders?.items?.properties?.prescriptions,
  ];
  if (collections.some((schema) => schema?.minItems !== 1 || schema?.maxItems !== 20))
    throw new Error(
      "Order collection limits changed; review clinical facade validation before generating",
    );
}
assertOrderBounds();

function bodyAliases(operation: OperationDetails): string[] {
  if (!operation.bodySchemaName || !operation.bodySchema) return [];
  const model = operation.bodySchemaName;
  const alias = paramsType(operation)!;
  const required = nonNullableRequiredKeys(operation.bodySchema);
  let expression = required.length
    ? `Omit<${model}, ${required.map((key) => JSON.stringify(key)).join(" | ")}> & { ${required
        .map((key) => `${key}: NonNullable<${model}[${JSON.stringify(key)}]>`)
        .join("; ")} }`
    : model;
  if (operation.operationId === "createOrder") {
    const quantity = orderQuantityExpression(operation);
    expression = `Omit<${model}, "practiceId" | "patientId" | "patient" | "prescriptions"> & {
  practiceId: NonNullable<${model}["practiceId"]>;
  prescriptions: CreateOrderPrescriptionParams[];
} & (
  | { patientId: string; patient?: never }
  | { patient: NonNullable<${model}["patient"]>; patientId?: never }
)`;
    return [
      typeAlias("OrderQuantity", quantity),
      typeAlias(
        "CreateOrderPrescriptionParams",
        `Omit<${model}["prescriptions"][number], "quantity"> & { quantity: OrderQuantity }`,
      ),
      typeAlias(alias, expression),
    ];
  }
  if (operation.operationId === "createOrderBatch") {
    const quantity = orderQuantityExpression(operation);
    expression = `Omit<${model}, "practiceId" | "orders"> & {
  practiceId: NonNullable<${model}["practiceId"]>;
  orders: CreateOrderBatchOrderParams[];
}`;
    return [
      typeAlias("OrderQuantity", quantity),
      typeAlias(
        "CreateOrderBatchOrderParams",
        `Omit<${model}["orders"][number], "patientId" | "patient" | "prescriptions"> & {
  prescriptions: CreateOrderBatchPrescriptionParams[];
} & (
  | { patientId: string; patient?: never }
  | { patient: NonNullable<${model}["orders"][number]["patient"]>; patientId?: never }
)`,
      ),
      typeAlias(
        "CreateOrderBatchPrescriptionParams",
        `Omit<${model}["orders"][number]["prescriptions"][number], "quantity"> & { quantity: OrderQuantity }`,
      ),
      typeAlias(alias, expression),
    ];
  }
  return [typeAlias(alias, expression)];
}

function headerName(parameter: Parameter): string {
  return parameter.name?.toLowerCase() ?? "";
}
function requestOptionsType(operation: OperationDetails): string {
  return operation.requiredHeaders.some((parameter) => headerName(parameter) === "idempotency-key")
    ? "MutationOptions"
    : "RequestOptions";
}
function paramsType(operation: OperationDetails): string | undefined {
  if (operation.resource === "platformPricing")
    return `PlatformPricing${pascalCase(operation.publicMethod)}Params`;
  if (operation.bodySchemaName) return `${operation.bodySchemaName.replace(/Request$/, "")}Params`;
  return operation.queryParameters.length > 0
    ? `${pascalCase(operation.apiMethod)}Params`
    : undefined;
}
function queryAlias(operation: OperationDetails): string | undefined {
  if (operation.bodySchemaName || operation.queryParameters.length === 0) return undefined;
  const omitted = [
    ...operation.pathParameters.map((parameter) => parameter.name),
    "affinityVersion",
    "idempotencyKey",
    "affinityActorId",
    "affinityActorType",
    "xAffinityOrganizationId",
  ].filter((name): name is string => Boolean(name));
  const requiredQueries = operation.queryParameters
    .filter((parameter) => parameter.required === true && !acceptsNull(parameter.schema))
    .map((parameter) => parameter.name!);
  const allOmitted = [...omitted, ...requiredQueries];
  const expression = allOmitted.length
    ? `Omit<${operation.apiRequestType}, ${allOmitted.map((name) => JSON.stringify(name)).join(" | ")}>${
        requiredQueries.length
          ? ` & { ${requiredQueries
              .map(
                (name) =>
                  `${name}: NonNullable<${operation.apiRequestType}[${JSON.stringify(name)}]>`,
              )
              .join("; ")} }`
          : ""
      }`
    : operation.apiRequestType;
  return typeAlias(paramsType(operation)!, expression);
}
function optionsExpression(operation: OperationDetails): string[] {
  const expressions: string[] = ["...commonHeaders(options)"];
  if (operation.requiredHeaders.some((parameter) => headerName(parameter) === "idempotency-key"))
    expressions.push("idempotencyKey: requiredIdempotencyKey(options)");
  if (operation.requiredHeaders.some((parameter) => headerName(parameter) === "affinity-actor-id"))
    expressions.push("...actorHeaders(options, this.defaultActor)");
  if (operation.headers.some((parameter) => headerName(parameter) === "x-affinity-organization-id"))
    expressions.push("...organizationHeader(options)");
  return expressions;
}
function renderMethod(operation: OperationDetails): string {
  const args = operation.pathParameters.map((parameter) => `${parameter.name}: string`);
  const params = paramsType(operation);
  const requiredQuery = operation.queryParameters.some((parameter) => parameter.required === true);
  if (params)
    args.push(
      `params: ${params}${operation.queryParameters.length > 0 && !requiredQuery ? " = {}" : ""}`,
    );
  const optionType = requestOptionsType(operation);
  args.push(`options${optionType === "MutationOptions" ? "" : "?"}: ${optionType}`);
  const fields: string[] = [];
  if (operation.queryParameters.length > 0) fields.push("...params");
  fields.push(
    ...operation.pathParameters.map((parameter) => `${parameter.name}: ${parameter.name}`),
  );
  if (operation.bodySchemaName) {
    const bodyProperty =
      operation.bodySchemaName[0]!.toLowerCase() + operation.bodySchemaName.slice(1);
    fields.push(`${bodyProperty}: params`);
  }
  fields.push(...optionsExpression(operation));
  const validation =
    operation.operationId === "createOrder"
      ? "    validateCreateOrderParams(params);\n"
      : operation.operationId === "createOrderBatch"
        ? "    validateCreateOrderBatchParams(params);\n"
        : "";
  const apiClass = resourceDefinitions[operation.resource].apiClass;
  return `  ${operation.publicMethod}(${args.join(", ")}): ReturnType<${apiClass}["${operation.apiMethod}"]> {
${validation}    return this.api.${operation.apiMethod}({ ${fields.join(", ")} }, requestOverrides(options));
  }`;
}

function orderValidationSource(): string {
  return `function validateOrderPatient(params: { patientId?: unknown; patient?: unknown }, label: string): void {
  const hasPatientId = params.patientId !== undefined && params.patientId !== null;
  const hasPatient = params.patient !== undefined && params.patient !== null;
  if (hasPatientId === hasPatient)
    throw new Error(label + " requires exactly one of patientId or patient");
  if (hasPatientId && (typeof params.patientId !== "string" || !params.patientId.trim()))
    throw new Error(label + " requires a non-empty patientId");
  if (hasPatient && (typeof params.patient !== "object" || Array.isArray(params.patient)))
    throw new Error(label + " requires an inline patient object");
}

function validateCreateOrderParams(params: CreateOrderParams): void {
  if (!params || typeof params !== "object" || typeof params.practiceId !== "string" || !params.practiceId.trim())
    throw new Error("Create order requires a non-empty practiceId");
  validateOrderPatient(params, "Create order");
  if (!Array.isArray(params.prescriptions) || params.prescriptions.length < 1 || params.prescriptions.length > 20)
    throw new Error("Create order requires between 1 and 20 prescriptions");
}

function validateCreateOrderBatchParams(params: CreateOrderBatchParams): void {
  if (!params || typeof params !== "object" || typeof params.practiceId !== "string" || !params.practiceId.trim())
    throw new Error("Create order batch requires a non-empty practiceId");
  if (!Array.isArray(params.orders) || params.orders.length < 1 || params.orders.length > 20)
    throw new Error("Create order batch requires between 1 and 20 orders");
  for (const [index, order] of params.orders.entries()) {
    if (!order || typeof order !== "object") throw new Error("Order batch item " + index + " must be an order");
    validateOrderPatient(order, "Order batch item " + index);
    if (!Array.isArray(order.prescriptions) || order.prescriptions.length < 1 || order.prescriptions.length > 20)
      throw new Error("Order batch item " + index + " requires between 1 and 20 prescriptions");
  }
}`;
}

function resourceSource(
  resource: keyof typeof resourceDefinitions,
  operations: OperationDetails[],
): string {
  const definition = resourceDefinitions[resource];
  const requestTypes = new Set(operations.map((operation) => operation.apiRequestType));
  const modelTypes = new Set(
    operations.map((operation) => operation.bodySchemaName).filter(Boolean),
  );
  const aliases = operations
    .flatMap((operation) => [queryAlias(operation), ...bodyAliases(operation)])
    .filter((alias): alias is string => Boolean(alias));
  const apiImport = `import type { ${definition.apiClass}${requestTypes.size ? `, ${[...requestTypes].join(", ")}` : ""} } from "../apis/${definition.apiFile}";`;
  const modelImports = [...modelTypes].map(
    (model) => `import type { ${model} } from "../models/${model}";`,
  );
  const needsActor = operations.some((operation) =>
    operation.requiredHeaders.some((parameter) =>
      ["affinity-actor-id", "affinity-actor-type"].includes(headerName(parameter)),
    ),
  );
  const sharedImports = [
    "commonHeaders",
    "requestOverrides",
    "type MutationOptions",
    "type RequestOptions",
  ];
  if (
    operations.some((operation) =>
      operation.requiredHeaders.some((parameter) => headerName(parameter) === "idempotency-key"),
    )
  )
    sharedImports.push("requiredIdempotencyKey");
  if (needsActor) sharedImports.push("actorHeaders", "type AffinityActor");
  if (
    operations.some((operation) =>
      operation.headers.some((parameter) => headerName(parameter) === "x-affinity-organization-id"),
    )
  )
    sharedImports.push("organizationHeader");
  return [
    apiImport,
    ...modelImports,
    `import { ${sharedImports.join(", ")} } from "./shared";`,
    "",
    ...new Set(aliases),
    ...(operations.some(
      (operation) =>
        operation.operationId === "createOrder" || operation.operationId === "createOrderBatch",
    )
      ? [orderValidationSource()]
      : []),
    "",
    `export class ${definition.className} {`,
    `  constructor(private readonly api: ${definition.apiClass}${needsActor ? ", private readonly defaultActor?: AffinityActor" : ""}) {}`,
    ...operations.map(renderMethod),
    "}",
  ].join("\n");
}

async function output(path: string, source: string) {
  const destination = resolve(root, path);
  await mkdir(resolve(destination, ".."), { recursive: true });
  await writeFile(destination, `${generated}\n${source.trim()}\n`);
}

const grouped = new Map<keyof typeof resourceDefinitions, OperationDetails[]>();
for (const operation of details)
  grouped.set(operation.resource, [...(grouped.get(operation.resource) ?? []), operation]);
await rm(resolve(root, "src/resources"), { force: true, recursive: true });
await mkdir(resolve(root, "src/resources"), { recursive: true });
for (const resource of Object.keys(resourceDefinitions) as Array<keyof typeof resourceDefinitions>)
  await output(
    `src/resources/${resource}.ts`,
    resourceSource(resource, grouped.get(resource) ?? []),
  );

const resourceExports = (
  Object.keys(resourceDefinitions) as Array<keyof typeof resourceDefinitions>
)
  .map((resource) => `export * from "./resources/${resource}.js";`)
  .join("\n");
await output(
  "src/resources.ts",
  `${resourceExports}\nexport type { AffinityActor, AffinityActorType, MutationOptions, RequestOptions } from "./resources/shared.js";`,
);

await rm(resolve(root, "src/raw.ts"), { force: true });

const rawClientSource = `import type { Configuration } from "./runtime";
${Object.values(resourceDefinitions)
  .map(({ apiClass, apiFile }) => `import { ${apiClass} } from "./apis/${apiFile}";`)
  .join("\n")}

/** The generated OpenAPI clients, available for lower-level escape-hatch use. */
export class RawClient {
${Object.entries(resourceDefinitions)
  .map(([resource, { apiClass }]) => `  readonly ${resource}: ${apiClass};`)
  .join("\n")}

  constructor(configuration: Configuration) {
${Object.entries(resourceDefinitions)
  .map(([resource, { apiClass }]) => `    this.${resource} = new ${apiClass}(configuration);`)
  .join("\n")}
  }
}`;
await output("src/raw.ts", rawClientSource);

await output(
  "src/affinity.ts",
  `import { Configuration, type FetchAPI } from "./runtime";
import { RawClient } from "./raw";
import {
  AccountResource,
  APIKeysResource,
  CatalogResource,
  LocationsResource,
  OrdersResource,
  PatientsResource,
  PlatformPricingResource,
  PracticesResource,
  SessionsResource,
  TeamResource,
  WebhooksResource,
} from "./resources";
import {
  type AffinityActor,
  validateAffinityActor,
  validateCustomHeaders,
  validateNonEmptyOption,
} from "./resources/shared";

export interface AffinityOptions {
  actor?: AffinityActor;
  apiVersion?: string;
  baseUrl?: string;
  fetch?: FetchAPI;
  headers?: Record<string, string>;
  organizationId?: string;
}

export class Affinity {
  readonly raw: RawClient;
  readonly account: AccountResource;
  readonly apiKeys: APIKeysResource;
  readonly catalog: CatalogResource;
  readonly locations: LocationsResource;
  readonly orders: OrdersResource;
  readonly patients: PatientsResource;
  readonly platformPricing: PlatformPricingResource;
  readonly practices: PracticesResource;
  readonly sessions: SessionsResource;
  readonly team: TeamResource;
  readonly webhooks: WebhooksResource;
  private readonly apiKey: string;
  private readonly options: AffinityOptions;

  constructor(apiKey: string, options: AffinityOptions = {}) {
    if (typeof apiKey !== "string" || !apiKey.trim())
      throw new Error("Affinity requires a service API key");
    const actor = options.actor === undefined ? undefined : validateAffinityActor(options.actor);
    const headers = validateCustomHeaders(options.headers);
    const version = options.apiVersion !== undefined
      ? validateNonEmptyOption(options.apiVersion, "apiVersion")
      : "${apiVersion}";
    const organizationId = options.organizationId !== undefined
      ? validateNonEmptyOption(options.organizationId, "organizationId")
      : undefined;
    this.apiKey = apiKey;
    this.options = {
      ...options,
      headers,
      apiVersion: version,
      ...(actor ? { actor } : {}),
      ...(organizationId ? { organizationId } : {}),
    };
    const configuration = new Configuration({
      accessToken: apiKey,
      basePath: (options.baseUrl ?? "${baseUrl}").replace(/\\/+$/, ""),
      fetchApi: options.fetch,
      headers: {
        ...headers,
        "Affinity-Version": version,
        ...(actor ? { "Affinity-Actor-Id": actor.id, "Affinity-Actor-Type": actor.type } : {}),
        ...(organizationId ? { "X-Affinity-Organization-Id": organizationId } : {}),
      },
    });
    const raw = new RawClient(configuration);
    this.raw = raw;
${Object.entries(resourceDefinitions)
  .map(
    ([resource, { className, apiClass }]) =>
      `    this.${resource} = new ${className}(raw.${resource}${grouped.get(resource as keyof typeof resourceDefinitions)?.some((operation) => operation.requiredHeaders.some((header) => headerName(header) === "affinity-actor-id")) ? ", actor" : ""});`,
  )
  .join("\n")}
  }

  withActor(actor: AffinityActor): Affinity {
    return new Affinity(this.apiKey, { ...this.options, actor });
  }
}`,
);

await output(
  "src/index.ts",
  `export * from "./affinity";
export * from "./errors";
export { ResponseError, FetchError, RequiredError } from "./runtime";
export type * from "./resources";
export * from "./webhook-events";`,
);

await output("src/errors.ts", await readFile(resolve(root, "scripts/templates/errors.ts"), "utf8"));
const webhookContract = spec["x-affinity-webhooks"] as {
  apiVersion?: string;
  eventTypes?: string[];
  orderStatuses?: string[];
  signatureHeader?: string;
};
if (
  webhookContract.apiVersion !== apiVersion ||
  !webhookContract.eventTypes?.length ||
  !webhookContract.orderStatuses?.length ||
  !webhookContract.signatureHeader
)
  throw new Error("The OpenAPI contract must define the complete x-affinity-webhooks contract");
const webhookTemplate = await readFile(resolve(root, "templates/webhook-events.ts"), "utf8");
await output(
  "src/webhook-events.ts",
  webhookTemplate
    .replace("__AFFINITY_WEBHOOK_API_VERSION__", JSON.stringify(apiVersion))
    .replace("__AFFINITY_WEBHOOK_EVENT_TYPES__", JSON.stringify(webhookContract.eventTypes))
    .replace("__AFFINITY_ORDER_STATUSES__", JSON.stringify(webhookContract.orderStatuses))
    .replace(
      "__AFFINITY_WEBHOOK_SIGNATURE_HEADER__",
      JSON.stringify(webhookContract.signatureHeader),
    ),
);

await output(
  "src/resources/shared.ts",
  await readFile(resolve(root, "templates/resources-shared.ts"), "utf8"),
);
