# PHR-ARCH-004 Implementation Prompt

## Project Context

Platform v1.0 separates collectible identity from market evidence. Epic 2 removes concrete provider selection from application surfaces.

## Feature ID

`PHR-ARCH-004`

## Objective

Implement the provider-agnostic Identity Platform defined in `docs/architecture/PHR-ARCH-004-identity-platform.md`.

## Required Reading

- `docs/architecture/PHR-ARCH-004-identity-platform.md`
- `docs/releases/Platform-v1.0.md`
- `docs/ux/PHR-UX-002-global-command-palette.md`
- `lib/engines/search/searchIdentityCards.ts`

## Implementation Requirements

- Create all seven requested identity-engine modules.
- Register Scryfall operationally and four named pending adapters.
- Produce canonical identity results and typed lifecycle outcomes.
- Route identity API, Vendor Workspace initialization, and Identity Explorer through the orchestrator.
- Surface pending-provider messages and orchestration diagnostics in the Command Palette.

## Constraints

- Do not change market providers or request pricing.
- Do not connect unapproved non-Magic providers.
- Do not hardcode provider selection in UI.
- Preserve existing query, intent, eligibility, and workflow engines.

## Expected Architecture

Application → Identity Orchestrator → selection policy → identity registry → provider/adapter → existing identity engine → canonical model.

## Testing Expectations

- Validate operational Magic, four pending games, no-match, unconfigured, and offline contracts.
- Run ESLint, focused tests, existing identity tests, and production build.

## Documentation Updates

- Architecture, Atlas, Registry, Roadmap, Sprint History, Prompt History, validation, and release notes.

## Acceptance Criteria

- All PHR-ARCH-004 acceptance criteria pass.

## Non-Goals

- Live non-Magic integrations, aggregation, identity database, pricing, or market observations.

## Notes For AI Coding Agents

- Preserve uncommitted PHR-UI-001 and PHR-UX-002 changes.
