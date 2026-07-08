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
- Asset Knowledge Graph under `lib/knowledge/`.
- Asset Assessment under `lib/assessment/`.
- Evidence Sufficiency Framework under `lib/intelligence/framework/`.
- Game and query knowledge under `knowledge/` and `data/query/`.

## Dependencies

Runtime architecture flows through normalized domain objects:

Query and identity interpretation -> printing and variant resolution -> certification profile -> market snapshot -> readiness and pipeline validation -> card intelligence -> asset assessment -> business profile -> strategy -> negotiation ladder -> offer validation -> decision -> presentation.

Atlas is outside this runtime chain.

Semantic relationship flow:

Asset data -> Relationship Resolver -> Asset Knowledge Graph -> Intelligence models -> normalized Intelligence Profile output.

Assessment flow:

Intelligence model evidence -> Evidence Sufficiency -> Asset Assessment Engine -> Business Profile context -> Strategy scoring -> Negotiation Ladder -> Decision Resolver.

## Engines

- Query, search, canonical, intent, entity, and constraint engines.
- Variant Resolution Policy.
- Card Intelligence Engine and signal registry.
- Asset Assessment Engine and Assessment Registry.
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
- Playability Intelligence Level 3 adapter, demand model, and card role model.
- Certification Intelligence backed by a placeholder provider and provider registry.
- Asset Knowledge Graph relationship context consumed by Playability and Certification.
- Asset Assessment registered as the canonical synthesis model for Intelligence evidence.
- Future models: Grading, Regional, Behavior, Historical, Volatility, Demand, Scarcity, Liquidity, and other registered intelligence dimensions.

Intelligence rule: intelligence measures asset characteristics. It does not decide BUY, NEGOTIATE, PASS, or offer values.

Certification dependency graph: Certification Intelligence -> Collector Intelligence -> Strategy -> Negotiation Ladder -> Decision Resolver.

Future certification providers: PSA, BGS, CGC, TAG, SGC, and ARS through `CertificationRegistry`.

Information architecture rule: Vendor Workspace displays Decision, Explanation, and Evidence. Atlas Inspector displays Implementation details.

Final Intelligence Console rule: expanded panels display Grade/Confidence, Business Conclusion, Key Signals, and Supporting Evidence only.

Playability maturity rule: legality is evidence, not the conclusion. Playability conclusions describe player demand.

Evidence sufficiency rule: required evidence gates grades. Unknown is not failure.

Provider adapter rule: future playability providers normalize evidence into the Playability Profile instead of changing downstream consumers.

Knowledge graph rule: semantic relationships are shared infrastructure. Relationship Registry and Relationship Resolver enrich Intelligence reasoning without changing production UI contracts.

Assessment rule: Assessment interprets evidence but never decides BUY, NEGOTIATE, PASS, or offer values.

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
