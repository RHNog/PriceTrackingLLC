# Atlas Sprint Report

## Sprint

Sprint 29 - Intelligence Provider SDK

## Summary

Introduced the reusable Intelligence Provider SDK for future provider lifecycle consistency.

## Goal

Create SDK infrastructure for normalization, health, caching hooks, diagnostics, evidence mapping, confidence contribution, metadata, retry hooks, and validation hooks.

## Files Added

- `lib/providers/sdk/ProviderAdapter.ts`
- `lib/providers/sdk/ProviderCache.ts`
- `lib/providers/sdk/ProviderClient.ts`
- `lib/providers/sdk/ProviderCoverage.ts`
- `lib/providers/sdk/ProviderDiagnostics.ts`
- `lib/providers/sdk/ProviderEvidence.ts`
- `lib/providers/sdk/ProviderHealth.ts`
- `lib/providers/sdk/ProviderMetadata.ts`
- `lib/providers/sdk/ProviderRegistry.ts`
- `lib/providers/sdk/ProviderResult.ts`
- `tests/provider-sdk.test.ts`

## Files Modified

- `features/vendor/components/AtlasInspector.tsx`
- Sprint documentation and Atlas files.

## Architecture Changes

- Added generic provider lifecycle contracts.
- Registered metadata-only planned providers for EDHREC, PSA, BGS, CGC, Cardmarket, TCGplayer, Melee, MTGO, LigaMagic, and eBay.
- Atlas Inspector consumes Provider SDK metadata, health, coverage, evidence contribution, lifecycle status, and gaps.
- No live provider integrations were added.

## Documentation Updated

- CHANGELOG
- SPRINT_HISTORY
- ROADMAP
- ARCHITECTURE
- DECISIONS
- AGENT_HANDOFF
- PROMPTS
- ATLAS
- Atlas backlog, project knowledge, architecture snapshot, and sprint report

## Technical Debt

- Existing Scryfall providers still use legacy provider contracts and should migrate gradually.
- Planned providers are metadata-only until approved integration paths exist.

## Known Issues

- Raw Node test runner still requires the existing project test harness for `@/` aliases.

## Tests Added

- Provider SDK tests verify planned provider registration, metadata, health, coverage, evidence contribution, diagnostics, caching, normalization, and validation lifecycle.

## Build Status

- `npm run lint`: passed.
- `npx tsc --noEmit`: passed.
- `npm run build`: passed after allowing Next.js to fetch Google font assets.

## Suggested Next Sprint

Migrate Scryfall providers into the Provider SDK lifecycle.
