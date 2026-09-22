# TanStack Start EMR example

This independently packaged example installs the published `@affinity-health/sdk`.
It sends real requests to `https://api.joinaffinityai.com`. Ordering accepts **Test keys only**.
An optional, separate Live key with only `practices:read` shows the Live practice directory.
Use only synthetic data. Test orders go to Affinity's simulator, not PerfectRx or a real pharmacy.

## Server configuration

For the Affinity-hosted demo, set these in Doppler project `affinity`, config `stg`:

| Name                             | Value                                                                                           |
| -------------------------------- | ----------------------------------------------------------------------------------------------- |
| `AFFINITY_EXAMPLE_API_KEY`       | Dedicated Test-mode platform API key for the deployed API                                       |
| `AFFINITY_EXAMPLE_DIRECTORY_KEY` | Optional Live key for the same platform, with exactly `practices:read`; never used for ordering |
| `AFFINITY_EXAMPLE_PASSWORD`      | Random access password, at least 32 characters                                                  |

Required key permissions: `practices:read`, `catalog:read`, `patients:read`, `patients:write`,
`orders:read`, `orders:write`, `orders:sign`, and `team:write` for first-use NPI registration.
The key must have access to the selected practice. The `stg` Doppler config is the demo's
deployment credential store; the API key still targets the deployed production API in Test mode.

Enter values interactively, without appending them to commands or pasting them into chat:

```sh
doppler secrets set --project affinity --config stg AFFINITY_EXAMPLE_API_KEY
doppler secrets set --project affinity --config stg AFFINITY_EXAMPLE_PASSWORD
doppler secrets set --project affinity --config stg AFFINITY_EXAMPLE_DIRECTORY_KEY
```

Alchemy binds these only to the demo Worker. Do not add `VITE_` prefixes, commit `.env` files,
or duplicate the values in the Cloudflare dashboard. Redeploy after changing runtime values.
The browser uses HTTP Basic authentication with username `demo` and the configured password.
Without a valid password configured, the server returns 503 and performs no API operations.
This shared password is for a private integration demo, not production clinician authentication.

## Run and validate

From this directory:

```sh
bun install --frozen-lockfile
bun run check
bun run test
bun run build
bun run smoke
bun run smoke:browser
doppler run --project affinity --config stg -- bun run smoke:hosted
doppler run --project affinity --config stg -- bun run dev
```

Development listens on `http://127.0.0.1:5191`. Keep it loopback-only or behind an authenticated
development gateway. API credentials are read by server functions only.

## Try an order

1. Choose a practice from the paginated `affinity.practices.list()` results. The list shows the API's
   `liveEnabled` and `livemode` separately. A Test key lists Test-mode practices, not a cross-mode
   platform directory. The Live practices view uses the separate read-only directory key.
   Live access is not inferred from the practice name or data mode.
   Create a synthetic patient. Repeated clicks reuse the saved run's idempotency key.
2. Explicitly review the synthetic no-known-allergies scenario.
3. Load the current paginated catalog. Add one or more prescriptions and optional OTC items.
   PerfectRx supplies need an accompanying prescription from the same pharmacy.
4. Preview defaults and shipping. Edit the JSON to exercise SDK overrides, then preview again.
   The API returns validation issues when more input is needed. The example does not invent it.
5. Inspect the preview's prescriptions, OTC items, shipping groups, and totals. Shipping uses
   `totals.shippingTotalCents`, not the sum of repeated prescription rates.
6. Save the unsigned draft. No prescriber is required at creation.
7. Review the returned order, select a synthetic Test NPI, explicitly attest, then sign and send.
8. Inspect per-prescription submission outcomes. Refresh to retrieve simulator processing and
   fulfillment events. Submission acknowledgement alone is not pharmacy acceptance.

The browser saves synthetic run data and signed receipts locally. Server-signed receipts bind
creation to the accepted preview and signing to the exact reviewed prescription versions.
Network retries reuse keys across reloads. Receipts expire after 24 hours. A changed prescription
requires a refreshed review and new attestation. Keep the original receipt for ambiguous signing
timeouts; do not refresh just to bypass a failed response.

This example does not implement webhook ingestion, full EMR authentication, or automatic retries
of partial submissions. See `../emr-order.ts` for the already-signed `orders.submit` retry flow and
signed webhook processing. Production integrations should store reviews and retry records in their
own durable database, not browser storage.

## Cloudflare deployment

`alchemy.run.ts` owns the separate `affinity-sdk-example` stack and the
`affinity-sdk-emr-example` Worker. It does not modify the API or dashboard stack.
Use the repository scripts for plan and deployment. No Wrangler deployment path is needed.
Retain the private `.alchemy` state directory on the deployment machine and back it up privately;
do not start a second deployment with empty state or commit state to the public SDK repository.

```sh
doppler run --project affinity --config stg -- bun run plan
doppler run --project affinity --config stg -- bun run deploy
```

Review the plan before apply. Verify the returned Worker URL requires authentication, verify
authenticated rendering, and rerun the plan to check for unintended updates.
