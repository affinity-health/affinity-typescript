# Changelog

All notable changes to `@affinity-health/sdk` are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project uses
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.1] - 2026-08-01

### Fixed

- Updated the package documentation for the patient-order API and current package version.
- Removed non-runnable placeholder examples from generated model reference pages.

## [1.1.0] - 2026-08-01

### Added

- Added `orders.create(...)` for one-patient orders containing one or more unsigned prescription
  drafts, with required actor attribution and idempotency.
- Added `orderSigningSessions.create(...)` for one-time, provider-bound review and PIN-signing of
  every prescription in an order.
- Removed the unreleased single-prescription creation and signing-session resources.

## [1.0.1] - 2026-07-31

### Fixed

- Added immutable request-scoped actor attribution for patient and order operations through
  `affinity.withActor(...)`, matching the API's PHI audit requirement.
- Regenerated patient and order transports from the canonical contract's required
  `Affinity-Actor-Id` and `Affinity-Actor-Type` headers.

## [1.0.0] - 2026-07-31

### Changed

- Promoted the verified `2026-07-29` forward-only API surface to stable after npm registry and
  Production-hosted Test integration checks.

## [0.3.0] - 2026-07-31

### Added

- Added practice-scoped Patients resources for list, create, retrieve, and update operations.
- Added Billing resources for payment-profile retrieval and Stripe SetupIntent setup completion.
- Added GitHub CI and npm trusted-publishing release automation with provenance.

### Changed

- Regenerated the SDK from the deployed `2026-07-29` canonical OpenAPI document.
- Limited Orders to list, retrieve, eligible cancellation, and fulfillment event history.

### Removed

- Removed public order creation, editing, routing, and submission without compatibility aliases.

## [0.2.0] - 2026-07-29

### Added

- Added the exhaustive dated `AffinityWebhookEvent` union, event/status constants, strict payload
  parser, and raw-body HMAC signature verifier with signing-secret rotation support.
- Added provider-mapping list support with external identity, practice, and verification filters.

### Changed

- Cut the SDK forward to the `2026-07-29` API contract.
- Replaced legacy portal sessions with typed provider mappings, origin-bound component sessions,
  and named hosted workflow sessions.
- Removed the `portalSessions` resource without a backwards-compatibility alias.

## [0.1.1] - 2026-07-28

### Fixed

- Bundled the published ESM runtime entry so Node.js can resolve every internal SDK module.
- Added a Node.js package import gate to the release checks.

## [0.1.0] - 2026-07-28

### Added

- Typed resources for account access, catalog items, available compounders, practices, users,
  roles, memberships, hosted portal sessions, orders, and webhooks.
- Dated `2026-07-28` API contract headers by default.
- Bounded retries for safe reads and idempotent mutations.
- Typed RFC 9457 problem responses, including validation, dependency, and internal failures.
- A compile-checked Test-mode quickstart.

[Unreleased]: https://github.com/affinity-health/affinity-typescript/compare/v1.1.1...HEAD
[1.1.1]: https://github.com/affinity-health/affinity-typescript/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/affinity-health/affinity-typescript/compare/v1.0.1...v1.1.0
[1.0.1]: https://github.com/affinity-health/affinity-typescript/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/affinity-health/affinity-typescript/compare/v0.3.0...v1.0.0
[0.3.0]: https://github.com/affinity-health/affinity-typescript/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/affinity-health/affinity-typescript/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/affinity-health/affinity-typescript/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/affinity-health/affinity-typescript/releases/tag/v0.1.0
