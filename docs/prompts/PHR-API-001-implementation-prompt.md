# PHR-API-001 Implementation Prompt

## Project Context

PHR-ARCH-004 owns provider-agnostic collectible identity. Lorcast is identity-only and must never enter market infrastructure.

## Feature ID

`PHR-API-001`

## Objective

Connect Lorcast as the operational Lorcana identity provider.

## Required Reading

- `docs/api/PHR-API-001-lorcast-identity-provider.md`
- `docs/architecture/PHR-ARCH-004-identity-platform.md`
- Lorcast API overview, Cards API, Images API, search syntax, and changelog.

## Implementation Requirements

- Create the five requested modules under `lib/providers/lorcast/`.
- Use `q` and `unique=prints` on the v0 search endpoint.
- Apply 24-hour identity caching, request coalescing, and 75ms request spacing.
- Normalize only canonical identity fields and artwork URIs.
- Classify documented provider failures.
- Register Lorcast operationally through Identity Provider Registry only.

## Constraints

- Never map Lorcast prices.
- No UI/workflow changes or provider-specific UI logic.
- No constructed image URLs.
- Preserve Scryfall behavior.

## Expected Architecture

Identity Orchestrator → Registry → LorcastProvider → LorcastNormalizer → LorcastAdapter → Canonical Identity Model.

## Testing Expectations

- Fixture-test normalization, price exclusion, caching, coalescing, and failure mapping.
- Live-validate the five Lorcana names and Mox Opal routing.
- Run ESLint, build, boundary scans, and `git diff --check`.

## Documentation Updates

- Provider Registry, capability matrix, Identity Platform, Architecture, Atlas, Roadmap, Sprint History, validation, and release note.

## Acceptance Criteria

- All PHR-API-001 acceptance criteria pass.

## Non-Goals

- Lorcast pricing, new market provider, workflow/UI redesign, or durable offline repository.

## Notes For AI Coding Agents

- Preserve current PHR-UI-001, PHR-UX-002, and PHR-ARCH-004 working-tree changes.
