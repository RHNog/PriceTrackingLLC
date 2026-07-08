# Project Knowledge

## Architecture Philosophy

PriceTrackingLLC is a Professional TCG Decision Operating System, not a generic price tracker.

The architecture separates interpretation, market data, business assumptions, intelligence, strategy, negotiation, validation, and decision. Each layer should own one kind of responsibility and pass normalized domain objects to the next layer.

## Business Philosophy

Market Intelligence answers what an asset appears to be worth in the market. Business Profiles answer what that asset is worth to a specific business after costs, margin, ROI, capital exposure, and negotiation policy.

Decision Resolver should remain deterministic after receiving a validated Offer Ladder.

## Design Principles

- Vendor Workspace is decision-first and optimized for fast in-person buying.
- Production users should see clear outcomes and user-safe blockers, not internal diagnostics.
- Developer diagnostics belong in development-only surfaces.
- UI components render state and dispatch intent; engines calculate business values.
- Intelligence models measure, but do not decide.
- Zero is not unknown. Missing values must be unavailable or invalid.

## Important Decisions

- Identity Providers and Market Providers are separate provider families.
- Provider responses must be normalized before entering engines or UI.
- Variant Resolution Policy owns automatic finish defaults.
- Workflow Command Processor owns Vendor Workspace context progression.
- Asset Context protects downstream state from stale upstream selections.
- System Readiness owns prerequisite validation.
- Pipeline Inspector owns first-invalid-stage diagnostics.
- Business Profiles own Offer Policy.
- Certification Intelligence measures collectible certification characteristics only.
- Certification Provider data must enter through `CertificationRegistry`.
- Collector Intelligence consumes Certification Intelligence before strategies interpret collector value.
- Playability Intelligence measures player demand, not legality alone.
- Playability format weights live in configuration.
- Playability Provider Adapter normalizes current and future provider evidence.
- Card roles are provider-independent Playability signals.
- Asset Knowledge Graph owns reusable semantic relationships between assets.
- Relationship Registry owns configured roles, mechanics, themes, archetypes, strategies, color identity, tribes, keywords, families, Universes Beyond, Reserved List, premium printings, and format relationships.
- Evidence Sufficiency determines whether Intelligence models may issue grades.
- Unknown means missing evidence, not poor quality.
- Vendor Workspace owns Intelligence layers 1-3: Decision, Explanation, and Evidence.
- Atlas Inspector owns Intelligence layer 4: Implementation.
- Final Intelligence Console panels use Grade/Confidence, Business Conclusion, Key Signals, and Supporting Evidence only.
- Offer Ladder Validator blocks invalid negotiation math before Decision Resolver executes.

## Asset Knowledge Graph Knowledge

The Asset Knowledge Graph lives under `lib/knowledge/`.

Core contracts:

- `AssetKnowledgeGraph`
- `KnowledgeNode`
- `KnowledgeEdge`
- `KnowledgeQuery`
- `RelationshipRegistry`
- `RelationshipResolver`
- `KnowledgeGraphRegistry`

Integration rules:

- Playability consumes graph roles, archetypes, themes, strategies, and format context.
- Certification consumes graph premium-printing, Reserved List, and collector-role relationships.
- Collector Intelligence may consume graph-enriched Certification and future graph facts through normalized Intelligence outputs.
- The graph does not decide BUY, PASS, strategy, negotiation, or offer values.

## Permanent Rules

- Do not modify Vendor Workspace behavior during Atlas-only work.
- Do not modify business engines during Atlas-only work.
- Do not modify production UI during Atlas-only work.
- Keep Atlas internal and isolated.
- Do not add production imports to Atlas.
- Do not expose Atlas artifacts to customers.
- Keep canonical sprint, roadmap, architecture, decision, and prompt history in sync through source references and future generation rather than copy-paste drift.

## Sprint 24 Knowledge

Certification Intelligence dependency graph:

Certification Intelligence -> Collector Intelligence -> Strategy -> Negotiation Ladder -> Decision Resolver.

Current provider state:

- Placeholder provider for PSA, BGS, and CGC.
- Future providers: TAG, SGC, ARS.
- No scraping.
- No unofficial APIs.

Technical debt:

- Population, gem population, gem rate, population trend, and submission saturation remain placeholders.
- Estimated premium is metadata-based until official graded-market providers exist.

## Sprint 24.1 Knowledge

Layered Information Architecture:

- Layer 1: Decision
- Layer 2: Explanation
- Layer 3: Evidence
- Layer 4: Implementation

Vendor Information Model:

- Model name
- Grade
- Confidence label
- Summary
- Business conclusion
- Primary supporting indicators
- Evidence

Atlas Information Model:

- Numeric confidence
- Version
- Health
- Status
- Internal sources
- Future dependencies
- Internal signals
- Provider status
- Provider matrix
- Debug information

## Sprint 24.2 Knowledge

Final Intelligence Console UI Contract:

- Grade
- Model-specific Confidence
- Business Conclusion
- Key Signals
- Supporting Evidence

Production rules:

- Remove duplicate Summary and What This Means sections.
- Confidence below High always explains itself.
- Key Signals are limited to four items.
- Supporting Evidence is factual.
- Expanded tile memory is session-scoped.
- Atlas owns implementation details.

## Sprint 25 Knowledge

Playability Intelligence is now Level 2 Meaningful Intelligence.

It answers:

- Why is this card played?
- Where does demand come from?
- Is demand Commander, competitive, casual, broad, stable, or meta-dependent?

Current source:

- Scryfall legalities.

Demand layer:

- Configurable format weights.
- Demand hints.
- Weighted format contribution.
- Business conclusions.
- Key Signals.

Future providers:

- EDHREC.
- MTGGoldfish.
- Melee.
- MTGO.
- Tournament APIs.

## Sprint 25.1 Knowledge

Evidence Sufficiency Framework:

- EvidenceRequirement
- EvidenceStatus
- EvidenceScore
- EvidenceReport
- EvidenceSufficiencyEngine

Rules:

- Evidence precedes conclusion.
- Confidence reflects evidence quality.
- Missing evidence is not negative evidence.
- Unknown blocks definitive conclusions.
- Future providers improve evidence sufficiency automatically.

Initial insufficient examples:

- Playability without EDHREC or equivalent demand providers.
- Certification without PSA, BGS, or CGC provider-backed population data.

## Sprint 26 Knowledge

Playability Intelligence is now Level 3 Explainable Demand Intelligence.

Registered concepts:

- Demand Model.
- Card Role Model.
- Playability Provider Adapter.

Demand dimensions:

- Commander Demand.
- Competitive Demand.
- Casual Demand.
- Combo Relevance.
- Staple Status.
- Format Diversity.
- Demand Stability.
- Ban Risk.
- Meta Dependency.
- Demand Resilience.
- Future Demand Readiness.

Card roles:

- Fast Mana.
- Commander Staple.
- Combo Piece.
- Tutor.
- Removal.
- Counterspell.
- Finisher.
- Engine.
- Utility.
- Value Card.
- Ramp.
- Protection.
- Card Draw.
