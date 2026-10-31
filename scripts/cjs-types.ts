// CommonJS callers need CommonJS declarations: under "type": "module", dist/*.d.ts are ES module
// declarations, which TypeScript's node16 mode refuses to `require` (TS1479). Copy them into
// dist/cjs, whose package.json marks that folder CommonJS; exports["."].require.types points there.
import { copyFile, mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const dist = resolve(import.meta.dir, "../dist");
const target = resolve(dist, "cjs");
await rm(target, { recursive: true, force: true });
const declarations = (await readdir(dist, { recursive: true })).filter((file) =>
  file.endsWith(".d.ts"),
);
for (const file of declarations) {
  await mkdir(dirname(resolve(target, file)), { recursive: true });
  await copyFile(resolve(dist, file), resolve(target, file));
}
await writeFile(resolve(target, "package.json"), `${JSON.stringify({ type: "commonjs" })}\n`);
