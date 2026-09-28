import { cp, rm } from "node:fs/promises";
import { resolve } from "node:path";

const [sourceRoot, destinationRoot] = process.argv.slice(2).map((path) => resolve(path));
if (!sourceRoot || !destinationRoot) {
  throw new Error("Usage: bun scripts/replace-generated.ts <generated-root> <repository-root>");
}

// Forge output is generated centrally from the same pinned public contract.
const forgeDirectory = resolve(destinationRoot, "src/forge");
if (await Bun.file(resolve(forgeDirectory, "generation.json")).exists()) {
  await cp(forgeDirectory, resolve(sourceRoot, "src/forge"), { recursive: true });
}
for (const directory of ["src", "docs", ".openapi-generator"]) {
  const destination = resolve(destinationRoot, directory);
  await rm(destination, { force: true, recursive: true });
  await cp(resolve(sourceRoot, directory), destination, { recursive: true });
}

await cp(
  resolve(sourceRoot, ".openapi-generator-ignore"),
  resolve(destinationRoot, ".openapi-generator-ignore"),
);
