import { readdir, readFile, writeFile } from "node:fs/promises";
import { extname, resolve } from "node:path";

// tsgo preserves extensionless source imports. Published ESM declarations must
// name the corresponding .js files so NodeNext consumers can resolve them.
async function fixDirectory(directory: string): Promise<void> {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      await fixDirectory(path);
    } else if (entry.name.endsWith(".d.ts")) {
      const source = await readFile(path, "utf8");
      const fixed = source.replace(
        /((?:from\s+|import\s*\(\s*)["'])(\.\.?\/[^"']+)(["'])/g,
        (match, prefix: string, specifier: string, suffix: string) =>
          extname(specifier) ? match : `${prefix}${specifier}.js${suffix}`,
      );
      if (fixed !== source) await writeFile(path, fixed);
    }
  }
}

await fixDirectory(resolve(import.meta.dir, "../dist"));
