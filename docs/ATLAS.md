# Project Atlas

Atlas is the permanent project knowledge base for PriceTrackingLLC.

## Sprint 25 Synchronization

Playability Intelligence maturity:

- Previous: Level 1 Framework.
- Current: Level 2 Meaningful Intelligence.

Playability now measures:

- Why the card is played.
- Where demand comes from.
- Whether demand is Commander, competitive, casual, broad, stable, or meta-dependent.

Future providers:

- EDHREC
- MTGGoldfish
- Melee
- MTGO
- Tournament APIs

Architecture rule:

Playability measures demand. Collector measures collectability. Certification measures certification characteristics. Strategies interpret intelligence. Negotiation consumes strategies.

## Sprint 24.2 Synchronization

Final Intelligence Console UI Contract:

- Grade
- Model-specific Confidence
- Business Conclusion
- Key Signals
- Supporting Evidence

Rules:

- Summary and What This Means are removed from production panels.
- Confidence below High must include a plain-language reason.
- Key Signals are limited to four items.
- Supporting Evidence contains factual support only.
- Expanded tile state persists for the current browser session.
- Atlas remains the exclusive owner of implementation details.

## Sprint 24.1 Synchronization

Layered Information Architecture:

- Layer 1: Decision
- Layer 2: Explanation
- Layer 3: Evidence
- Layer 4: Implementation

Vendor Workspace owns Layers 1-3.

Atlas Inspector owns Layer 4:

- Provider Health
- Provider Status
- Version
- Implementation Details
- Future Dependencies
- Internal Signals
- Debug Information

Nothing is lost. Implementation details are relocated out of production UI.

## Sprint 24 Synchronization

Certification Intelligence is registered as a first-class Asset Intelligence model.

Dependency rule:

Certification Intelligence → Collector Intelligence → Strategy → Negotiation Ladder → Decision Resolver.

Provider abstraction:

- `CertificationProvider`
- `CertificationRegistry`
- Placeholder provider for PSA, BGS, and CGC.
- Future providers: TAG, SGC, ARS.

Backlog:

- Official provider-backed population data.
- Cross-grading indicators.
- Population growth indicators.
- Provider health diagnostics.

Technical debt:

- Certification population, gem population, and gem rate are placeholders until official provider data exists.
- Estimated certification premium is metadata-based and must remain labeled as placeholder.

## Continuity Rule

Every future sprint must update:

- Documentation
- Sprint history
- Roadmap
- Decision log
- Architecture documentation
- Agent handoff
- Backlog changes
- New architectural patterns
- Technical debt

No sprint is complete until Atlas has been synchronized.

## Knowledge Base

- PriceTrackingLLC is a Decision Operating System for professional TCG buying.
- Vendor Workspace should minimize time from search to decision to next card.
- Vendor Workspace VX should feel closer to a command palette than a traditional form.
- Identity Providers answer what a card is.
- Market Providers answer what a selected printing and finish is worth.
- Card Intelligence produces reusable signals, not recommendations.
- Asset Intelligence models wrap reusable indicators behind a shared framework contract.
- Intelligence Console is the shared presentation layer for all Asset Intelligence models.
- Intelligence Tiles use grade mapping for quick scanning while confidence remains separate.
- Business Profiles make recommendations business-aware.
- Business Profiles supply costs, targets, and assumptions without querying providers.
- Business Profiles own Offer Policy for Offer Ladder consumption.
- System Readiness validates prerequisites before business engines execute.
- Readiness Reports distinguish configuration, data, business rule, calculation, and internal failures.
- Pipeline Inspector identifies the first invalid or unavailable evaluation stage.
- Zero-valued Offer Ladder outputs are invalid unless explicitly intended.
- Playability Intelligence measures play demand and never chooses BUY / PASS.
- Playability providers plug into a registry before strategies consume normalized outputs.
- Workflow Command Processor controls workflow progression and diagnostics.
- Context Invalidation Engine clears downstream dependencies from commands.
- Asset Context owns the current evaluation identity, printing, variant, condition, market, card profile, offer ladder, decision, and generation.
- Atlas Inspector owns developer diagnostics.
- Market Provider data always has precedence over future inferred condition pricing.
- Completed evaluations become immutable Evaluation Snapshots.
- Strategies interpret signals.
- Negotiation Ladder converts strategy into negotiation guidance.
- Offer Ladder Validator checks negotiation math before decisions.
- Decision Resolver compares asking price against the Negotiation Ladder.
- Business engines own decisions; UI renders normalized data.

## Dependency Graph

Vendor Workspace

→ Workflow Command Processor

→ Context Invalidation Engine

→ Asset Context

→ Asset Context Validator

→ Query / Identity / Intent / Constraint Engines

→ Variant Resolution Policy

→ Condition Resolution

→ Market Provider

→ Condition-Aware Market Snapshot

→ Business Profile

→ System Readiness

→ Market Context

→ Asset Intelligence Framework

→ Intelligence Console

→ Intelligence Tile

→ Playability Intelligence

→ Playability Provider Registry

→ Card Intelligence Engine

→ Strategy Signal Weights

→ Business-Aware Cost Model

→ Offer Policy

→ Pipeline Inspector

→ Negotiation Ladder Engine

→ Offer Ladder Validator

→ Purchase Evaluation Engine

→ Decision Resolver

→ Evaluation History Engine

## Playability Intelligence

Current source: Scryfall legalities.

Provider roadmap:

- EDHREC for Commander deck penetration.
- MTGGoldfish for format popularity and trend.
- Melee, MTGO, and Top8 for competitive metagame results.

Playability dependency rule:

Playability Intelligence → Strategy → Negotiation Ladder → Offer Ladder Validator → Decision Resolver.

Playability must not skip directly to negotiation or decision.

## Intelligence Console

The Intelligence Console replaces bespoke Card Profile intelligence cards.

Tile rule:

- Collapsed tiles show name, grade, confidence, and expand affordance only.
- Expanded tiles show full intelligence detail.
- One tile expands at a time by default.
- Every current and future Intelligence Model uses this same tile contract.

Grade mapping is presentation-only. Engines retain numeric scores and confidence remains separate from grade.

## Business Profiles

Business Profiles define what a card is worth to a specific business.

Current built-in examples:

- Prime Time Retail
- Convention Buying
- Cash Only
- Online Marketplace

Marketplace templates:

- TCGplayer
- eBay
- CardTrader
- Facebook Marketplace
- Discord
- Local Cash
- Convention Sales
- Direct Store

Dependency rule:

Market Estimate → Business Profile → Offer Policy → Strategy → Offer Ladder → Offer Ladder Validation → Decision Resolver.

Business Profile must not query providers, make BUY / PASS decisions, or bypass the Offer Ladder.

Offer Policy fields:

- minimum ROI
- minimum profit
- desired margin
- negotiation aggressiveness
- maximum capital exposure

## System Readiness

System Readiness validates every prerequisite before Strategy, Offer Ladder, or Decision Resolver execution.

Pipeline:

Asset Context → Business Profile → Market Snapshot → Card Intelligence → Strategy → Offer Ladder → Decision.

Readiness states:

- READY
- PARTIAL
- WAITING_FOR_CONFIGURATION
- WAITING_FOR_PROVIDER
- WAITING_FOR_MARKET_DATA
- INVALID
- ERROR

Readiness failure classes:

- Configuration Problem
- Missing Data
- Business Rule Failure
- Calculation Failure
- Internal Error

Production UI should show user-safe blockers such as "Configure Target ROI" or "Market estimate unavailable." Atlas Inspector owns detailed dependency diagnostics.

## Pipeline Integrity

Pipeline Inspector executes the complete purchase evaluation path and records the first invalid stage.

Pipeline:

Asset → Market → Business → Cost Profile → Offer Policy → Strategy → Offer Ladder → Decision.

Each stage captures received inputs, calculated outputs, validation status, fallbacks used, missing fields, execution time, and reason. The first non-READY stage terminates the pipeline.

Business invariant:

If Market Estimate, Costs, Profit, Strategy, and Offer Policy are valid, then Opening Offer, Target Offer, Maximum Buy Price, and Recommended Offer must be positive. A zero-valued ladder is a blocked evaluation, not a PASS decision.

Atlas Inspector may show Pipeline Trace in developer mode. Production users must not see pipeline, trace, undefined, fallback, or zero-default terminology.

→ Immutable Evaluation Snapshot

→ Decision Drivers

→ Debounced Vendor Workspace Presentation

→ Presentation Components

## Architectural Patterns

### Decision-First Workspace

Keep the recommendation visible while the user explores candidate printings.

### Sticky Decision Panel

Desktop Vendor Workspace uses a sticky right-side panel. The printing list remains scrollable and non-sticky.

### Decision Drivers

Business-facing recommendation reasons are generated by `lib/engines/decision/DecisionDrivers.ts`. They explain why the decision was made without repeating visible metrics.

### Dense Printing Rows

Printing rows should show enough information to select confidently without opening a detail view: thumbnail, set, collector number, language, finish, printing style, release year, and match score.

### Chip-First Refinement

Common buyer refinements should be buttons before free-text fields. This keeps fast workflows discoverable and reduces typing during in-person buying.

### Automatic Debounced Evaluation

Vendor Workspace should update decisions automatically after a short input debounce. UI may debounce user input, but pricing, profit, ROI, confidence, and recommendation logic remain engine-owned.

### Keyboard-Safe Shortcuts

ESC can reset the workflow globally. Arrow and Enter shortcuts should only act when the user is not typing into an input, textarea, or select.

### Workflow Command Architecture

Vendor Workspace progression is deterministic and tracked through `types/VendorWorkflowState.ts` and `lib/workflow/commands/WorkflowCommandProcessor.ts`.

Commands describe intent:

- `SearchCards`
- `LoadSearchResults`
- `HighlightCard`
- `SelectCard`
- `SelectPrinting`
- `SelectVariant`
- `SelectCondition`
- `ChangeStrategy`
- `EnterAskingPrice`
- `Evaluate`
- `ResetWorkspace`
- `ReportWorkflowError`

Workflow states:

- `Idle`
- `Searching`
- `CandidatesFound`
- `IdentityHighlighted`
- `IdentitySelected`
- `PrintingsLoaded`
- `PrintingSelected`
- `VariantResolved`
- `ConditionResolved`
- `ReadyForEvaluation`
- `Evaluating`
- `EvaluationComplete`
- `Error`

Workflow invariant:

Every successful identity selection must reach either `ReadyForEvaluation` or `Error`.

Identity rows must preserve three distinct meanings:

- Suggested: a search candidate.
- Highlighted: current keyboard or navigation target.
- Selected: committed identity for printing and evaluation.

Single Printing Rule:

If a selected identity has exactly one printing, Vendor Workspace should auto-select that printing, resolve the finish variant and condition, load market intelligence, and prepare evaluation. If the printing, market estimate, or supported finish cannot be resolved, the workflow should enter `Error`.

### Workflow Ownership

Workflow owns:

- Highlighted Identity
- Selected Identity
- Selected Printing
- Selected Variant
- Selected Condition
- Market Context
- Selected Strategy
- Asking Price

UI components may dispatch workflow commands. They must render workflow context and must not own selected workflow state.

### Asset Context Integrity

Asset Context is the generated reference chain for one purchase evaluation:

Identity

→ Printing

→ Variant

→ Condition

→ Market Context

→ Market Snapshot

→ Card Profile

→ Offer Ladder

→ Decision

Workflow Command Processor owns Asset Context and increments `generation` whenever upstream context changes. Objects from older generations are stale automatically.

`lib/workflow/AssetContextValidator.ts` classifies context as:

- `Valid`
- `Invalid`
- `Incomplete`

Business invariants:

- Selected identity must own the selected printing.
- Selected printing must own the selected variant.
- Market snapshot must match selected printing and variant.
- Card Profile, Offer Ladder, and Decision ids must reference the same generation.
- Stale market snapshots are rejected before they can drive evaluation.

### Condition Pricing Lifecycle

Condition changes are Asset Context changes.

Flow:

ChangeCondition command

→ New Asset Context generation

→ Downstream invalidation

→ Market Provider request

→ Market Snapshot attached to matching generation

→ Existing condition-aware market snapshot pipeline

→ Card Intelligence

→ Offer Ladder

→ Decision Resolver

Provider precedence rule:

If a Market Provider can supply real pricing data, that data must be used. Future Condition Intelligence may only fill gaps when provider data is unavailable, and it must never override provider data.

TODO:

- Add provider-native condition price support when marketplaces expose it.
- Add Condition Intelligence fallback only for missing provider data.
- Add provider-vs-inference trace snapshots to Atlas Inspector.

### Atlas Inspector

Developer diagnostics live in Atlas Inspector, not production Vendor Workspace.

Activation:

- Cmd+Shift+D on macOS
- Ctrl+Shift+D elsewhere

Panels:

- Workflow
- Asset Context
- Query Parser
- Canonical Resolution
- Intent Resolution
- Printing Resolution
- Card Intelligence
- Offer Ladder
- Decision Trace
- Performance
- Provider Trace

### Intelligence History Platform

Every completed `READY` evaluation is historical intelligence.

Snapshot lifecycle:

Completed Evaluation

→ Snapshot Factory

→ Snapshot Validator

→ History Repository

→ Immutable Evaluation Snapshot

Snapshots capture:

- timestamp
- Asset Context generation
- identity
- printing
- variant
- condition
- Market Context
- Buying Strategy
- Market Estimate
- Offer Ladder
- Decision
- confidence
- Card Intelligence indicators

Rules:

- Snapshots are immutable.
- History is append-only.
- Incomplete snapshots are rejected.
- Business engines never mutate history.
- Vendor Workspace reads current state only.

Future systems consume this history:

- Backtesting
- Strategy Replay
- Market Replay
- Signal Validation
- Simulation Platform
- Personal Buying History
- Portfolio Tracking

### Context Invalidation

`lib/workflow/commands/ContextInvalidationEngine.ts` clears downstream dependencies automatically.

Invalidation rules:

- Changing Identity invalidates Printing, Variant, Condition, Market Estimate, Card Intelligence, Offer Ladder, Decision, and Evaluation.
- Changing Printing invalidates Variant, Condition, Market Estimate, Card Intelligence, Offer Ladder, Decision, and Evaluation.
- Changing Variant invalidates Market Estimate, Card Intelligence, Offer Ladder, Decision, and Evaluation.
- Changing Condition invalidates Market Estimate, Card Intelligence, Offer Ladder, Decision, and Evaluation.
- Changing Market Context invalidates Market Estimate, Card Intelligence, Offer Ladder, Decision, and Evaluation.
- Changing Strategy invalidates Offer Ladder, Decision, and Evaluation.
- Changing Asking Price invalidates Decision and Evaluation.

Rejected workflow commands must leave workflow context unchanged.

### Card Intelligence Signals

Signals are measurements. They must not contain BUY, NEGOTIATE, PASS, offer, or walk-away decisions.

Current Signal Registry:

- Investment Potential
- Flip Potential
- Grading Potential
- Collector Appeal
- Liquidity
- Volatility
- Scarcity
- Demand
- Playability
- Reprint Risk
- Market Confidence
- Historical Stability

Signal statuses:

- `estimated`: deterministic estimate from current normalized data.
- `placeholder`: reserved for future provider depth.
- `future`: reserved for unavailable analytics.
- `live`: future provider-backed signal.

### Market Context

Market Context records country, region, currency, marketplace, language, tax model, and shipping model. The current default is United States, USD, English, Scryfall Market Provider.

Future Market Context Engine responsibilities:

- Regional valuation
- Currency normalization
- Marketplace selection
- Shipping assumptions
- Tax models
- Import costs
- Regional liquidity
- Regional demand
- Format popularity
- Marketplace-specific multipliers

### Negotiation Ladder

Negotiation Ladder is the single source of truth for negotiation.

It returns:

- Opening Offer
- Target Offer
- Maximum Buy Price
- Walk Away Price

The Decision Resolver must never contradict the Negotiation Ladder.

### Decision Invariants

- Asking price less than or equal to Target Offer must produce BUY.
- Asking price greater than Target Offer and less than or equal to Maximum Buy Price must produce NEGOTIATE.
- Asking price greater than Maximum Buy Price must produce PASS.
- Opening Offer must be less than or equal to Target Offer.
- Target Offer must be less than or equal to Maximum Buy Price.
- Recommended Offer must be less than or equal to Maximum Buy Price.
- Decision Resolver may execute only when Maximum Buy Price exists and the Offer Ladder is valid.
- Missing calculations must be represented as unavailable or invalid, never as fallback zero.
- Condition can change the market estimate, ladder, and decision.
- Card Intelligence cannot make a recommendation by itself.

### Evaluation Integrity

Evaluation pipeline:

Card → Printing → Variant → Condition → Market Context → Asset Intelligence → Strategy → Offer Ladder → Offer Ladder Validation → Decision Resolver → Vendor Workspace.

`lib/engines/negotiation/OfferLadderValidator.ts` validates the Offer Ladder before any decision can be resolved. It checks missing values, impossible values, negative values, ordering, recommended offer bounds, and negotiation margin warnings.

Evaluation Trace records:

- Market Estimate
- Profit Before Costs
- Costs
- Profit After Costs
- Card Intelligence Signals
- Strategy Inputs
- Offer Ladder
- Decision Zone
- Decision
- Validation Status

Production UI must show user-safe unavailable messages. Development UI may expose trace details.

### Signal Versioning

Every Card Intelligence signal includes version, confidence, contributing factors, supporting data sources, and generation timestamp. Future signal improvements should add versions instead of breaking the `Signal` contract.

### Asset Intelligence Framework

Every future intelligence platform must register an Intelligence Model under `lib/intelligence/framework/`.

Model contract:

- id
- name
- version
- status
- confidence
- lastUpdated
- inputs
- outputs
- indicators
- supporting sources
- health
- explanation
- dependency graph

Indicator contract:

- id
- name
- score
- confidence
- version
- status
- data sources
- contributing factors
- last updated
- explanation
- future dependencies

Indicator statuses:

- LIVE
- ESTIMATED
- PLACEHOLDER
- WAITING_FOR_PROVIDER
- DISABLED
- UNKNOWN

Model health:

- Healthy
- Partial
- Missing Data
- Unavailable
- Deprecated
- Experimental

Current and future registered models:

- Market Intelligence
- Collector Intelligence
- Investment Intelligence
- Liquidity Intelligence
- Reprint Risk
- Market Confidence
- Playability Intelligence
- Grading Intelligence
- Regional Intelligence
- Behavior Intelligence
- Historical Intelligence
- Volatility Intelligence
- Demand Intelligence
- Scarcity Intelligence

Dependency graph metadata is included on each model so future Atlas visualizations can show provider and model dependencies.

## Backlog

1. Add live marketplace listings and recent sales.
2. Add EDHREC provider for Commander deck penetration.
3. Add MTGGoldfish provider for format popularity and trend.
4. Add Melee, MTGO, and Top8 providers for competitive metagame results.
5. Add Deck Penetration implementation with percentage, sample size, confidence, and status.
6. Add Meta Stability and Trend provider implementations.
7. Add Intelligence Console keyboard and visual regression coverage.
8. Persist Business Profiles.
9. Add Business Profile import and export.
10. Validate Offer Policy before Business Profiles are saved.
11. Persist Readiness Reports with Evaluation Snapshots.
12. Persist Pipeline Reports for failed evaluations.
13. Add readiness browser diagnostics for historical failed evaluations.
14. Add Pipeline Trace replay UI.
15. Add a Printing Descriptor Engine for provider-neutral printing labels.
16. Add development-only Vendor Workflow transition inspector.
17. Add Evaluation Trace replay UI.
18. Add workflow context inspector.
19. Add historical backtesting.
20. Add simulation engine.
21. Add strategy replay and Market Context replay.
22. Add Asset Intelligence model diagnostics UI.
23. Add Liquidity Engine as an Asset Intelligence model.
24. Add Historical Analytics Engine as an Asset Intelligence model.
25. Add Market Context Engine.
26. Add camera, OCR, and barcode entry.
27. Add ARIA active-descendant support for richer keyboard highlighting.
28. Add persisted buyer preferences for finish defaults.
29. Add saved Vendor Workspace chip presets.
30. Add visual regression coverage for 13-inch and 14-inch laptop viewports.

## Technical Debt

- Playwright is available as a package, but the browser binary is not installed in this environment.
- Purchase evaluation still uses fixed marketplace fees and shipping constants.
- Printing style labels still use normalized provider fields until the Printing Descriptor Engine exists.
- Scryfall market data remains daily estimates, not live inventory.
- Printing navigation currently uses button selection and global shortcuts; richer roving focus can be added later.
- Chip filters are local UI state and are not yet persisted between sessions.
- Card Intelligence signals are deterministic estimates until live provider and historical data exist.
- Condition multipliers are fixed seed values and should become strategy or marketplace configurable.
- Market Context is a static default until the Market Context Engine exists.
- Negotiation Ladder uses fixed fee and shipping assumptions inherited from the current Profit Engine setup.
- Asset Intelligence model outputs are deterministic wrappers around existing signals until live providers exist.
- Playability currently uses Scryfall legalities only; deck penetration, trend, and meta stability need future providers.
- Canadian Highlander playability is registered but waits for a provider.
- Intelligence Console has build-level coverage and grade mapping tests, but no browser interaction regression test yet.
- Business Profile Settings are in-memory only until persistence is added.
- Business Profile settings validate numeric inputs locally but do not yet enforce full Offer Policy save-time invariants.
- Readiness Reports are runtime evaluation objects and are not yet persisted into history snapshots.
- Pipeline Reports are runtime evaluation objects and are not yet persisted into history snapshots.
- Model health is currently derived from registration status and indicator status.
- Vendor Workflow diagnostics are rendered in the workspace for development visibility and should later move behind a development-only inspector.
- Keyboard highlighting uses component state today; richer ARIA active-descendant focus management remains future work.
- Evaluation Trace is in-memory only until replay and persistence infrastructure exists.
- Offer Ladder Validator uses deterministic local rules; future marketplace-specific constraints may extend validation.
- Workflow context currently stores ids and primitive UI workflow values; future shared workspaces may add typed context adapters.
