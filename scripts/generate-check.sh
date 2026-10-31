#!/usr/bin/env bash
# Regenerates src/generated from spec/affinity.openapi.json and fails if anything differs from the
# committed files: generated code is never edited by hand. Needs Docker.
set -euo pipefail
root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
snapshot="$(mktemp -d)"
trap 'rm -rf "$snapshot"' EXIT
cp -R "$root/src/generated" "$snapshot/generated"
cp "$root/generation.json" "$root/docs/reference.md" "$snapshot/"
bun "$root/scripts/generate.ts" >/dev/null
diff -ru "$snapshot/generated" "$root/src/generated"
diff -u "$snapshot/generation.json" "$root/generation.json"
diff -u "$snapshot/reference.md" "$root/docs/reference.md"
