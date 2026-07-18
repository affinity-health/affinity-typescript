#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
snapshot="$(mktemp -d)"
trap 'rm -rf "$snapshot"' EXIT

cp -R "$root/src" "$snapshot/src"
cp -R "$root/docs" "$snapshot/docs"
cp -R "$root/.openapi-generator" "$snapshot/.openapi-generator"
cp "$root/.openapi-generator-ignore" "$snapshot/.openapi-generator-ignore"

bash "$root/scripts/generate.sh" >/dev/null

diff -ru "$snapshot/src" "$root/src"
diff -ru "$snapshot/docs" "$root/docs"
diff -ru "$snapshot/.openapi-generator" "$root/.openapi-generator"
diff -u "$snapshot/.openapi-generator-ignore" "$root/.openapi-generator-ignore"
