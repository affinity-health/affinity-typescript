# TanStack Start Test example

This private example reads practices and medications using the SDK built from this checkout. It keeps the API key on the server and requires a Test-mode platform account. It performs no API writes.

For a separate server application, install the MVP beta with `bun add @affinity-health/sdk@next` or `npm install @affinity-health/sdk@next`. Bare installs select `latest` at `1.16.0`, which staging rejects.

Build the SDK from the repository root first with `bun run build`. The example resolves `@affinity-health/sdk` to that build.

## Server configuration

| Variable                    | Purpose                                                       |
| --------------------------- | ------------------------------------------------------------- |
| `AFFINITY_EXAMPLE_API_KEY`  | Platform Test key, available only to the server               |
| `AFFINITY_EXAMPLE_API_URL`  | Optional API base URL for local or staging verification       |
| `AFFINITY_EXAMPLE_PASSWORD` | Random private-demo access password of at least 32 characters |

Keep secrets in your server's secret store. Never commit them, prefix them with `VITE_`, or put them in client code. The key's account determines organization and mode; API keys do not have permission scopes.

HTTP Basic authentication uses username `demo` and the configured password. An unconfigured password locks the example with HTTP 503. The shared password is for a private integration demo and does not authenticate a clinician.

## Run and verify locally

```sh
bun install --frozen-lockfile
bun run check
bun run test
bun run build
bun run smoke
bun run smoke:browser
bun run dev
```

Development listens on `http://127.0.0.1:5191`. Keep it on loopback or behind an authenticated gateway. Set a server-side base URL if you need staging. No credentials are needed for the local SSR and missing-key browser smoke checks.

Load practices or medications. Both flows verify `/v1/account` has `mode: "test"` and `type: "platform"` before the requested read. Pagination passes the opaque `nextCursor` without deriving it from a record ID.

The former patient, preview, draft, signing, and Live directory workflows have been removed. Patient data is supplied through an order; see [the server-side EMR helper](../emr-order.ts) for a single reviewed `orders.create` call. It creates, signs, and submits together and uses a persisted idempotency key so the application can safely retry across separate calls. Examples must use synthetic Test data.

The optional hosted smoke command requires an explicit `AFFINITY_EXAMPLE_URL` for your private Test deployment. It checks authentication and read-only directory results. It does not deploy anything.
