# Affinity TypeScript SDK

Typed server-side client for Node.js 20+, Bun, AWS Lambda, and supported Fetch runtimes.

This source update implements the new SDK interface. The published `1.14.0` package still uses the previous interface; a new release will follow.

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
The previous resource interface remains available as `LegacyAffinity`. Its [reference](docs/legacy-interface.md) and existing contract tests are retained.
`AffinityApiClient` remains the lower-level Forge/Fern client.

## Build and verify

```sh
bun install --frozen-lockfile
bun run generate
bun run check
bun run pack:dry-run
```

The quickstart and TanStack Start example use the new client. Older workflow examples explicitly import `LegacyAffinity`.
Forge/Fern inputs are pinned in [generation.json](generation.json). Affinity's generator owns the public facade and the generated code.
