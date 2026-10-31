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
      if (!operation.parameters?.some((parameter) => parameter.name === "startingAfter"))
        throw new Error(`${operation.operationId} has no startingAfter cursor`);
      operation["x-fern-pagination"] = {
        cursor: "$request.startingAfter",
        next_cursor: "$response.nextCursor",
        results: "$response.data",
      };
    }
    operations[operation.operationId] = `${method.toUpperCase()} ${path}`;
  }
}
await writeFile(resolve(root, "fern/openapi.json"), `${JSON.stringify(spec, null, 2)}\n`);

await rm(output, { recursive: true, force: true });
const environment = { ...process.env };
delete environment.FERN_TOKEN;
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
await rm(output, { recursive: true, force: true });
await rm(resolve(root, "fern/openapi.json"), { force: true });

const generators = await readFile(resolve(root, "fern/generators.yml"), "utf8");
const fernConfig = JSON.parse(await readFile(resolve(root, "fern/fern.config.json"), "utf8"));
await writeFile(
  resolve(root, "generation.json"),
  `${JSON.stringify(
    {
      contractVersion: spec.info.version,
      contractSha256: createHash("sha256").update(source).digest("hex"),
      fernVersion: fernConfig.version,
      generator: "fernapi/fern-typescript-sdk",
      generatorVersion: /fern-typescript-sdk\n\s+version: (\S+)/u.exec(generators)?.[1],
      operations,
    },
    null,
    2,
  )}\n`,
);
console.log(
  `Generated src/generated from API ${spec.info.version}: ${Object.keys(operations).length} operations.`,
);
