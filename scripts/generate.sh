#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
spec="$root/spec/affinity.openapi.json"
generator="$(command -v openapi-generator || command -v openapi-generator-cli)"
package_version="$(bun -e 'const packageJson = await Bun.file(process.argv[1]).json(); console.log(packageJson.version)' "$root/package.json")"
generated="$(mktemp -d)"
trap 'rm -rf "$generated"' EXIT

"$generator" validate -i "$spec"
"$generator" generate \
  -i "$spec" \
  -g typescript-fetch \
  -o "$generated" \
  --git-user-id affinity-health \
  --git-repo-id affinity-typescript \
  --additional-properties="hideGenerationTimestamp=true,licenseName=MIT,npmName=@affinity-health/sdk,npmVersion=$package_version,npmRepository=https://github.com/affinity-health/affinity-typescript,supportsES6=true,typescriptThreePlus=true"

bun "$root/scripts/replace-generated.ts" "$generated" "$root"
bun "$root/scripts/clean-generated-docs.ts" "$root/docs"
bun "$root/scripts/generate-facade.ts"
oxfmt "$root/src" "$root/docs" "$root/scripts" "$root/examples" "$root/test"
