# Sprint History

This file records logical product milestones. Sprint numbers may not perfectly match commit history.

## Sprint 28

Introduced the Asset Assessment Engine as the canonical synthesis layer for asset understanding.

- Added `lib/assessment/` with assessment, evidence, reasoning, confidence, summary, registry, and engine contracts.
- Registered Asset Assessment as a first-class Asset Intelligence model.
- Generated overall assessment, overall confidence, evidence coverage, primary drivers, supporting drivers, risk factors, opportunity factors, and business summary.
- Differentiated weak assets from unknown assets by reducing confidence for unknown evidence without reducing quality.
- Routed Strategy scoring through Asset Assessment evidence while preserving existing signal-weight compatibility.
- Added Business Profile assessment context before negotiation.
- Added Intelligence Console support for the Asset Assessment tile without redesigning existing tiles.

## Asset Knowledge Graph Sprint

Introduced the Asset Knowledge Graph as a reusable semantic layer for Intelligence models.

- Added `lib/knowledge/` with graph, node, edge, query, registry, relationship registry, and resolver contracts.
- Modeled card relationships for roles, mechanics, themes, archetypes, strategies, color identity, tribes, keywords, families, Universes Beyond, Reserved List, premium printings, and formats.
- Added configured semantic relationships for Mox Opal, Sol Ring, Collected Company, Counterspell, and Black Lotus.
- Integrated Playability Intelligence with graph relationships for richer role-aware reasoning without UI changes.
- Integrated Certification Intelligence with graph collector relationships for certification relevance while preserving provider gaps for population data.
- Added regression coverage for graph generation and Intelligence consumption.

## Sprint 26

Playability Intelligence matured from Level 2 to Level 3.

- Added a provider-ready Playability Provider Adapter.
- Added a normalized Demand Model with Commander, competitive, casual, combo, staple, diversity, stability, ban risk, meta dependency, resilience, and future readiness dimensions.
- Added a provider-independent Card Role Model.
- Added role-aware business conclusions and key signals.
- Added Mox Opal regression coverage.
- Preserved Evidence Sufficiency and Unknown behavior when provider evidence remains inadequate.

## Sprint 25.1

Introduced the Evidence Sufficiency Framework.

- Added framework contracts for Evidence Requirement, Evidence Status, Evidence Score, Evidence Report, and Evidence Sufficiency Engine.
- Required every Intelligence model to declare required, optional, and future evidence.
- Added Unknown as a non-failing grade state when evidence is insufficient.
- Differentiated missing evidence from negative evidence.
- Reduced confidence when evidence is partial or insufficient.
- Integrated evidence reports into Playability, Certification, Collector, Investment, Market, Liquidity, Regional, Historical, Behavior, and Volatility models.
- Added Atlas Inspector evidence diagnostics.

## Sprint 25

Playability Intelligence matured from Level 1 Framework to Level 2 Meaningful Intelligence.

- Added configurable format weights.
- Added playability demand hints for known test cards and provider-ready demand modeling.
- Expanded each format indicator with legality, importance, demand level, competitive relevance, casual relevance, confidence, trend, status, and provider.
- Added natural-language business conclusions explaining why the market cares about each card.
- Added Key Signals describing where demand comes from.
- Replaced legality-only scoring with weighted player demand scoring.
- Added indicators for Commander Strength, Competitive Strength, Casual Strength, Format Diversity, Demand Stability, Ban Risk, Meta Dependency, and Future Demand Readiness.
- Preserved provider abstraction and left EDHREC, MTGGoldfish, Melee, MTGO, and Tournament APIs as future hooks.

## Sprint 24.2

Finalized the Intelligence Console presentation contract.

- Expanded tiles now answer exactly four questions: what the model thinks, how certain it is, why, and what evidence supports it.
- Removed redundant Summary and What This Means sections.
- Renamed confidence to model-specific labels such as Certification Confidence.
- Added plain-language confidence reasons whenever confidence is below High.
- Renamed Primary Supporting Indicators to Key Signals.
- Renamed Evidence to Supporting Evidence and kept it factual.
- Added session-scoped expanded tile memory.
- Preserved business logic and Intelligence calculations.

## Sprint 24.1

Layered Information Architecture for the Intelligence Console.

- Standardized every Intelligence model around Decision, Explanation, Evidence, and Implementation layers.
- Kept Layers 1 and 2 visible by default in Vendor Workspace.
- Moved implementation details into Atlas Inspector developer mode.
- Replaced numeric production confidence with Very Low, Low, Moderate, High, and Very High labels.
- Kept numeric confidence, versions, status, health, provider status, internal sources, future dependencies, and provider matrix visible in Atlas.
- Preserved business engines and intelligence calculations.

## Sprint 24

Certification Intelligence became a first-class Asset Intelligence model.

- Added provider-ready Certification architecture under `lib/intelligence/certification/`.
- Added a placeholder provider for PSA, BGS, and CGC with no scraping and no unofficial APIs.
- Generated Certification Profiles with overall grade, provider grade, confidence, population, gem population, gem rate, estimated premium, trend, status, source, and last updated fields.
- Added Certification indicators for grade, population scarcity, gem rate, premium, population trend, collector competition, and submission saturation.
- Updated Collector Intelligence to consume Certification Intelligence while preserving configurable strategy weights.
- Updated Intelligence Console expanded details for Certification provider status and future providers.
- Added regression coverage for Chrome Mox, Black Lotus, Textless Urza's Saga, serialized examples, Masterpieces, and Judge Promos.

## Sprint 0

Project setup, GitHub, Next.js, TypeScript, Tailwind CSS.

## Sprint 1

Application shell and first dashboard.

## Sprint 2

Watchlists became buying strategies instead of simple card lists.

## Sprint 3

Hot Opportunities and the first Opportunity domain model.

## Sprint 4

Opportunity scoring and ranking foundation.

## Sprint 5

Profit Engine for calculated net profit, fees, shipping, and total costs.

## Sprint 6

Marketplace Provider abstraction for provider-independent opportunity generation.

## Sprint 7

Weighted Opportunity Ranking Engine.

## Sprint 8

Strategy Engine and strategy-specific opportunity ranking.

## Sprint 9

Vendor Workspace for fast in-person purchase evaluation.

## Sprint 10

Universal Search Engine foundation.

## Sprint 11

Scryfall Identity Provider Platform and developer diagnostics.

## Sprint 12

Universal Query Engine and TCG Knowledge Platform.

## Sprint 12.5

Intent Resolution Engine.

## Sprint 12.6

Entity Resolution and identity relationships.

## Sprint 12.7

Canonical Resolution Engine for professional shorthand.

## Sprint 12.8

Constraint Satisfaction Engine for printing selection.

## Sprint 12.9

Prefix Matching and Progressive Query Resolution.

## Sprint 12.10

Special Guests / bonus-sheet vocabulary and zero-match default prevention.

## Sprint 12.11

Identity-token vs constraint-token separation for queries like `collected company tarkir`.

## Sprint 13

Visual Printing Confirmation and Documentation Recovery.

Added domain image URL support, Scryfall image adaptation, image fallbacks, Vendor Workspace card images, and recovered documentation.

### Targeted Vendor Workspace Fix

Improved punctuation normalization, Textless knowledge recognition, and low-confidence identity handling so queries such as `urza's saga textless`, `urzas saga textless`, and `urza saga textless` resolve to Urza's Saga and show printing candidates.

### Targeted Printing Variant Fix

Introduced explicit printing finish variants. Multi-finish printings now keep finish selection unresolved until the query or user selects a finish, while explicit queries such as `urza's saga secret lair foil` and `urza's saga secret lair nonfoil` select the correct variant.

## Sprint 14

First Live Market Provider.

Added Scryfall Market Provider v1, normalized market price snapshots, and Vendor Workspace support for daily Scryfall market estimates. Lowest listing and recent sale remain unavailable until Market Provider v2 adds true marketplace inventory or sales data.

## Sprint 15

Variant Resolution Policy and Purchase Evaluation Engine.

Added a reusable Variant Resolution Policy that respects explicit finish requests, auto-selects single-finish printings, defaults multi-finish printings to Nonfoil, and falls back to the least-special finish. Vendor Workspace now completes the buying workflow with market estimate, asking price, estimated profit, ROI, recommended offer, confidence, and BUY / NEGOTIATE / PASS recommendations.

## Sprint 16

Decision-First Vendor Workspace.

Optimized Vendor Workspace for faster buying sessions by placing printing candidates beside a sticky decision panel, reorganizing metrics, removing repeated explanation text, and introducing Decision Drivers for concise business reasoning. Atlas now records backlog, technical debt, dependency graph, and reusable interaction patterns.

## Sprint 17

Vendor Workspace VX Optimization.

Compressed the in-person buying workflow for professional trading sessions. Printing rows are denser, thumbnails are smaller, common printing refinements are chip-based, purchase evaluation updates automatically with a short debounce, and the decision panel now surfaces BUY / NEGOTIATE / PASS plus offer, profit, and ROI as the first thing to read.

Keyboard behavior now supports ESC reset, natural tab order, Enter selection outside text inputs, and arrow-key printing navigation without interrupting typing.

## Sprint 18

Card Intelligence Platform.

Introduced Card Profile, Signal Registry, signal versioning, condition-adjusted market snapshots, Market Context, Negotiation Ladder, and a deterministic Decision Resolver. Purchase Evaluation now flows through card intelligence signals and a negotiation ladder before BUY / NEGOTIATE / PASS is selected.

Vendor Workspace gained a Condition selector and collapsible Card Profile panel. Automated tests now verify condition-sensitive market estimates, negotiation ladders, decisions, strategy signal weighting, finish-sensitive ladders, independent signals, and exact BUY / NEGOTIATE / PASS ladder invariants.

## Sprint 20

Asset Intelligence Framework.

Introduced a common intelligence framework so future intelligence work becomes registered models instead of isolated scoring engines. The framework defines `IntelligenceModel` and `Indicator` contracts, model health, indicator status, version metadata, provider dependencies, dependency graphs, and future model registration.

Existing Card Intelligence signals now feed framework indicators and `CardProfile` exposes `intelligenceModels` for Vendor Workspace compatibility. Current and future models are registered for Market, Collector, Investment, Liquidity, Reprint Risk, Market Confidence, Playability, Grading, Regional, Behavior, Historical, Volatility, Demand, and Scarcity intelligence.

## Sprint 20.1

Vendor Workflow Stabilization.

Introduced a deterministic Vendor Workflow State Machine for the existing Vendor Workspace without changing business logic or the Intelligence Framework. The workflow now tracks `Idle`, `Searching`, `CandidatesFound`, `IdentityHighlighted`, `IdentitySelected`, `PrintingsLoaded`, `PrintingSelected`, `VariantResolved`, `ConditionResolved`, `ReadyForEvaluation`, `Evaluating`, `EvaluationComplete`, and `Error`.

Vendor Workspace now separates identity candidates, highlighted identity, and selected identity. The Single Printing Rule automatically advances exact one-printing identities toward market loading and purchase evaluation, while multi-printing identities immediately show printing choices. Developer diagnostics expose state transitions, trigger, counts, auto-selection reason, Single Printing Rule activation, and timing.

## Sprint 20.2

Evaluation Integrity.

Hardened the purchase evaluation pipeline so recommendations are mathematically consistent and traceable. The pipeline is now documented as Card → Printing → Variant → Condition → Market Context → Asset Intelligence → Strategy → Offer Ladder → Offer Ladder Validation → Decision Resolver → Vendor Workspace.

Added `OfferLadderValidator` to enforce Opening Offer <= Target Offer <= Maximum Buy Price and Recommended Offer <= Maximum Buy Price before the Decision Resolver can execute. Purchase Evaluation now returns explicit `READY`, `UNAVAILABLE`, `INVALID`, or `WAITING_FOR_DATA` results and carries Evaluation Trace data for market, profit, strategy, offer ladder, validation, and decision reasoning.

## Sprint 20.3

Workflow Ownership Stabilization.

Moved Vendor Workspace selection authority into the Vendor Workflow Machine. The workflow snapshot now owns highlighted identity, selected identity, selected printing, selected variant, selected condition, selected strategy, and asking price context. UI components dispatch workflow events and render from workflow context.

Added `ContextInvalidationEngine` so upstream changes automatically clear downstream dependencies. Changing identity clears printing, variant, condition, market estimate, card intelligence, offer ladder, decision, and evaluation. Rejected workflow transitions leave context unchanged, preventing half-selected UI states.

## Sprint 20.4

Workflow Command Architecture.

Replaced workflow events with intent-based workflow commands. Vendor Workspace now dispatches commands such as `SelectCard`, `SelectPrinting`, `SelectVariant`, `SelectCondition`, `ChangeStrategy`, `EnterAskingPrice`, and `ResetWorkspace`; the Workflow Command Processor decides state, invalidation, loaded objects, rejection, and command diagnostics.

Moved command invalidation into `lib/workflow/commands/ContextInvalidationEngine.ts` and added command contracts under `lib/workflow/commands/`. The Single Printing Rule now executes inside command processing, so one-printing identities such as Curse of Shallow Graves can load the printing, resolve the variant, and reach `ReadyForEvaluation` without UI-authored transition steps.

## Sprint 20.5

Asset Context Integrity and Atlas Developer Tools.

Introduced `AssetContext` as the generated identity → printing → variant → condition → market → card profile → offer ladder → decision reference chain. Workflow Command Processor owns the context, increments generation on upstream changes, and rejects market snapshots that do not match the current printing and variant.

Added `AssetContextValidator` to classify visible context as `Valid`, `Invalid`, or `Incomplete`. Vendor Workspace no longer exposes workflow diagnostics in production UI. Development diagnostics moved into Atlas Inspector, enabled with Cmd/Ctrl+Shift+D in development mode.

## Sprint 20.6

Condition-Aware Market Pricing Regression Recovery.

Restored the pre-refactor condition pricing lifecycle by reconnecting market provider loading to Asset Context generation. Changing NM, LP, MP, HP, or DMG now dispatches `ChangeCondition`, creates a new Asset Context generation, invalidates downstream objects, requests a fresh market snapshot, and lets the existing condition-aware pricing pipeline feed Card Intelligence, Offer Ladder, and Decision Resolver again.

Added generation to `LoadMarketSnapshot` commands so stale provider responses from older contexts are rejected. Atlas Inspector now shows requested condition, snapshot source, snapshot generation, provider real-data status, and fallback status.

## Sprint 21

Intelligence History Platform.

Introduced append-only evaluation history for completed purchase evaluations. Every `READY` evaluation can produce an immutable `EvaluationSnapshot` containing Asset Context generation, identity, printing, variant, condition, Market Context, Buying Strategy, Market Estimate, Offer Ladder, Decision, confidence, and Card Intelligence indicators.

Added `EvaluationHistoryEngine`, `HistoryRepository`, `SnapshotFactory`, and `SnapshotValidator`. Current persistence is local and append-only, with future paths for database storage, analytics, backtesting, strategy replay, market replay, signal validation, simulation, personal buying history, and portfolio tracking.

## Sprint 22

Playability Intelligence Platform and Intelligence Console v2.

Introduced `lib/intelligence/playability/` as the first reusable intelligence model that explains why a card has play demand. Playability now has an engine, provider abstraction, provider registry, profile contract, indicator contract, trend contract, and source contract.

The first provider is `ScryfallPlayabilityProvider`, which consumes normalized Scryfall legalities from domain `Card` objects. It produces format indicators for Commander, Modern, Legacy, Vintage, Pioneer, Standard, Pauper, Explorer, and Canadian Highlander, while deck penetration, metagame stability, and trend remain provider-ready placeholders.

`CardProfile` now exposes `playabilityProfile`, Asset Intelligence registers Playability as a live model, the Playability signal consumes profile output, strategies consume the signal through configurable weights, and Vendor Workspace displays playability through the reusable Intelligence Console.

Added `components/intelligence/` as the permanent presentation layer for every Asset Intelligence model. The console renders compact collapsed tiles by default, converts scores into A+ through F grades for presentation, keeps confidence separate, and expands one tile at a time into model details without requiring custom UI per intelligence model.

## Sprint 23

Business Profiles Platform.

Introduced business-aware recommendations so two vendors evaluating the same card can receive different recommendations based on their actual costs, marketplace assumptions, target profit, ROI, margin, negotiation style, and risk tolerance.

Added `lib/business/` with Business Profile Engine, Registry, Marketplace Profiles, Cost Profiles, Shipping Profiles, Tax Profiles, Payment Profiles, and built-in defaults. Initial marketplace templates include TCGplayer, eBay, CardTrader, Facebook Marketplace, Discord, Local Cash, Convention Sales, and Direct Store.

Purchase Evaluation and Offer Ladder now consume Business Profiles instead of generic fixed fees. Vendor Workspace has a Business Profile selector, `/settings` supports profile management actions, and regression tests verify that the same card and market estimate can produce different profit, ROI, offer ladder, and decision outcomes.

## Sprint 23.1

System Readiness Platform.

Introduced centralized readiness validation under `lib/validation/` so purchase evaluation validates prerequisites before Strategy, Offer Ladder, or Decision Resolver execution. Readiness distinguishes configuration problems, missing data, business rule failures, calculation failures, and internal errors.

Readiness reports now include status, blocking issues, warnings, ready components, and missing components. Purchase Evaluation carries the report, production unavailable states show user-facing blockers, and Atlas Inspector exposes System Readiness, Configuration Readiness, Offer Ladder Readiness, and Decision Readiness in developer mode only.

Negative negotiation margin is no longer treated as an internal validation error; it remains decision context. Regression coverage verifies missing Business Profile, missing ROI, missing market data, optional Playability, complete readiness, and the previous negotiation-margin message failure mode.

## Sprint 23.2

Pipeline Integrity.

Introduced `lib/pipeline/` with Pipeline Inspector, Pipeline Stage, Pipeline Report, and Pipeline Validation contracts. The inspector executes Asset, Market, Business, Cost Profile, Offer Policy, Strategy, Offer Ladder, and Decision stages, recording received inputs, calculated outputs, validation status, fallbacks, missing fields, execution time, and first invalid stage.

Business Profiles now own Offer Policy, which contains minimum ROI, minimum profit, desired margin, negotiation aggressiveness, and maximum capital exposure. Offer Ladder consumes that policy directly.

The sprint fixed a zero-valued Offer Ladder failure where an impossible maximum buy price was rounded into `0`. Pipeline Integrity now blocks Decision Resolver execution when a ladder output becomes zero unexpectedly and Atlas Inspector shows the first invalid stage in developer mode only.
