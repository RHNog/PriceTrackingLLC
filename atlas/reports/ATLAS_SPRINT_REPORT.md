# Atlas Sprint Report

## Sprint

Sprint 25 - Playability Intelligence Level 2

## Summary

Matured Playability Intelligence from framework-level legality reporting into meaningful player demand intelligence.

## Goal

Explain why the market cares about playable cards through weighted formats, demand relevance, business conclusions, key signals, and future provider hooks.

## Files Added

- None.

## Files Modified

- `config/playability.ts`
- Playability Intelligence engine/profile/indicator contracts.
- Playability framework registry metadata.
- Intelligence Console Playability presentation.
- Playability regression tests.
- Sprint documentation and Atlas files.

## Architecture Changes

- Playability format scoring now uses configurable format weights.
- Per-format Playability indicators now expose legality, importance, demand level, competitive relevance, casual relevance, confidence, trend, status, and provider.
- Playability Profile now owns business conclusions, key signals, confidence reason, and format weights.
- Future providers remain hooks only.

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

- Playability demand hints are local configuration until provider-backed demand data exists.
- Supporting Evidence is still composed in the UI layer rather than a reusable presentation adapter.

## Known Issues

- Raw Node test runner still cannot resolve `@/` aliases without a project test harness.

## Tests Added

- Playability profile tests verify requested card examples, distinct business conclusions, framework registration, and configurable format weights.

## Build Status

- `npm run lint`: passed.
- `npx tsc --noEmit`: passed.
- `npm run build`: passed after allowing Next.js to fetch Google font assets.
- Production Intelligence Console implementation-term scan: passed.

## Suggested Next Sprint

Connect approved EDHREC and tournament demand providers when available.
