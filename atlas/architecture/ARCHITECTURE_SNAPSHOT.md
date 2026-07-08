# Architecture Snapshot

## Snapshot

Atlas Sprint A1

## Major Systems

- Next.js application shell under `app/`.
- Shared UI components under `components/`.
- Feature-specific UI under `features/`.
- Domain contracts under `types/`.
- Provider-independent engines under `lib/engines/`.
- External and mock providers under `lib/providers/`.
- Business profile system under `lib/business/`.
- Workflow command and context systems under `lib/workflow/`.
- Intelligence framework, Playability model, and Certification model under `lib/intelligence/`.
- Evaluation history under `lib/history/`.
- System readiness under `lib/validation/`.
- Pipeline integrity under `lib/pipeline/`.
- Evidence Sufficiency Framework under `lib/intelligence/framework/`.
- Game and query knowledge under `knowledge/` and `data/query/`.

## Dependencies

Runtime architecture flows through normalized domain objects:

Query and identity interpretation -> printing and variant resolution -> certification profile -> market snapshot -> business profile -> readiness and pipeline validation -> card intelligence -> strategy -> negotiation ladder -> offer validation -> decision -> presentation.

Atlas is outside this runtime chain.

## Engines

- Query, search, canonical, intent, entity, and constraint engines.
- Variant Resolution Policy.
- Card Intelligence Engine and signal registry.
- Strategy scoring and constraints.
- Profit and evaluation engines.
- Negotiation ladder, offer calculator, offer validator, and decision resolver.
- Ranking and opportunity generation.
- Market condition adjustment.

## Providers

- Scryfall Identity Provider.
- Scryfall Market Provider.
- Mock Marketplace Provider.
- TCGplayer, eBay, CardTrader, LigaMagic provider placeholders or abstractions.

Provider rule: provider data must be adapted into domain objects before engines or UI consume it.

## Intelligence Models

- Asset Intelligence Framework.
- Card Intelligence signals.
- Playability Intelligence backed by Scryfall legalities.
- Playability Intelligence Level 2 demand layer backed by configurable format weights and demand hints.
- Certification Intelligence backed by a placeholder provider and provider registry.
- Future models: Grading, Regional, Behavior, Historical, Volatility, Demand, Scarcity, Liquidity, and other registered intelligence dimensions.

Intelligence rule: intelligence measures asset characteristics. It does not decide BUY, NEGOTIATE, PASS, or offer values.

Certification dependency graph: Certification Intelligence -> Collector Intelligence -> Strategy -> Negotiation Ladder -> Decision Resolver.

Future certification providers: PSA, BGS, CGC, TAG, SGC, and ARS through `CertificationRegistry`.

Information architecture rule: Vendor Workspace displays Decision, Explanation, and Evidence. Atlas Inspector displays Implementation details.

Final Intelligence Console rule: expanded panels display Grade/Confidence, Business Conclusion, Key Signals, and Supporting Evidence only.

Playability maturity rule: legality is evidence, not the conclusion. Playability conclusions describe player demand.

Evidence sufficiency rule: required evidence gates grades. Unknown is not failure.

## Workflows

- Vendor Workflow Machine.
- Workflow Command Processor.
- Context Invalidation Engine.
- Asset Context Validator.
- System Readiness.
- Pipeline Inspector.
- Evaluation History snapshot lifecycle.

Workflow rule: UI dispatches commands and renders state; engines own business output.

## Atlas Isolation

Atlas lives under `/atlas` and is intentionally absent from the runtime dependency graph.
