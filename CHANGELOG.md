# Changelog

All notable changes to this project will be documented in this file.

The format is inspired by "Keep a Changelog".

---

## [Unreleased]

### Added
- Intelligence Console v2 as the reusable presentation layer for Asset Intelligence models.
- `components/intelligence/IntelligenceConsole.tsx`, `IntelligenceTile.tsx`, `IntelligenceDetail.tsx`, and `IntelligenceGrade.tsx`.
- Intelligence grade mapping from internal numeric scores to A+ through F presentation grades.
- Compact collapsed intelligence tiles with name, grade, confidence, and expand affordance.
- Expanded intelligence detail panels with score, grade, confidence, version, status, summary, factors, sources, trend, future dependencies, and explanation.
- Intelligence Console grade mapping regression coverage.
- Sprint 22 Playability Intelligence Platform.
- `lib/intelligence/playability/` with Playability Engine, Provider abstraction, Registry, Profile, Indicator, Trend, and Source contracts.
- `ScryfallPlayabilityProvider` using Scryfall legalities as the first provider-backed playability source.
- Playability Profile with Overall, Commander, Modern, Legacy, Vintage, Pioneer, Standard, Pauper, Explorer, and Canadian Highlander format indicators.
- Playability indicators for overall playability, Commander strength, competitive strength, casual strength, ban risk, format diversity, meta stability, trend, and future deck penetration.
- Playability regression coverage for Chrome Mox, Sol Ring, Lightning Bolt, Black Lotus, Counterspell, and Collected Company.
- Sprint 21 Intelligence History Platform.
- Evaluation Snapshot, Asset Snapshot, Market Snapshot History, Strategy Snapshot, and Offer Ladder Snapshot types.
- Evaluation History Engine, History Repository, Snapshot Factory, and Snapshot Validator.
- Append-only local Evaluation History recording for completed `READY` purchase evaluations.
- Sprint 20.6 condition-aware market pricing regression recovery.
- Generation-aware market snapshot requests so condition changes reload provider market data for the current Asset Context.
- Atlas Inspector provider trace fields for requested condition, snapshot source, snapshot generation, provider real-data status, and fallback status.
- Sprint 20.5 Asset Context Integrity and Atlas Developer Tools.
- `AssetContext` domain type with context id, generation, identity, printing, variant, condition, market, card profile, offer ladder, and decision references.
- `AssetContextValidator` for detecting invalid, incomplete, or synchronized asset context.
- Atlas Inspector developer tool behind Cmd/Ctrl+Shift+D in development mode.
- Sprint 20.4 Workflow Command Architecture.
- `WorkflowCommand`, `WorkflowCommandProcessor`, `WorkflowCommandResult`, and `CommandRegistry` for intent-based Vendor Workspace orchestration.
- Command diagnostics for last command, accepted commands, rejected commands, invalidated objects, reloaded objects, rejection reason, and execution time.
- Sprint 20.3 Workflow Ownership stabilization.
- `ContextInvalidationEngine` for automatic downstream invalidation when identity, printing, variant, condition, strategy, market context, or asking price changes.
- Workflow diagnostics for invalidated objects, loaded objects, accepted commands, and rejected commands.
- Sprint 20.2 Evaluation Integrity foundation.
- Offer Ladder Validator for impossible values, missing values, negative values, and ladder-ordering invariants.
- Evaluation Trace, Profit Trace, Offer Ladder Trace, Strategy Trace, and Decision Trace outputs.
- Evaluation integrity tests for positive-profit decisions, PASS decisions, unavailable market data, and invalid offer ladders.
- Sprint 20.1 Vendor Workflow State Machine for deterministic Vendor Workspace progression.
- Vendor Workflow diagnostics showing current state, previous state, last command, identity count, printing count, auto-selection reason, Single Printing Rule activation, and execution timing.
- Vendor Workflow Machine tests for single printing, multiple printing, ambiguous identity, auto-selection, ESC reset, and no-printing error paths.
- Sprint 20 Asset Intelligence Framework foundation.
- Shared Intelligence Model contract with id, name, version, status, confidence, inputs, outputs, indicators, supporting sources, health, explanation, and dependency graph.
- Shared Indicator contract with score, confidence, version, status, data sources, contributing factors, last updated timestamp, explanation, and future dependencies.
- Intelligence Model registry for Market, Collector, Investment, Liquidity, Reprint Risk, Market Confidence, Playability, Grading, Regional, Behavior, Historical, Volatility, Demand, and Scarcity intelligence.
- Asset Intelligence Framework tests for model registration, indicator registration, metadata, placeholder models, dependency graph generation, and Vendor Workspace compatibility.
- Sprint 18 Card Intelligence Platform foundation.
- Deterministic Card Profile and signal architecture for investment, flip, grading, collector, liquidity, volatility, scarcity, demand, playability, reprint risk, market confidence, and historical stability signals.
- Condition Resolution with NM, LP, MP, HP, and DMG condition profiles.
- Condition-adjusted market snapshots for purchase evaluation.
- Market Context domain object for country, region, currency, marketplace, language, tax, and shipping assumptions.
- Negotiation Ladder Engine with opening offer, target offer, maximum buy price, and walk-away price.
- Deterministic Decision Resolver that compares asking price against the Negotiation Ladder.
- Vendor Workspace Condition selector and collapsible Card Profile panel.
- Automated tests for condition-sensitive market estimates, negotiation ladders, decisions, signal independence, strategy signal weighting, finish-sensitive ladders, and BUY / NEGOTIATE / PASS invariants.
- Sprint 17 Vendor Workspace VX optimization for denser, keyboard-first buying sessions.
- Printing filter chips for common buyer refinements such as Foil, Judge, Retro, Textless, Secret Lair, Special Guests, and Masterpiece.
- Automatic debounced purchase evaluation when asking price, finish, or printing changes.
- Compact quick summary showing decision, target offer, expected profit, and ROI after evaluation.
- Decision-first Vendor Workspace layout with a desktop sticky decision panel.
- Decision Drivers Engine for concise recommendation reasoning.
- Project Atlas documentation for backlog, patterns, dependency graph, and technical debt.
- Variant Resolution Policy for automatic purchasable finish selection.
- Complete purchase evaluation output with BUY / NEGOTIATE / PASS, recommended offer, margin, ROI, and confidence.
- Scryfall Market Provider v1 for daily market estimate snapshots.
- Normalized `MarketPrice`, `MarketSnapshot`, and `PriceSource` domain types.
- Internal market snapshot API for Vendor Workspace market estimates.
- Printing finish variants for multi-finish Scryfall printings.
- Visual card images in Vendor Workspace identity results.
- Printing candidate thumbnails with image fallbacks.
- Selected printing image display in the purchase panel.
- Structured card image URLs and card-face image metadata.
- Documentation recovery system under `docs/`.
- Agent handoff documentation.
- Sprint history documentation.
- Architecture, roadmap, decision, product spec, prompt history, and documentation changelog files.

### Changed
- Card Profile now renders the Intelligence Console instead of bespoke large indicator cards.
- Intelligence model presentation now uses grades while preserving numeric scores internally.
- Intelligence confidence remains visually separate from grade.
- Intelligence Console expands one tile at a time by default.
- Playability Intelligence is now a live registered Asset Intelligence model with provider dependency graph metadata.
- Scryfall card adaptation now preserves legalities for normalized domain cards.
- Card Profile now exposes `playabilityProfile` alongside signals and framework intelligence models.
- The Playability signal now consumes Playability Profile output instead of a fixed placeholder score.
- Vendor Workspace Card Profile panel now displays playability tier, format legalities, trend, ban status, and deck penetration readiness.
- Seed strategies now consume Playability through configurable signal weights.
- Completed Vendor Workspace evaluations now create immutable historical intelligence snapshots without changing current UX.
- Condition changes now dispatch `ChangeCondition`, create a new Asset Context generation, and request a fresh Market Snapshot.
- `LoadMarketSnapshot` commands now carry Asset Context generation to reject slow responses from older generations.
- Vendor Workspace no longer displays workflow diagnostics in production UI.
- Market snapshots are accepted only when they match the current Asset Context printing and variant.
- Vendor Workspace passes market data to purchase evaluation only when the visible asset context is validated.
- Vendor Workspace now dispatches workflow commands such as `SelectCard`, `SelectPrinting`, `SelectVariant`, `SelectCondition`, `ChangeStrategy`, `EnterAskingPrice`, and `ResetWorkspace` instead of workflow events.
- Workflow invalidation now lives under the command processor path so components express intent while the workflow engine decides state and downstream invalidation.
- Vendor Workflow Machine now owns selected identity, highlighted identity, selected printing, selected variant, selected condition, selected strategy, and asking price context.
- Vendor Workspace now renders selected and highlighted state from workflow context instead of local component selection state.
- Purchase Evaluation now returns explicit `READY`, `UNAVAILABLE`, `INVALID`, or `WAITING_FOR_DATA` results instead of falling back to zero-like recommendations.
- Decision Resolver now consumes validated offer ladders only.
- Vendor Workspace now hides internal evaluation traces from production users while exposing them in development diagnostics.
- Vendor Workspace now separates identity candidates, highlighted identity, and selected identity.
- Vendor Workspace now applies the Single Printing Rule so exact one-printing identities progress toward evaluation without extra clicks.
- Vendor Workspace identity rows now distinguish Suggested, Highlighted, and Selected visual states.
- Card Profile now exposes framework-generated Intelligence Models in addition to existing signals.
- Vendor Workspace Card Profile panel now renders indicators from Asset Intelligence Framework outputs.
- Purchase Evaluation now consumes Card Profile, condition-adjusted market price, strategy signal weights, and Negotiation Ladder output.
- Decision Resolver no longer independently calculates BUY / PASS; it follows Negotiation Ladder invariants.
- Seeded strategies now include explicit Card Intelligence signal weights.
- Vendor Workspace market estimate, negotiation ladder, and decision now update when condition changes.
- Vendor Workspace now removes the manual Evaluate action in favor of live evaluation.
- Printing rows are denser, image thumbnails are smaller, and match score remains visible for faster scanning.
- ESC now resets Vendor Workspace and returns focus to search while arrows and Enter support printing navigation outside text inputs.
- Finish selection now renders as a compact segmented control using only available finish variants.
- Decision panel ordering now emphasizes selected card, recommendation, confidence, market estimate, asking price, maximum price, offer, profitability, and drivers.
- Vendor Workspace now puts printing candidates beside the decision panel on desktop.
- Production Vendor Workspace copy now avoids provider and engine implementation details.
- Multi-finish printings now default to Nonfoil through the Variant Resolution Policy while preserving one-click finish switching.
- Vendor Workspace now recalculates market estimate and purchase evaluation when the selected finish changes.
- Vendor Workspace now uses Scryfall market estimates when a selected printing and finish variant have price data.
- Purchase evaluation now consumes normalized market prices instead of marketplace listing objects.
- Vendor Workspace now treats a printing and its purchasable finish variant as separate selections.
- Scryfall adapter now preserves all available finishes instead of collapsing multi-finish printings to foil.
- Scryfall adapter now maps image data into normalized domain card objects.
- README now describes PriceTrackingLLC instead of the default Next.js template.

### Fixed
- Incomplete or invalid evaluation snapshots are rejected before entering history.
- Restored condition-aware market estimate and evaluation refresh after the Asset Context refactor.
- Changing NM, LP, MP, HP, or DMG no longer leaves Market Estimate unavailable when provider market data exists.
- Stale market snapshots from previous context generations are rejected before they can drive purchase evaluation.
- Rapid card switching now leaves one coherent Asset Context instead of mixed identity, printing, variant, or market references.
- The Curse of Shallow Graves / Shallow Grave class of single-printing issues is handled by command processing: loading search results can activate the Single Printing Rule, select the only printing, resolve the variant, and reach `ReadyForEvaluation` without UI-authored transitions.
- Switching identity now clears stale printing, variant, asking price, offer ladder, decision, and evaluation context automatically.
- Rejected workflow transitions now leave workflow-owned UI context unchanged.
- Missing or invalid market data now produces "Unable to evaluate purchase" instead of a misleading recommendation.
- Invalid Offer Ladder output now blocks Decision Resolver execution.
- Vendor Workflow orchestration is now driven by workflow commands instead of UI-dispatched state steps.
- Successful Vendor Workspace identity selection now deterministically reaches `ReadyForEvaluation` or `Error`.
- Multi-printing Vendor Workspace searches now load printing choices immediately instead of stalling at an identity candidate.
- Multi-finish printings no longer auto-select foil when the query does not specify a finish.
- `foil` constraints no longer match `Nonfoil` variants.
- Special foil treatments such as Halo, Surge, Galaxy, and Confetti are normalized as distinct finish variants.
- Missing card images now render a clean fallback instead of disappearing from the workflow.
- Apostrophe and punctuation-heavy card names now receive a normalization boost during identity scoring.
- `urza's saga textless`, `urzas saga textless`, and `urza saga textless` now resolve to Urza's Saga and load printing candidates.
- Textless variants such as `text less` and `no text` are recognized as treatment constraints.
- Clear low-confidence identity candidates can now load printing candidates instead of leaving Vendor Workspace stuck at an identity row.

### Documented
- Sprint 22 Intelligence Console v2, Intelligence Tile, grade mapping, confidence separation, and progressive disclosure.
- Sprint 22 Playability Intelligence Platform, provider abstraction, format indicators, strategy integration, provider roadmap, dependency graph, backlog, and technical debt.
- Sprint 21 Intelligence History Platform, immutable history, evaluation snapshot lifecycle, repository abstraction, and future Simulation Platform.
- Sprint 20.6 regression recovery, Market Provider precedence, condition pricing lifecycle, Asset Context integration, and future Condition Intelligence hooks.
- Sprint 20.5 Asset Context, context generation, context integrity, Atlas Inspector, Developer Mode, stale-reference invariants, and context-validation backlog.
- Sprint 20.4 Workflow Command Architecture, command processor ownership, context invalidation dependency graph, workflow ownership invariants, and command-oriented backlog.
- Sprint 20.3 Workflow Ownership, workflow authority, context invalidation, workflow invariants, and state ownership backlog.
- Sprint 20.2 Evaluation Integrity, Offer Ladder Validation, business invariants, Evaluation Trace, calculation trace, and replay-ready backlog.
- Sprint 20.1 Vendor Workflow State Machine, Single Printing Rule, diagnostics, workflow invariant, and stabilization backlog.
- Sprint 20 Asset Intelligence Framework, Intelligence Model contract, Indicator contract, model health, versioning, dependency graph, and future intelligence models.
- Sprint 18 Card Intelligence philosophy, Signal Registry, Market Context, Negotiation Ladder, canonical pipeline, and decision invariants.
- Sprint 17 VX optimization, keyboard workflow, chip filters, automatic evaluation, and dense printing patterns.
- Sprint 16 Atlas synchronization, decision-first pattern, backlog, and technical debt.
- Variant Resolution Policy and complete Vendor Workspace buying workflow.
- Scryfall prices as daily market estimates rather than live listing or recent sale data.
- Product vision as a Professional TCG Decision Operating System.
- Current architecture and provider boundaries.
- Permanent documentation update rule for future sprints.

---

## [0.1.0] - 2026-07-07

### Added
- Initial project structure
- Development environment
- React + Next.js application
- First working dashboard UI
- AI-assisted development workflow with Codex
