#!/usr/bin/env bash
set -euo pipefail
root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
bun "$root/scripts/generate-facade.ts"
oxfmt "$root/src" "$root/docs"
