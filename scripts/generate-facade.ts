import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dir, "..");
const spec = JSON.parse(await readFile(resolve(root, "spec/affinity.openapi.json"), "utf8"));
const apiVersion = spec.info?.version as string | undefined;
const baseUrl = spec.servers?.[0]?.url as string | undefined;
if (!apiVersion || !baseUrl) {
  throw new Error("The OpenAPI contract must define info.version and servers[0].url");
}

const operations = Object.values(spec.paths ?? {}).flatMap((path) =>
  Object.values(path as Record<string, { operationId?: string }>).map(
    (operation) => operation.operationId,
  ),
);
if (operations.length !== 69 || operations.some((operation) => !operation)) {
  throw new Error(`Unexpected deployed OpenAPI operation count: ${operations.length}`);
}

const generated =
  "// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.\n";
async function output(path: string, source: string) {
  const destination = resolve(root, path);
  await mkdir(resolve(destination, ".."), { recursive: true });
  await writeFile(destination, `${generated}\n${source.trim()}\n`);
}

await output(
  "src/affinity.ts",
  `
import { AccountApi } from "./apis/AccountApi";
import { APIKeysApi } from "./apis/APIKeysApi";
import { CatalogApi } from "./apis/CatalogApi";
import { LocationsApi } from "./apis/LocationsApi";
import { OrdersApi } from "./apis/OrdersApi";
import { PatientsApi } from "./apis/PatientsApi";
import { PlatformPricingApi } from "./apis/PlatformPricingApi";
import { PracticesApi } from "./apis/PracticesApi";
import { SessionsApi } from "./apis/SessionsApi";
import { TeamApi } from "./apis/TeamApi";
import { WebhooksApi } from "./apis/WebhooksApi";
import { Configuration, type FetchAPI } from "./runtime";

export interface AffinityOptions {
  apiVersion?: string;
  baseUrl?: string;
  fetch?: FetchAPI;
  headers?: Record<string, string>;
}

export class Affinity {
  readonly account: AccountApi;
  readonly apiKeys: APIKeysApi;
  readonly catalog: CatalogApi;
  readonly locations: LocationsApi;
  readonly orders: OrdersApi;
  readonly patients: PatientsApi;
  readonly platformPricing: PlatformPricingApi;
  readonly practices: PracticesApi;
  readonly sessions: SessionsApi;
  readonly team: TeamApi;
  readonly webhooks: WebhooksApi;

  constructor(apiKey: string, options: AffinityOptions = {}) {
    if (!apiKey.trim()) throw new Error("Affinity requires a service API key");
    const configuration = new Configuration({
      accessToken: apiKey,
      basePath: (options.baseUrl ?? "${baseUrl}").replace(/\\/+$/, ""),
      fetchApi: options.fetch,
      headers: {
        "Affinity-Version": options.apiVersion ?? "${apiVersion}",
        ...options.headers,
      },
    });
    this.account = new AccountApi(configuration);
    this.apiKeys = new APIKeysApi(configuration);
    this.catalog = new CatalogApi(configuration);
    this.locations = new LocationsApi(configuration);
    this.orders = new OrdersApi(configuration);
    this.patients = new PatientsApi(configuration);
    this.platformPricing = new PlatformPricingApi(configuration);
    this.practices = new PracticesApi(configuration);
    this.sessions = new SessionsApi(configuration);
    this.team = new TeamApi(configuration);
    this.webhooks = new WebhooksApi(configuration);
  }
}`,
);

await output("src/errors.ts", await readFile(resolve(root, "scripts/templates/errors.ts"), "utf8"));

const webhookTemplate = await readFile(resolve(root, "templates/webhook-events.ts"), "utf8");
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
) {
  throw new Error("The OpenAPI contract must define the complete x-affinity-webhooks contract");
}
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

const indexPath = resolve(root, "src/index.ts");
const generatedIndex = (await readFile(indexPath, "utf8")).trimEnd();
await writeFile(
  indexPath,
  `${generatedIndex}\n\nexport * from "./affinity";\nexport * from "./errors";\nexport * from "./webhook-events";\n`,
);
