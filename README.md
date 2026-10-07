# Affinity TypeScript SDK

Typed server-side client for Node.js 20+, Bun, AWS Lambda, and supported Fetch runtimes.

Version `1.16.0` targets `https://api.affinityrx.com`.

## Install

```sh
npm install @affinity-health/sdk@1.16.0
```

## Use

```typescript
import { Affinity } from "@affinity-health/sdk";

const api = new Affinity(process.env.AFFINITY_API_KEY!);
const practice = api.forPractice("prac_...");

const patients = await practice.patients.list({ limit: 20 });
const patient = await practice.patients.get("pat_...");
```

Practice API keys identify their practice automatically and can call `api.patients.list()` directly.
Platforms can use `forPractice()` or pass `{ practiceId }` as request options. Keep keys on the server.

Read the [SDK guide](docs/guide.md) for creation, updates, order signing and submission, pagination, and errors.
Routine patient writes generate an idempotency key. Order creation, signing, and submission require persisted keys.
Defaults are API `2026-09-28`, a 60-second timeout, and no automatic retries.

## Migrate

The primary `Affinity` client uses the new short resource methods and separate request options.
Version `1.15.0` replaces the previous resource interface. See the [changelog](CHANGELOG.md) for the method and parameter changes.

Purchase prices are managed by Affinity. Use `api.catalog.presentationPrices.get(catalogItemId)`
to read the platform override and nullable Affinity default. The practice-scoped catalog returns
the effective practice price: manual practice override, then platform override, then default.
`catalog.sellingPrices.update()` is no longer available.

## Build and verify

```sh
bun install --frozen-lockfile
bun run generate
bun run check
bun run pack:dry-run
```

The quickstart and TanStack Start example use the new client. All workflow examples use the same client.
Forge/Fern inputs are pinned in [generation.json](generation.json). Affinity's generator owns the public facade and the generated code.
