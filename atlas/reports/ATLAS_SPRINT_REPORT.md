# Atlas Sprint Report

## Sprint

Sprint 25.1 - Evidence Sufficiency Framework

## Summary

Introduced Evidence Sufficiency so Intelligence models distinguish missing evidence from negative evidence before issuing grades.

## Goal

Prevent definitive conclusions when required evidence is missing and show Unknown instead of a failing grade.

## Files Added

- None.

## Files Modified

- `lib/intelligence/framework/EvidenceSufficiencyEngine.ts`
- `lib/intelligence/framework/EvidenceRequirement.ts`
- `lib/intelligence/framework/EvidenceScore.ts`
- `lib/intelligence/framework/EvidenceStatus.ts`
- `lib/intelligence/framework/EvidenceReport.ts`
- `tests/evidence-sufficiency.test.ts`
- Sprint documentation and Atlas files.

## Architecture Changes

- Every registered Intelligence model now declares evidence requirements.
- Evidence reports attach to Intelligence models.
- Insufficient evidence maps production grade display to Unknown.
- Atlas Inspector displays evidence status, missing evidence, and evidence explanation.

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

- Evidence requirements are hand-authored in the model registry.
- Provider-backed evidence will need normalization once real providers are connected.

## Known Issues

- Raw Node test runner still cannot resolve `@/` aliases without a project test harness.

## Tests Added

- Evidence Sufficiency tests verify Playability, Certification, Collector, and mocked sufficient Playability evidence states.

## Build Status

- `npm run lint`: passed.
- `npx tsc --noEmit`: passed.
- `npm run build`: passed after allowing Next.js to fetch Google font assets.
- Production Intelligence Console implementation-term scan: passed.

## Suggested Next Sprint

Add generated evidence reports and visual regression coverage for Unknown grade presentation.
