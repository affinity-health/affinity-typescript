// Generates src/generated with Fern from spec/affinity.openapi.json, the committed Affinity
// contract. Fern runs locally in Docker; no Fern account or token is used.
import { createHash } from "node:crypto";
import { cp, mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dir, "..");
const specPath = resolve(root, "spec/affinity.openapi.json");
const output = resolve(root, ".fern-output");
const generated = resolve(root, "src/generated");

type Operation = {
  operationId?: string;
  parameters?: { name: string; in: string }[];
  [key: string]: unknown;
};

const source = await readFile(specPath, "utf8");
const spec = JSON.parse(source) as {
  info: { version: string };
  paths: Record<string, Record<string, Operation>>;
};
const operations: Record<string, string> = {};
for (const [path, methods] of Object.entries(spec.paths)) {
  for (const [method, operation] of Object.entries(methods)) {
    if (!operation.operationId) continue;
    // The contract's operation IDs are `<resource>.<method>`: orders.create, webhooks.resendFailed.
    const [group, name, ...rest] = operation.operationId.split(".");
    if (!group || !name || rest.length > 0)
      throw new Error(`Operation ID ${operation.operationId} is not <resource>.<method>`);
    operation["x-fern-sdk-group-name"] = [group];
    operation["x-fern-sdk-method-name"] = name;
    if (name === "list") {
      // Every list pages forward only (API 2026-11-01), so Fern's forward pager fits it.
      if (!operation.parameters?.some((parameter) => parameter.name === "startingAfter"))
        throw new Error(`${operation.operationId} has no startingAfter cursor`);
      if (operation.parameters.some((parameter) => parameter.name === "endingBefore"))
        throw new Error(`${operation.operationId} pages backward; Fern's pager pages forward only`);
      operation["x-fern-pagination"] = {
        cursor: "$request.startingAfter",
        next_cursor: "$response.nextCursor",
        results: "$response.data",
      };
    }
    operations[operation.operationId] = `${method.toUpperCase()} ${path}`;
  }
}
// The contract publishes response value lists open (`type: string` with `x-extensible-enum`) and
// response objects open (`additionalProperties: { description }`). Fern would type those as plain
// strings and `[key: string]: any` objects. The SDK types the known values instead. It still reads
// unknown values and added fields at runtime: the generated client has no serialization layer, so
// it returns the parsed JSON without checking it against these types. The other language SDKs keep
// only the enum rule, in their scripts/prepare-spec.jq.
const OPEN_OBJECT_KEYS = ["description"];
function closeForTyping(node: unknown): void {
  if (Array.isArray(node)) {
    for (const item of node) closeForTyping(item);
    return;
  }
  if (node === null || typeof node !== "object") return;
  const schema = node as Record<string, unknown>;
  if ("x-extensible-enum" in schema && !("enum" in schema)) {
    schema.enum = schema["x-extensible-enum"];
    delete schema["x-extensible-enum"];
  }
  const extra = schema.additionalProperties;
  if (
    extra !== null &&
    typeof extra === "object" &&
    !Array.isArray(extra) &&
    Object.keys(extra).join() === OPEN_OBJECT_KEYS.join()
  )
    delete schema.additionalProperties;
  for (const value of Object.values(schema)) closeForTyping(value);
}
closeForTyping(spec);
await writeFile(resolve(root, "fern/openapi.json"), `${JSON.stringify(spec, null, 2)}\n`);

await rm(output, { recursive: true, force: true });
const environment = { ...process.env };
delete environment.FERN_TOKEN;
try {
  const fern = Bun.spawn(
    [
      resolve(root, "node_modules/.bin/fern"),
      "generate",
      "--group",
      "typescript",
      "--local",
      "--no-prompt",
      "--force",
    ],
    { cwd: root, env: environment, stdout: "inherit", stderr: "inherit" },
  );
  if ((await fern.exited) !== 0) throw new Error("fern generate failed");
  // Fern can exit 0 after its container fails; require the client it writes.
  if (!(await Bun.file(resolve(output, "Client.ts")).exists()))
    throw new Error("Fern wrote no Client.ts");

  await rename(resolve(output, "reference.md"), resolve(root, "docs/reference.md"));
  for (const file of ["README.md", "CONTRIBUTING.md"])
    await rm(resolve(output, file), { force: true });
  await rm(generated, { recursive: true, force: true });
  await mkdir(resolve(generated, ".."), { recursive: true });
  await cp(output, generated, { recursive: true });
} finally {
  // A failed run leaves neither Fern's output nor the prepared spec behind.
  await rm(output, { recursive: true, force: true });
  await rm(resolve(root, "fern/openapi.json"), { force: true });
}

const generators = await readFile(resolve(root, "fern/generators.yml"), "utf8");
const generatorVersion = /fern-typescript-sdk\n\s+version: (\S+)/u.exec(generators)?.[1];
if (!generatorVersion) throw new Error("fern/generators.yml names no fern-typescript-sdk version");
const fernConfig = JSON.parse(await readFile(resolve(root, "fern/fern.config.json"), "utf8"));
await writeFile(
  resolve(root, "generation.json"),
  `${JSON.stringify(
    {
      contractVersion: spec.info.version,
      contractSha256: createHash("sha256").update(source).digest("hex"),
      fernVersion: fernConfig.version,
      generator: "fernapi/fern-typescript-sdk",
      generatorVersion,
      operations,
    },
    null,
    2,
  )}\n`,
);
console.log(
  `Generated src/generated from API ${spec.info.version}: ${Object.keys(operations).length} operations.`,
);
