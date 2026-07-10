# Lorcast Identity Provider

## Feature ID

`PHR-API-001`

## Title

Operational Lorcast Identity Provider

## Status

Completed

## Priority

High

## Category

API, Technical, Architecture

## Objective

Connect Lorcast as the first operational non-Magic identity provider through PHR-ARCH-004 without changing UI or workflow architecture.

## Background

The Identity Platform registers Lorcana as pending. Lorcast exposes a beta HTTPS `v0` REST API, all-print search, Lorcana printing metadata, and versioned artwork URIs.

## Problem Statement

The platform recognizes Lorcana context but cannot return real Lorcana identities. Direct UI integration would violate provider-agnostic architecture.

## Proposed Solution

Add `lib/providers/lorcast/` with provider transport/cache, raw types, normalization, canonical adapter, and diagnostics. Replace only the Lorcana registry entry with the operational provider.

## Functional Requirements

- Request `GET https://api.lorcast.com/v0/cards/search?q=<encoded>&unique=prints`.
- Normalize name, version, collector number, set, set code, language, artwork, types, ink, rarity, provider identity/confidence, TCGplayer ID, and canonical identity.
- Return all individual printings and group identical name/version identities.
- Populate existing image URLs from `image_uris.digital`, including `normal`.
- Ignore `prices.usd` and `prices.usd_foil` completely.
- Cache identical normalized searches for at least 24 hours.
- Space live Lorcast API requests by at least 75 milliseconds.
- Classify rate limit, malformed query, network failure, provider offline, and no match.
- Keep the Universal Command Palette unaware of Lorcast.

## Non-Functional Requirements

### Performance

Use an in-memory 24-hour search cache, card-by-ID cache, request coalescing, and returned thumbnail/normal/large artwork variants.

### Scalability

Cache and transport boundaries can later move to an offline identity repository without changing adapter or UI contracts.

### Maintainability

Raw Lorcast fields remain in `LorcastTypes`; only canonical fields leave `LorcastNormalizer`.

### Reliability

Abort superseded HTTP requests at the caller; coalesce identical in-flight provider searches; expose typed failures.

### Accessibility

Provider failure messages remain concise through the existing Command Palette error state.

### Offline Support

Cached process-lifetime identities are reusable. Durable synchronization is explicitly future work.

### Security

Use HTTPS, encoded query parameters, a bounded query length, and no provider price propagation.

### Extensibility

Provider and cache implementations satisfy the existing Identity Platform interfaces.

### Responsiveness

Provider work remains asynchronous and compatible with palette loading skeletons.

## User Stories

- As a user, I can find real Elsa, Mulan, Mickey Mouse, Belle, and Maleficent printings.
- As a developer, I can inspect Lorcast cache, latency, HTTP status, normalization count, and failure kind.

## Acceptance Criteria

- Lorcana is Operational in the Identity Provider Registry.
- All five validation names return artwork, printings, collector number, set, language, and canonical identity.
- Repeated identical searches return cache hits without another HTTP request.
- Mox Opal remains operational through Scryfall.
- Canonical/output models contain no Lorcast price values or raw provider object.
- Application and UI layers contain no Lorcast imports.

## Edge Cases

- Empty/invalid queries are malformed without a network call.
- HTTP 429 is rate limited.
- HTTP 400/422 is malformed query.
- HTTP 5xx is provider offline.
- Fetch exceptions are network failures.
- Empty successful results are no match.

## Dependencies

- PHR-ARCH-004 Identity Platform.
- PHR-UI-001 CardThumbnail and image cache.
- Lorcast beta `v0` API.

## Future Enhancements

- Durable offline identity repository and daily/bulk synchronization.
- Provider health telemetry and retry/backoff policy.
- Canonical Lorcana finish availability from a provider field when available.

## Technical Notes

Lorcast does not expose finish availability as an identity field in the documented card model. The adapter reports finish as `Unknown` rather than inferring it from price fields.

## UI / UX Notes

No redesign. Existing canonical results, thumbnails, selection steps, loading, and errors remain in place.

## Success Metrics

- One Lorcast HTTP request per unique query per 24 hours per process.
- Zero Lorcast market values crossing the identity boundary.
- Five named Lorcana validation searches operational.

## Open Questions

- Durable repository schema and synchronization cadence remain future work.

## Traceability

- Originating work order: Operational Lorcast Identity Provider.
- Related implementation prompt: `docs/prompts/PHR-API-001-implementation-prompt.md`.
- Related tests: `tests/lorcast-identity-provider.test.ts`.
- Related release notes: `docs/release-notes/PHR-API-001.md`.
- Last modified: 2026-07-09.
- Modification reason: Initial implementation.
