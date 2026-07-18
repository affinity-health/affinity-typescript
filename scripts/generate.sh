#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
spec="$root/spec/affinity.openapi.json"
generator="$(command -v openapi-generator || command -v openapi-generator-cli)"
generated="$(mktemp -d)"
trap 'rm -rf "$generated"' EXIT

"$generator" validate -i "$spec"
"$generator" generate \
  -i "$spec" \
  -g typescript-fetch \
  -o "$generated" \
  --git-user-id affinity-health \
  --git-repo-id affinity-typescript \
  --additional-properties='hideGenerationTimestamp=true,licenseName=MIT,npmName=@affinity-health/sdk,npmVersion=0.1.0,npmRepository=https://github.com/affinity-health/affinity-typescript,supportsES6=true,typescriptThreePlus=true'

bun "$root/scripts/replace-generated.ts" "$generated" "$root"
bun "$root/scripts/generate-facade.ts"
oxfmt "$root/src" "$root/scripts" "$root/examples" "$root/test"
