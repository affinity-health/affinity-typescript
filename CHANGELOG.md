# Changelog

All notable changes to `@affinity-health/sdk` are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project uses
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

[Unreleased]: https://github.com/affinity-health/affinity-typescript/compare/v0.1.1...HEAD
[0.1.1]: https://github.com/affinity-health/affinity-typescript/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/affinity-health/affinity-typescript/releases/tag/v0.1.0
