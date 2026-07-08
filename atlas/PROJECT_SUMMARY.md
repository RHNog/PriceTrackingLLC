# Project Summary

Sprint 24 adds Certification Intelligence as a first-class Asset Intelligence model.

Certification Intelligence measures collectible certification characteristics through a provider abstraction. Current coverage is placeholder-only for PSA, BGS, and CGC, with TAG, SGC, and ARS registered as future providers. It does not scrape, does not use unofficial APIs, and never decides BUY/PASS.

Dependency rule:

Certification Intelligence -> Collector Intelligence -> Strategy -> Negotiation Ladder -> Decision Resolver.

Sprint 24.1 adds layered Intelligence Console presentation.

Vendor Workspace shows Decision, Explanation, and Evidence. Atlas Inspector shows Implementation details such as provider status, versions, health, internal signals, future dependencies, and debug information.

Sprint 24.2 finalizes the Intelligence Console UI contract.

Expanded tiles show Grade/Confidence, Business Conclusion, Key Signals, and Supporting Evidence only. Confidence below High includes a business-facing reason, and expanded tile state persists for the current session.

Sprint 25 matures Playability Intelligence to Level 2.

Playability now measures weighted player demand using configurable format weights, demand hints, business conclusions, key signals, and richer per-format demand fields. Scryfall remains the current source, while EDHREC, MTGGoldfish, Melee, MTGO, and Tournament APIs remain future provider hooks.

Sprint 25.1 adds Evidence Sufficiency.

Intelligence models now declare required, optional, and future evidence. Insufficient required evidence produces Unknown rather than a failing grade, and Atlas Inspector displays missing evidence diagnostics.

Sprint 26 matures Playability Intelligence to Level 3.

Playability now includes a provider-ready adapter, normalized demand dimensions, format analysis, and provider-independent card role signals. Business conclusions explain why players use a card and how that use contributes to market demand.

The Asset Knowledge Graph sprint introduces reusable semantic relationships.

`lib/knowledge/` now models graph nodes, graph edges, queries, relationship registry, relationship resolver, and graph registry. Playability consumes graph roles and semantic relationships for richer reasoning. Certification consumes premium-printing, Reserved List, and collector-role relationships when estimating certification relevance. The graph does not redesign UI, strategy, or negotiation behavior.

Sprint 28 introduces the Asset Assessment Engine.

`lib/assessment/` now synthesizes Knowledge Graph, Playability, Certification, Collector, Investment, Market, Liquidity, Business Context, and Evidence Sufficiency into one deterministic Asset Assessment. Assessment produces overall assessment, confidence, evidence coverage, primary drivers, supporting drivers, risk factors, opportunity factors, and business summary. Business Profiles and Strategies consume this assessment instead of inspecting individual Intelligence models directly.

Sprint 29 introduces the Intelligence Provider SDK.

`lib/providers/sdk/` now defines the provider lifecycle for future integrations. Providers supply data only; SDK contracts own normalization, health, caching hooks, diagnostics, evidence mapping, confidence contribution, provider metadata, retry hooks, and validation hooks. EDHREC, PSA, BGS, CGC, Cardmarket, TCGplayer, Melee, MTGO, LigaMagic, and eBay are registered as planned metadata-only providers.

## Current Architecture

PriceTrackingLLC is a Next.js, TypeScript, and Tailwind CSS application for professional trading-card buying decisions.

The runtime architecture separates:

- Query and identity interpretation.
- Printing, finish, and condition resolution.
- Market provider normalization.
- Provider SDK lifecycle normalization.
- Business Profile and Offer Policy assumptions.
- System Readiness and Pipeline Integrity.
- Card and Asset Intelligence.
- Asset Assessment.
- Strategy scoring.
- Negotiation Ladder generation.
- Offer Ladder validation.
- Deterministic decision resolution.
- Vendor Workspace presentation.

Atlas is not part of this runtime architecture. It is an internal companion system.

## Current Sprint

Sprint 29: Intelligence Provider SDK

## Current Milestone

Reusable provider lifecycle infrastructure.

## Open Issues

- Atlas report generation is not automated yet.
- Known issues are tracked manually.
- Repository scanning is available as a standalone TypeScript utility but not connected to a script.
- Existing test execution needs a formal alias-aware test runner.
- Knowledge Graph relationship coverage is configured for known examples and should be provider-enriched later.
- Assessment driver weights are deterministic and should be calibrated with future outcome history.
- Provider SDK adapters are metadata-only until approved integration paths exist.

## Technical Debt

- Business Profile persistence remains future work.
- Readiness Reports and Pipeline Reports are not persisted.
- Live marketplace listings and recent sales are not integrated.
- Browser visual regression coverage is not active.
- Atlas has no drift detection yet.
- Relationship confidence calibration remains future work.
- Assessment source weighting remains configuration-ready future work.
- Existing Scryfall providers still use their current local provider contracts and should migrate gradually.

## Next Recommended Sprint

Migrate existing Scryfall providers into the Provider SDK lifecycle without changing domain outputs.
