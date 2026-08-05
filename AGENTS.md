# Affinity TypeScript SDK agent guide

This repository contains the official TypeScript SDK for the Affinity public API.

## Source of truth

- `spec/affinity.openapi.json` is copied from the matching committed
  `openapi/api/<date>.json` artifact in the private Affinity monorepo.
- Never hand-edit generated API classes, models, runtime files, or resource facade files. Change
  `scripts/generate-facade.ts` or the private API contract and run `bun run generate`.
- Keep public examples synthetic and test-mode only.

## Package boundary

- The package name is `@affinity-health/sdk`.
- Keep the version at `0.x` until Affinity explicitly begins publishing.
- Do not publish to npm without explicit authorization.
- The SDK is for trusted server-side Bun, Node.js, Lambda, and worker runtimes. Never encourage API
  keys in browser or mobile code.

## Terminology

- A provider is an individual clinician or prescriber.
- A practice is the customer organization and API tenant.
- A location is a physical practice site.
- Do not introduce a `clinic` API resource.

## Validation

Use Bun for all package work:

```sh
bun run generate
bun run check
bun run pack:dry-run
```
