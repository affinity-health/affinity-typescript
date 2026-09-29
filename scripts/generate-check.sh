#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
snapshot="$(mktemp -d)"
trap 'rm -rf "$snapshot"' EXIT

cp -R "$root/src" "$snapshot/src"
cp -R "$root/docs" "$snapshot/docs"

bash "$root/scripts/generate.sh" >/dev/null

diff -ru "$snapshot/src" "$root/src"
diff -ru "$snapshot/docs" "$root/docs"
