# Affinity TypeScript SDK

Typed server-side client for Node.js 20+, Bun, AWS Lambda, and supported Fetch runtimes.

This checkout prepares the MVP API `2026-10-20`. The package version is unchanged and these changes have not been published.

```typescript
import { Affinity } from "@affinity-health/sdk";

const api = new Affinity(process.env.AFFINITY_API_KEY!);
const medications = await api.medications.list({ query: "semaglutide", limit: 20 });
const medication = await api.medications.get(medications.data[0]!.id);
```

Keep API keys on the server. The key selects Test or Live mode. Defaults are `https://api.affinityrx.com`, API `2026-10-20`, a 60-second timeout, and no automatic retries.

Read the [guide](docs/guide.md) for practices, complete order submission, pagination, errors, webhooks, and breaking changes from the previous SDK. [Examples](examples/) use synthetic Test data. The old TanStack demo depended on retired patient, preview, draft, and signing APIs and has been removed.

## Build and verify

```sh
bun install --frozen-lockfile
bun run generate
bun run check
bun run pack:dry-run
```

The pinned [OpenAPI contract](spec/affinity.openapi.json) owns method signatures and payload types. The generator owns `src/` and `generation.json`. Generation and its determinism check require no network access. The packed consumer check creates an npm tarball, installs it into a temporary Bun project, typechecks with NodeNext and Bundler resolution, then runs mocked requests under Node and Bun. It never publishes or calls a hosted API.
