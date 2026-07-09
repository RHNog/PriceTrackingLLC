# Atlas Sprint Report

## Sprint

Sprint 31D - Market Evidence Layer

## Summary

Introduced layered market evidence so providers add knowledge instead of replacing each other.

## Goal

Never treat one provider as market truth. Every provider contributes evidence, repository snapshots store the evidence stack, and the Market Evidence Layer selects the best available value per field.

## Files Added

- `lib/market/MarketEvidenceLayer.ts`
- `lib/market/EvidenceAggregator.ts`
- `lib/market/EvidenceResolver.ts`
- `lib/market/EvidencePriority.ts`
- `lib/market/EvidenceProvenance.ts`
- `lib/market/EvidenceCoverage.ts`
- `lib/market/EvidenceFallback.ts`
- `lib/market/EvidenceSelection.ts`
- `tests/market-evidence-layer.test.ts`

## Files Modified

- `CHANGELOG.md`
- `app/api/market/snapshot/route.ts`
- `app/dev/justtcg/page.tsx`
- `lib/market/MarketIntelligenceRepository.ts`
- `lib/market/MarketRefreshScheduler.ts`
- `lib/market/MarketRepositoryDiagnostics.ts`
- `lib/market/MarketSnapshot.ts`
- `docs/CHANGELOG.md`
- `docs/SPRINT_HISTORY.md`
- `docs/ARCHITECTURE.md`
- `docs/DECISIONS.md`
- `docs/ROADMAP.md`
- `docs/ATLAS.md`
- `docs/AGENT_HANDOFF.md`
- `docs/PROMPTS.md`
- `atlas/PROJECT_SUMMARY.md`
- `atlas/architecture/ARCHITECTURE_SNAPSHOT.md`
- `atlas/backlog/BACKLOG.md`
- `atlas/knowledge/PROJECT_KNOWLEDGE.md`
- `atlas/reports/ATLAS_SPRINT_REPORT.md`

## Architecture Changes

- Market providers are collected as evidence sources instead of short-circuiting on the first provider with prices.
- Market Truth validation still gates provider responses before evidence enters the repository.
- Market Evidence Layer merges new evidence into the existing evidence stack.
- Repository selected values are resolved from evidence, not sparse provider value objects.
- Missing fields from a new provider do not erase populated fields from previous evidence.
- Developer diagnostics can inspect stack, selected provider, fallback reason, priority, freshness, and coverage.

## Fallback Model

- Current Market Estimate: future consensus, JustTCG, Scryfall, repository snapshot, unavailable.
- Lowest Listing: JustTCG, repository snapshot, unavailable.
- Recent Sales: JustTCG, repository snapshot, unavailable.

## Coverage Model

Provider coverage is tracked independently per market field. A provider can cover market estimate without covering listings, or cover listings without covering recent sales.

## Build Status

- `npx tsc --noEmit`: passed.
- `npm run lint`: passed.
- `npm run build`: passed after allowing Next.js to fetch Google font assets.
