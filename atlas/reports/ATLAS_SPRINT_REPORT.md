# Atlas Sprint Report

## Sprint

Asset Knowledge Graph Sprint

## Summary

Introduced the Asset Knowledge Graph as a reusable semantic layer consumed by Intelligence models.

## Goal

Model relationships between assets so Playability, Certification, and future Intelligence models can share semantic reasoning.

## Files Added

- `lib/knowledge/AssetKnowledgeGraph.ts`
- `lib/knowledge/KnowledgeEdge.ts`
- `lib/knowledge/KnowledgeGraphRegistry.ts`
- `lib/knowledge/KnowledgeNode.ts`
- `lib/knowledge/KnowledgeQuery.ts`
- `lib/knowledge/RelationshipRegistry.ts`
- `lib/knowledge/RelationshipResolver.ts`

## Files Modified

- `config/playability.ts`
- `lib/intelligence/certification/CertificationEngine.ts`
- `lib/intelligence/certification/CertificationProfile.ts`
- `lib/intelligence/framework/AssetIntelligenceFramework.ts`
- `lib/intelligence/playability/PlayabilityEngine.ts`
- `lib/intelligence/playability/PlayabilityProfile.ts`
- `lib/intelligence/playability/PlayabilityRole.ts`
- `tests/asset-knowledge-graph.test.ts`
- `tests/certification-intelligence.test.ts`
- `tests/playability-intelligence.test.ts`
- Sprint documentation and Atlas files.

## Architecture Changes

- Added a reusable graph, node, edge, query, registry, relationship registry, and resolver architecture.
- Playability consumes graph roles, archetypes, themes, strategies, and format context.
- Certification consumes premium-printing, Reserved List, and collector-role relationships.
- Asset Intelligence Framework metadata now records graph dependencies.

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

- Relationship coverage is configured for requested examples and should later be provider-enriched.
- Relationship confidence is configured until approved provider integrations exist.

## Known Issues

- Raw Node test runner still requires the existing project test harness for `@/` aliases.

## Tests Added

- Asset Knowledge Graph tests verify Mox Opal, Sol Ring, Collected Company, Counterspell, and Black Lotus relationships.
- Playability tests verify graph consumption.
- Certification tests verify graph collector relationship consumption.

## Build Status

- `npm run lint`: passed.
- `npx tsc --noEmit`: passed.
- `npm run build`: passed after allowing Next.js to fetch Google font assets.

## Suggested Next Sprint

Add provider-backed relationship enrichment and Atlas graph diagnostics.
