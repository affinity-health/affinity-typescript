import { readdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const docsRoot = resolve(process.argv[2] ?? "docs");
const entries = await readdir(docsRoot, { withFileTypes: true });

for (const entry of entries) {
  if (!entry.isFile() || !entry.name.endsWith(".md")) continue;

  const path = resolve(docsRoot, entry.name);
  const source = await readFile(path, "utf8");
  if (!source.includes("// TODO: Update the object below with actual values")) continue;

  const cleaned = source.replace(/\n## Example\n\n```typescript[\s\S]*?```\n/, "\n");
  if (cleaned === source) {
    throw new Error(`Could not remove the placeholder example from ${entry.name}`);
  }
  await writeFile(path, cleaned);
}
