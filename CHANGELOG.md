# Changelog

All notable changes to `@affinity-health/sdk` are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project uses
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.9.2] - 2026-09-19

### Changed

- Allow order responses to return `null` when a patient has no external ID.
- Clarify that state license records are optional for non-controlled prescribing.
- Document the complete API error responses for public resources.

## [1.9.1] - 2026-09-18

### Documentation

- Use stable installation instructions and remove outdated beta guidance.
- Link the complete compounding-reasons guide, including accepted categories and conditional patient context.
- Add a compiled example for reason selection, prescription preview, and unsigned order creation.

No API contract or runtime behavior changed.

## [1.9.0] - 2026-09-18

### Added

- Publish the 1.9 prescribing-options and order-preview APIs, including supply ordering and grouped shipping estimates.
- Export `CompoundingReason` for typed category selection and return medication-specific choices and context prompts.
- Include the practice Live controls, resource type aliases, pagination helpers, and retry configuration introduced in the 1.9 beta releases below.

### Fixed

- Accept category-only compounding reasons without an empty context string. The API still enforces pharmacy-required explanations.
- Preserve discriminated preview types and complete free-text prescription inputs.

## [1.9.0-beta.5] - 2026-09-18

### Added

- Export `CompoundingReason` as a runtime constant and string-union type for prescription reason autocomplete.
- Return accepted reason choices, labels, context requirements, and prompts from `catalog.retrievePrescribingOptions`.

### Fixed

- Allow category-only compounding reasons without a dummy context string in order creation, batches, and previews. Pharmacy-required patient explanations remain enforced by the API.

## [1.9.0-beta.4] - 2026-09-17

### Added

- Add `catalog.retrievePrescribingOptions` for default prescriptions, alternative directions, templates, and product constraints.
- Add `orders.preview` for default resolution, custom SIGs, quantities, days supply, shipping, and estimated prices. Complete previews provide a directly usable `orders.create` input.
- Add catalog kind filters, ordering requirements, and included supply information to the unified catalog.
- Accept `otcItems` in previews, orders, and batches; return purchased supplies in order responses.
- Return grouped shipping estimates and medication, supply, shipping, and order totals from previews.

### Fixed

- Preserve discriminated prescription input and preview response types during generation.
- Allow complete free-text prescriptions without invented structured fields.

## [1.9.0-beta.3] - 2026-09-17

### Added

- Support `liveEnabled` on practice creation, updates, and responses, with platform ownership enforced by the API.
- Export `Practice`, `Patient`, `Order`, `CreatedOrder`, `CatalogItem`, and `PracticeLocation` types.
- Add async iteration and bounded `autoPagingToArray` to cursor list methods.
- Add configurable request timeouts and bounded retries for reads and idempotent writes.

### Changed

- Replace the practice response's `productionAccess` enum with `liveEnabled`.
- Make request options and caller-supplied idempotency keys optional. Generate keys when required by the endpoint and reuse them across automatic retries.
- Correct generated nullability so resource IDs are strings while nullable fields remain nullable.
- Simplify examples and document retry, pagination, and Live access behavior.

## [1.9.0-beta.2] - 2026-09-17

### Added

- Added `pharmacyId` filtering to `catalog.listPharmacies(...)` and the `manage_practices`
  account permission value.

### Changed

- Regenerated the SDK from the latest committed `2026-08-11` OpenAPI contract.
- Practice and location timezone responses now allow `null`. Creating a location no longer
  requires a timezone, and create or update requests may use `null` to clear an override.

## [1.9.0-beta.1] - 2026-09-17

### Added

- Added Stripe-style `rawRequest(method, path, params?, options?)` for preview or newly released API
  paths that the installed SDK does not support yet.
- Added patient `externalId` to create, update, list, and response types. Affinity scopes it to the
  authenticated integration while retaining `externalIdentities` for explicit aliases.

### Changed

- The client now defaults to a system actor attributed to the authenticated service account.
  System actors may omit `id`; user actors still require their registered external user ID.

### Removed

- **Breaking:** Removed the generated clients under `affinity.raw`. Generated OpenAPI operation
  names and request envelopes are private implementation details again.

## [1.8.0] - 2026-09-16

### Added

- Added the generated clients under `affinity.raw` as an explicit lower-level escape hatch while
  keeping them out of the package root and package subpaths.

## [1.7.0] - 2026-09-16

### Changed

- **Breaking:** Resource methods now use `create`, `retrieve`, `list`, and other direct names with flattened request bodies and separate path identifiers. Generated operation names, clients, model exports, and the `raw` namespace are not public APIs.
- All 69 operations in the `2026-08-11` contract have typed public resource methods. Regeneration rejects missing or stale operation mappings.
- Client and request options consistently handle actor attribution, idempotency, API versions, organization selection, custom headers, and abort signals. Managed headers must use typed options.
- Order creation requires exactly one patient reference and 1–20 prescriptions, with the same checks for each order in a batch.

### Fixed

- Corrected public order input types and packaged declarations for NodeNext and bundler consumers.
- Preserved custom headers and abort signals on patient list requests.

## [1.6.0] - 2026-09-15

### Changed

- Regenerated the TypeScript SDK from the deployed `2026-08-11` OpenAPI contract.
- Replaced the previous resource facade with the generated API groups from the current contract.

### Added

- Added generated clients and models for locations, team management, patient addresses, order
  lifecycle operations, platform pricing, pharmacies, and webhook grants.

### Removed

- Removed generated operations no longer present in the deployed contract, including provider
  mappings, standalone users, roles, memberships, compounder listing, and order-signing sessions.

## [1.5.0] - 2026-08-13

### Added

- Added typed multi-patient checkout through `orders.create({ patientOrders, ... })`; each returned
  patient order remains independently reviewable and signable.

### Changed

- Regenerated the SDK from the current `2026-08-11` contract, including exact order-ID filtering.

### Deprecated

- Deprecated the former single-patient `orders.create({ patientId, prescriptions, ... })` input.
  The 1.x SDK continues to translate it to a one-patient batch and returns that patient order.

## [1.4.0] - 2026-08-11

### Added

- Added typed `patients.retrieveAllergies(...)` and `patients.replaceAllergies(...)` methods for
  explicit no-known-allergy acknowledgement and structured allergy records.
- Added practice-scoped catalog pricing through `catalog.list({ practiceId })`, including platform
  price inheritance and practice overrides.

### Changed

- Advanced the SDK's pinned `Affinity-Version` header and generated types to the forward-only
  `2026-08-11` API contract.
- New patients begin with `allergyReviewStatus: "not_reviewed"`; unsigned drafts remain available,
  while review, signing, and release require an explicit allergy review.
- Shipping choices now expose `amountCents` as the final customer price without an internal markup
  or service-fee breakdown.
- Catalog pricing exposes the medication price without presenting it as a complete order total
  before a shipping option has been selected.

### Removed

- Removed the public Stripe payment-profile and `billing` resource from the current API contract.
  Commercial billing is managed outside the platform integration API.

## [1.3.1] - 2026-08-10

### Changed

- Advanced the SDK's pinned `Affinity-Version` header and generated types to the forward-only
  `2026-08-10` API contract.

## [1.3.0] - 2026-08-10

### Added

- Added dependency-free typed API, authentication, permission, validation, idempotency, rate-limit,
  connection, and server errors with parsed RFC 9457 details and safe serialization.
- Added Stripe-style automatic pagination to cursor-backed resource lists. Await a list call for
  one typed page, use it as an async iterable, or call `autoPagingEach(...)`.
- Added cursor parameters to compounder, role, membership, order-event, and webhook-endpoint
  resource methods.

### Changed

- Standardized public list parameters to `limit`, `startingAfter`, and `endingBefore` with a
  default limit of 25 and a maximum of 100.
- Changed eligible shipping options to a direct, typed array with a documented maximum of 50
  choices instead of a non-advancing list envelope.
- Regenerated catalog filters, prescription requirements, compounder shipping options, metadata,
  order fulfillment tracking status, and collection models from the canonical OpenAPI contract.

## [1.2.1] - 2026-08-05

### Fixed

- Updated the packaged README to identify the current `1.2` SDK release.

## [1.2.0] - 2026-08-05

### Changed

- Regenerated the complete SDK from Pier's canonical `2026-07-29` OpenAPI contract.
- Centralized API-version and actor headers in the shared client configuration instead of exposing
  transport-only headers in every generated method signature.
- Replaced legacy generated model shapes with the canonical request and response schemas while
  preserving the resource-oriented `Affinity` client.

### Removed

- Removed obsolete generated webhook union wrappers and nested problem-error models.

### Security

- Added a clean packed-package consumer check to every CI and release build.

## [1.1.2] - 2026-08-02

### Changed

- Replaced each prescription's single `clinical.diagnosis` object with a bounded
  `clinical.diagnoses` array. The first diagnosis is primary.
- Updated the headless multi-prescription example to send an ICD-10-CM diagnosis for each
  prescription.
- Replaced location-specific patient fixtures with generic synthetic California data.

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

[Unreleased]: https://github.com/affinity-health/affinity-typescript/compare/v1.9.0-beta.1...HEAD
[1.9.0-beta.1]: https://github.com/affinity-health/affinity-typescript/compare/v1.8.0...v1.9.0-beta.1
[1.8.0]: https://github.com/affinity-health/affinity-typescript/compare/v1.7.0...v1.8.0
[1.7.0]: https://github.com/affinity-health/affinity-typescript/compare/v1.6.0...v1.7.0
[1.6.0]: https://github.com/affinity-health/affinity-typescript/compare/v1.5.0...v1.6.0
[1.5.0]: https://github.com/affinity-health/affinity-typescript/compare/v1.4.0...v1.5.0
[1.4.0]: https://github.com/affinity-health/affinity-typescript/compare/v1.3.1...v1.4.0
[1.3.1]: https://github.com/affinity-health/affinity-typescript/compare/v1.3.0...v1.3.1
[1.3.0]: https://github.com/affinity-health/affinity-typescript/compare/v1.2.1...v1.3.0
[1.2.1]: https://github.com/affinity-health/affinity-typescript/compare/v1.2.0...v1.2.1
[1.2.0]: https://github.com/affinity-health/affinity-typescript/compare/v1.1.2...v1.2.0
[1.1.2]: https://github.com/affinity-health/affinity-typescript/compare/v1.1.1...v1.1.2
[1.1.1]: https://github.com/affinity-health/affinity-typescript/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/affinity-health/affinity-typescript/compare/v1.0.1...v1.1.0
[1.0.1]: https://github.com/affinity-health/affinity-typescript/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/affinity-health/affinity-typescript/compare/v0.3.0...v1.0.0
[0.3.0]: https://github.com/affinity-health/affinity-typescript/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/affinity-health/affinity-typescript/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/affinity-health/affinity-typescript/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/affinity-health/affinity-typescript/releases/tag/v0.1.0
