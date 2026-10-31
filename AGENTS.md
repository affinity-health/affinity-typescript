# Affinity TypeScript SDK agent guide

This repository contains the official TypeScript SDK for the Affinity public API.

## Source of truth

- `spec/affinity.openapi.json` is copied from the matching committed
  `openapi/api/<date>.json` artifact in the private Affinity monorepo.
- Fern generates `src/generated` from the spec (`fern/generators.yml` pins the versions;
  `scripts/generate.ts` adds the method names and pagination). Never hand-edit `src/generated`.
  Change the API contract upstream, copy the new snapshot, and run `bun run generate` (needs Docker).
- `src/webhook-events.ts` is written by hand. Its event-type list must match the contract; the
  build fails when it drifts.
- Keep public examples synthetic and test-mode only.

## Package boundary

- The package name is `@affinity-health/sdk`.
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
AFFINITY_API_KEY=sk_test_... bun run smoke   # Test keys only; calls a real API
```
