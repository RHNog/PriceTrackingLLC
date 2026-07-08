# Architecture

## Application Structure

PriceTrackingLLC is a Next.js application using TypeScript and Tailwind CSS.

Top-level structure:

- `app/`: Next.js routes and API routes.
- `components/`: shared UI and reusable product components.
- `features/`: workflow-specific UI modules.
- `types/`: domain contracts shared across engines and UI.
- `data/`: mocked domain data.
- `knowledge/`: dictionary-driven TCG knowledge.
- `config/`: configurable engine thresholds and weights.
- `lib/engines/`: provider-independent business and interpretation engines.
- `lib/providers/`: external or mocked data provider implementations.
- `lib/intelligence/certification/`: provider-ready Certification Intelligence model.

## App Shell

`components/ui/AppShell.tsx` owns the application frame:

- Sidebar navigation
- Topbar
- Main content area

Feature routes compose their UI inside `AppShell`.

## Feature Modules

Feature-specific presentation lives in `features/`.

Examples:

- `features/vendor/`: Vendor Workspace and purchase evaluation UI.
- `features/developer/identity/`: development-only Identity Explorer and diagnostics.
- `features/opportunities/`: Opportunity Details.
- `features/evaluation/`: Purchase Evaluation form and result components.

Generic UI should remain in `components/ui`.

## Intelligence Console Information Architecture

Every Intelligence model uses the same presentation contract:

Layer 1: Grade and model-specific confidence

Layer 2: Business Conclusion

Layer 3: Key Signals

Layer 4: Supporting Evidence

Implementation remains Atlas-only.

Expanded Vendor Workspace panels answer exactly four questions:

1. What do you think?
2. How certain are you?
3. Why?
4. What evidence supports it?

Vendor Workspace owns:

- Grade
- Model-specific confidence label
- Confidence reason when confidence is below High
- Business conclusion
- Key Signals
- Supporting Evidence

Atlas Inspector owns Layer 4:

- Version
- Health
- Status
- Framework and engine details
- Internal sources
- Future dependencies
- Internal signals
- Provider health
- Provider status
- Provider matrix
- Debug information

Production UI must not expose implementation language such as Placeholder, Experimental, Framework Version, Engine Version, Provider Matrix, Internal Sources, or Future Dependencies.

## Current Query Pipeline

User Query

↓

Query Engine

↓

Knowledge Platform

↓

Canonical Resolution

↓

Intent Resolution

↓

Identity Resolution

↓

Constraint Satisfaction

↓

Printing Resolution

↓

Variant Resolution

↓

Condition Resolution

↓

Market Context

↓

Asset Intelligence Framework

↓

Certification Intelligence

↓

Card Intelligence Models

↓

Strategy

↓

Negotiation Ladder

↓

Decision Resolver

↓

Vendor Workspace

## Provider Architecture

Identity Providers answer:

What is this card?

Market Providers answer:

What is this card worth?

Certification Providers answer:

What are the collectible certification characteristics of this asset?

These provider families must stay separate.

Current state:

- Scryfall is the first Identity Provider.
- Scryfall is the first Market Provider.
- Scryfall market data is daily affiliate market estimate data, not live listing inventory.
- Lowest listing and recent sale data are not live yet.
- UI components must never know Scryfall response shapes.
- Provider data must be adapted into domain objects before it reaches engines or UI.

Certification provider rules:

- Certification Intelligence measures characteristics only.
- Certification Intelligence never decides BUY, NEGOTIATE, or PASS.
- Current Certification implementation uses a placeholder provider only.
- PSA, BGS, and CGC are represented as current placeholder-backed providers.
- TAG, SGC, and ARS are registered as future providers.
- No scraping or unofficial APIs are allowed.
- Future providers must register through `CertificationRegistry`.

## Certification Intelligence

Certification Intelligence is a first-class Asset Intelligence model.

Certification flow:

Printing + Variant

↓

Certification Engine

↓

Certification Provider Registry

↓

Certification Profile

↓

Asset Intelligence Framework

↓

Collector Intelligence

↓

Strategy

↓

Negotiation Ladder

↓

Decision Resolver

Certification Profile exposes overall certification grade plus provider-level grade, confidence, population, gem population, gem rate, estimated premium, trend, status, source, and last updated.

Certification indicators:

- Certification Grade
- Population Scarcity
- Gem Rate
- Certification Premium
- Population Trend
- Collector Competition
- Submission Saturation

Future indicators:

- Cross-grading
- Population Growth

## Market Price Architecture

Market Providers answer what a selected printing and finish variant is worth.

Scryfall Market Provider v1 maps Scryfall Card price fields into normalized `MarketSnapshot` data:

- `prices.usd` → Nonfoil USD market estimate
- `prices.usd_foil` → Foil USD market estimate
- `prices.usd_etched` → Etched USD market estimate
- `prices.eur` → Nonfoil EUR market estimate
- `prices.eur_foil` → Foil EUR market estimate
- `prices.eur_etched` → Etched EUR market estimate
- `prices.tix` → MTGO TIX market estimate

Null prices are ignored. The application must not invent prices, live listings, recent sales, or buylist values.

Vendor Workspace receives normalized `MarketSnapshot` data from the internal market API and passes `MarketPrice` into the Evaluation Engine.

## Condition Pricing Lifecycle

Condition-aware pricing must preserve provider precedence.

Current flow:

Condition selector

↓

`ChangeCondition` command

↓

New Asset Context generation

↓

Market snapshot request for the current printing and variant

↓

Generation-aware `LoadMarketSnapshot`

↓

Existing `createConditionMarketSnapshot`

↓

Card Intelligence

↓

Offer Ladder

↓

Decision Resolver

The existing condition-aware market snapshot pipeline must be reused. Do not replace it with new placeholder multipliers or inferred pricing.

Market Provider precedence:

- If provider market data exists, use provider market data.
- Future Condition Intelligence may estimate missing values only when provider data is unavailable.
- Future inferred condition pricing must be traceable and must never override provider data.

## Image Architecture

Card images are presentation data attached to normalized `Card` domain objects.

The Scryfall adapter maps provider image data into:

- `imageUrl`
- `imageUrls`
- `cardFaces`
- `imageSource`
- `imageFace`
- `hasCardFaces`

UI components render images from domain objects only. They must not fetch Scryfall image data directly.

## Printing Variant Architecture

A card identity is not a purchasable object, and a printing is not always the final purchasable object.

The selection model is:

Card Identity

↓

Printing

↓

Printing Finish Variant

Scryfall can return one printing with multiple available finishes, such as Nonfoil and Foil. The adapter preserves those finishes as `PrintingVariant` objects on the normalized `Card`.

Constraint Satisfaction may auto-commit a printing while leaving the finish variant unresolved. Vendor Workspace must block purchase evaluation until a finish variant is selected unless the query or source data makes the finish unambiguous.

Special foil treatments such as Halo, Surge, Galaxy, and Confetti are modeled as distinct finish variants instead of plain Foil.

## Variant Resolution Policy

`lib/engines/variantResolution/VariantResolutionPolicy.ts` chooses a default purchasable finish after printing resolution.

Policy order:

1. Explicit user finish requests always win.
2. Single-finish printings auto-select that finish.
3. Multi-finish printings with Nonfoil auto-select Nonfoil.
4. If Nonfoil is unavailable, the least-special available finish is selected.

The policy is isolated so future games can define different finish priorities without moving rules into Vendor Workspace.

## Purchase Evaluation Engine

The Evaluation Engine consumes:

- selected printing
- selected finish variant
- selected condition
- normalized market estimate
- market context
- buying strategy
- user asking price

It now creates a `CardProfile`, applies condition-adjusted market context, calculates strategy-weighted Card Intelligence, builds a Negotiation Ladder, and asks the Decision Resolver to compare the seller's asking price against the ladder.

## Card Intelligence Platform

Card Intelligence never decides BUY, NEGOTIATE, or PASS. It produces reusable signals.

Current signal registry:

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

Signals include score, confidence, version, contributing factors, supporting data sources, generated timestamp, source, explanation, and status. Status can be `live`, `estimated`, `placeholder`, or `future`.

Every `CardProfile` contains identity, printing, variant, condition, market context, condition market snapshot, signals, framework intelligence models, overall confidence, and generation timestamp.

## Asset Intelligence Framework

The Asset Intelligence Framework is the common contract for all future intelligence work.

Location:

- `lib/intelligence/framework/`

Intelligence Models do not make decisions. They measure one dimension of an asset. Strategies consume Intelligence Models, the Negotiation Ladder consumes strategies, and the Decision Resolver consumes the Negotiation Ladder.

Every Intelligence Model exposes:

- id
- name
- version
- status
- confidence
- lastUpdated
- inputs
- outputs
- indicator list
- supporting sources
- health
- explanation
- dependency graph

Model health values:

- Healthy
- Partial
- Missing Data
- Unavailable
- Deprecated
- Experimental

Every Indicator exposes:

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

Registered current models:

- Market Intelligence
- Collector Intelligence
- Investment Intelligence
- Liquidity Intelligence
- Reprint Risk
- Market Confidence

Registered future models:

- Playability Intelligence
- Grading Intelligence
- Regional Intelligence
- Behavior Intelligence
- Historical Intelligence
- Volatility Intelligence
- Demand Intelligence
- Scarcity Intelligence

Future intelligence must become a model registered in this framework instead of an isolated scoring engine.

## Condition Resolution

Condition belongs after variant resolution and before market context.

Supported conditions:

- NM: Near Mint
- LP: Lightly Played
- MP: Moderately Played
- HP: Heavily Played
- DMG: Damaged

Condition influences market estimate, Negotiation Ladder, purchase evaluation, and Card Intelligence. It must not influence identity resolution.

## Market Context

`MarketContext` records country, region, currency, marketplace, language, tax model, and shipping model.

Current default:

- United States
- North America
- USD
- English
- Scryfall Market Provider

Future Market Context Engine responsibilities include regional valuation, currency normalization, marketplace selection, shipping assumptions, tax models, import costs, regional liquidity, regional demand, format popularity, and marketplace-specific multipliers.

## Negotiation Ladder

The Negotiation Ladder is the single negotiation source of truth.

It produces:

- Opening Offer
- Target Offer
- Maximum Buy Price
- Walk Away Price

Purchase Evaluation consumes the Negotiation Ladder. The Decision Resolver performs no independent business calculations.

Decision invariants:

- If current asking price is less than or equal to Target Offer, the decision must be BUY.
- If current asking price is greater than Target Offer and less than or equal to Maximum Buy Price, the decision must be NEGOTIATE.
- If current asking price is greater than Maximum Buy Price, the decision must be PASS.

This prevents contradictions because the Decision Resolver only compares the seller's asking price against the Negotiation Ladder.

## Evaluation Integrity

Sprint 20.2 formalizes the purchase evaluation pipeline:

Card → Printing → Variant → Condition → Market Context → Asset Intelligence → Strategy → Offer Ladder → Offer Ladder Validation → Decision Resolver → Vendor Workspace.

The Offer Ladder Validator lives at `lib/engines/negotiation/OfferLadderValidator.ts`.

It validates:

- Opening Offer
- Target Offer
- Maximum Buy Price
- Recommended Offer
- Negotiation Margin

Business invariants:

- Opening Offer <= Target Offer
- Target Offer <= Maximum Buy Price
- Recommended Offer <= Maximum Buy Price
- Decision Resolver may execute only after validation succeeds
- Missing calculations are unavailable, invalid, or waiting for data, never fallback zero

Evaluation Trace is produced by `evaluatePurchase` and includes Profit Trace, Offer Ladder Trace, Strategy Trace, Decision Trace, and validation status. Production UI should show a concise unavailable reason. Development UI may render trace diagnostics.

## Stable Systems

The following systems are stable extension points. Future work should enrich them instead of redesigning their boundaries:

- Knowledge Platform
- Query Engine
- Canonical Resolution
- Intent Resolution
- Constraint Satisfaction
- Variant Resolution
- Card Intelligence Platform
- Asset Intelligence Framework
- Negotiation Ladder
- Decision Resolver

## Decision-First Vendor Workspace

Vendor Workspace is optimized around one question: should the buyer purchase this card right now?

Desktop layout:

- Search and interpretation remain at the top.
- Printing candidates stay in the left column.
- The decision panel stays sticky in the right column.
- The printing list is not sticky.

Decision Drivers are generated by the business engine layer, not by UI components. They explain why BUY, NEGOTIATE, or PASS was returned without repeating metrics already visible in the panel.

## Vendor Workspace VX Pattern

Sprint 17 keeps the same architecture while making the buying workflow faster and denser.

Interaction model:

- Search remains the first focus target.
- Printing refinement starts with buyer vocabulary chips before optional text refinement.
- Printing rows show thumbnail, set, collector number, language, finish, printing style, release year, and match score in a compact row.
- Finish selection is a small segmented control that shows only available purchasable variants.
- Purchase evaluation updates automatically after a short debounce when asking price, printing, or finish changes.
- ESC resets the workflow and returns focus to search.
- Arrow keys navigate printing candidates when the user is not typing into an input.
- Enter selects the highlighted printing when focus is outside text inputs.

The VX layer must not calculate pricing, recommendation, margin, ROI, confidence, or decision drivers. It only orchestrates user input and renders engine output.

## Vendor Workflow Command Architecture

Sprint 20.4 uses command-driven workflow orchestration without changing the business engines.

Source files:

- `types/VendorWorkflowState.ts`
- `lib/workflow/commands/WorkflowCommand.ts`
- `lib/workflow/commands/WorkflowCommandProcessor.ts`
- `lib/workflow/commands/WorkflowCommandResult.ts`
- `lib/workflow/commands/CommandRegistry.ts`
- `lib/workflow/commands/ContextInvalidationEngine.ts`

The workflow tracks:

- current state
- previous state
- last command
- command log
- rejected command log
- identity count
- printing count
- auto-selection reason
- Single Printing Rule activation
- error message
- execution timing

Valid workflow progression keeps identity discovery separate from identity commitment:

1. Search produces identity candidates.
2. Keyboard or mouse navigation highlights an identity.
3. Selection commits an identity.
4. Printings load or the Single Printing Rule selects the only printing.
5. Variant and condition resolution prepare the purchase evaluation.
6. The workflow reaches `ReadyForEvaluation`, `EvaluationComplete`, or `Error`.

Invariant:

Every successful identity selection must reach `ReadyForEvaluation` or `Error`.

The Single Printing Rule applies when a selected identity has exactly one printing. In that case the Workflow Command Processor auto-selects the printing, resolves the purchasable finish variant, resolves condition, marks market and card intelligence as loaded, and prepares evaluation. If any required step cannot be resolved, the command processor records `Error` instead of leaving the UI half-selected.

Workflow transitions are driven only by workflow commands. UI components dispatch intent such as `SelectCard`, `SelectPrinting`, `SelectVariant`, `SelectCondition`, `ChangeStrategy`, `EnterAskingPrice`, or `ResetWorkspace`. The command processor decides the current state, required invalidations, loaded objects, and next state.

Sprint 20.3 makes the workflow snapshot the authority for selected workflow context. Vendor Workspace renders highlighted identity, selected identity, selected printing, selected variant, selected condition, selected strategy, and asking price from workflow context.

Context invalidation lives in `lib/workflow/commands/ContextInvalidationEngine.ts`. React components must not remember which downstream state to clear. They dispatch commands; the workflow command processor applies invalidation atomically.

Rejected commands preserve the previous context and append the command to workflow diagnostics. This prevents the UI from showing a selected printing or decision that does not belong to the current identity.

Dependency graph:

User Intent

↓

Workflow Command

↓

Workflow Command Processor

↓

Context Invalidation Engine

↓

Workflow Snapshot

↓

Vendor Workspace Presentation

## Asset Context Integrity

Asset Context makes one evaluation explicit. It is defined in `types/AssetContext.ts` and owned by `WorkflowCommandProcessor`.

An Asset Context includes:

- context id
- identity id
- printing id
- variant id
- condition
- market context id
- strategy id
- market snapshot id
- card profile id
- offer ladder id
- decision id
- generation
- updated timestamp

Generation increments when upstream context changes, such as card, printing, variant, condition, or strategy. Downstream objects from older generations become stale and must not be rendered as current data.

`lib/workflow/AssetContextValidator.ts` validates the visible asset chain:

Identity

↓

Printing

↓

Variant

↓

Market Snapshot

The validator returns:

- `Valid`
- `Invalid`
- `Incomplete`

Vendor Workspace uses the validator and generation-aware market snapshot ids to avoid rendering stale market data or stale evaluations.

Asset Context architecture graph:

Workflow Command

↓

Workflow Command Processor

↓

Asset Context Generation

↓

Context Invalidation

↓

Provider / Engine Output

↓

Asset Context Validator

↓

Vendor Workspace Presentation

## Atlas Inspector

Atlas Inspector is a development-only diagnostics surface in `features/vendor/components/AtlasInspector.tsx`.

Activation:

- Cmd+Shift+D
- Ctrl+Shift+D

Production Vendor Workspace must not display:

- workflow states
- command logs
- context ids
- execution timing
- provider traces
- developer messages

Atlas Inspector panels include Workflow, Asset Context, Query Parser, Canonical Resolution, Intent Resolution, Printing Resolution, Card Intelligence, Offer Ladder, Decision Trace, Performance, and Provider Trace.

Atlas Inspector Provider Trace should show requested condition, market snapshot source, generation, whether provider returned real data, and whether fallback data was used.

## Intelligence History Platform

The Intelligence History Platform records completed evaluations without changing business calculations.

Source files:

- `types/EvaluationSnapshot.ts`
- `types/AssetSnapshot.ts`
- `types/MarketSnapshotHistory.ts`
- `types/StrategySnapshot.ts`
- `types/OfferLadderSnapshot.ts`
- `lib/history/EvaluationHistoryEngine.ts`
- `lib/history/HistoryRepository.ts`
- `lib/history/SnapshotFactory.ts`
- `lib/history/SnapshotValidator.ts`

Lifecycle:

Ready Purchase Evaluation

↓

Snapshot Factory

↓

Snapshot Validator

↓

History Repository

↓

Immutable Evaluation Snapshot

Current persistence is local and append-only. The repository abstraction is intentionally small so future storage can move to database, cloud, analytics, or warehouse systems without changing evaluation engines.

Snapshot invariants:

- Asset Context must be complete.
- Market Snapshot must be present.
- Offer Ladder must be valid.
- Decision must be valid.
- Snapshots are never edited.
- New evaluations append new snapshots.

Future Simulation Platform:

The Simulation Platform should consume immutable snapshots for backtesting, strategy replay, market replay, signal validation, buying history analysis, and portfolio tracking. It should not mutate old snapshots or recalculate historical recommendations in place.

## Playability Intelligence Platform

Playability Intelligence measures play demand. It does not choose BUY, NEGOTIATE, PASS, opening offers, target offers, or maximum buy prices.

Source files:

- `lib/intelligence/playability/PlayabilityEngine.ts`
- `lib/intelligence/playability/PlayabilityProvider.ts`
- `lib/intelligence/playability/PlayabilityRegistry.ts`
- `lib/intelligence/playability/PlayabilityProfile.ts`
- `lib/intelligence/playability/PlayabilityIndicator.ts`
- `lib/intelligence/playability/PlayabilityTrend.ts`
- `lib/intelligence/playability/PlayabilitySource.ts`

Profile formats:

- Overall
- Commander
- Modern
- Legacy
- Vintage
- Pioneer
- Standard
- Pauper
- Explorer
- Canadian Highlander

Each format indicator exposes score, confidence, trend, availability, data source, legal / restricted / banned / unknown status, last updated timestamp, meta stability, deck penetration readiness, and explanation.

Provider graph:

Playability Intelligence

↓

Playability Engine

↓

Playability Provider Registry

↓

Scryfall Playability Provider

↓

Future providers: EDHREC, MTGGoldfish, Melee, MTGO, Top8

Runtime graph:

Scryfall Legalities

↓

Normalized Card

↓

Playability Profile

↓

Card Profile

↓

Asset Intelligence Framework Indicators

↓

Strategy Signal Weights

↓

Negotiation Ladder

↓

Decision Resolver

Architecture rule: provider data can improve Playability confidence and indicators, but Playability must remain an input to strategies only.

## Intelligence Console v2

The Intelligence Console is the permanent presentation layer for Asset Intelligence models.

Source files:

- `components/intelligence/IntelligenceConsole.tsx`
- `components/intelligence/IntelligenceTile.tsx`
- `components/intelligence/IntelligenceDetail.tsx`
- `components/intelligence/IntelligenceGrade.tsx`

Presentation contract:

- Every Intelligence Model renders through the same tile standard.
- Collapsed tiles show model name, grade, confidence, and expand affordance only.
- Expanded details show score, grade, confidence, version, status, summary, contributing factors, supporting data sources, trend, future dependencies, and explanation.
- Only one tile expands at a time by default.
- Business engines and providers remain presentation-independent.
- No Intelligence Model should implement its own custom UI.

Grade mapping:

- 95+ = A+
- 90-94 = A
- 85-89 = A-
- 80-84 = B+
- 75-79 = B
- 70-74 = B-
- 65-69 = C+
- 60-64 = C
- 55-59 = C-
- 50-54 = D
- Below 50 = F

Confidence is displayed separately because grade measures score quality and confidence measures data reliability.

Architecture graph:

Card Profile

↓

Asset Intelligence Models

↓

Intelligence Console

↓

Intelligence Tile

↓

Intelligence Detail

↓

Grade Mapping

## Business Profiles Platform

Business Profiles make recommendations business-aware. Market Intelligence answers what the card is worth in the market; Business Profile answers what the card is worth to a specific business.

Source files:

- `lib/business/BusinessProfileEngine.ts`
- `lib/business/BusinessProfileRegistry.ts`
- `lib/business/MarketplaceProfile.ts`
- `lib/business/CostProfile.ts`
- `lib/business/ShippingProfile.ts`
- `lib/business/TaxProfile.ts`
- `lib/business/PaymentProfile.ts`
- `lib/business/BusinessDefaults.ts`

Business Profile fields include id, name, currency, country, default marketplace, cost profile, shipping profile, payment profile, tax profile, minimum ROI, minimum profit, target margin, target ROI, negotiation aggressiveness, maximum capital exposure, risk tolerance, created timestamp, and updated timestamp.

Business Profiles own Offer Policy. `createOfferPolicy` extracts the evaluation-facing policy from a profile:

- minimum ROI
- minimum profit
- desired margin
- negotiation aggressiveness
- maximum capital exposure

Offer Ladder consumes Offer Policy. Decision Resolver stays deterministic and receives only a validated ladder.

Built-in marketplace templates:

- TCGplayer
- eBay
- CardTrader
- Facebook Marketplace
- Discord
- Local Cash
- Convention Sales
- Direct Store

Built-in starting profiles:

- Prime Time Retail
- Convention Buying
- Cash Only
- Online Marketplace

Business-aware evaluation graph:

Market Estimate

↓

Business Profile

↓

Strategy

↓

Offer Ladder

↓

Offer Ladder Validation

↓

Decision Resolver

Vendor Workspace owns the selected Business Profile in UI state and passes it to purchase evaluation. Switching Business Profiles regenerates profit, ROI, Offer Ladder, negotiation, and decision without changing the selected card, printing, variant, or condition.

Settings currently provides an in-memory profile management surface for create, duplicate, rename, delete, and set default. Persisted Business Profiles are future work.

## Pipeline Integrity

Sprint 23.2 adds a pipeline inspector for mathematically consistent evaluation.

Source files:

- `lib/pipeline/PipelineInspector.ts`
- `lib/pipeline/PipelineStage.ts`
- `lib/pipeline/PipelineReport.ts`
- `lib/pipeline/PipelineValidation.ts`

Evaluation pipeline:

Asset Context

↓

Market Snapshot

↓

Business Profile

↓

Cost Profile

↓

Offer Policy

↓

Strategy

↓

Offer Ladder

↓

Decision

Each stage records received inputs, calculated outputs, validation status, fallbacks used, missing fields, execution time, and an optional reason. The first stage that is not READY terminates the pipeline. Downstream engines must not silently substitute defaults after an invalid or unavailable upstream stage.

Offer Ladder Integrity requires Opening Offer, Target Offer, Maximum Buy Price, and Recommended Offer to be positive when the market estimate, costs, profit policy, and strategy are valid. Zero is not an implicit fallback. Missing values return unavailable or invalid pipeline status with an explicit reason.

The Sprint 23.2 failure appeared when `calculateMaximumBuyPrice` produced a negative feasible maximum after costs and an overly high Online Marketplace minimum profit, then rounded that impossible value into `0`. The Pipeline Inspector now identifies the Offer Ladder as the first invalid stage, and the Online Marketplace default policy now supports valid low-dollar buys.

Developer diagnostics live in Atlas Inspector only. Production users must not see pipeline, trace, undefined, fallback, or zero-default terminology.

## System Readiness Platform

System Readiness validates prerequisites before business engines execute.

Source files:

- `lib/validation/SystemReadinessEngine.ts`
- `lib/validation/ReadinessValidator.ts`
- `lib/validation/ReadinessReport.ts`
- `lib/validation/ReadinessStatus.ts`
- `lib/validation/ConfigurationValidator.ts`
- `lib/validation/EvaluationPrerequisites.ts`

Readiness states:

- READY
- PARTIAL
- WAITING_FOR_CONFIGURATION
- WAITING_FOR_PROVIDER
- WAITING_FOR_MARKET_DATA
- INVALID
- ERROR

Issue classes:

- Configuration Problem
- Missing Data
- Business Rule Failure
- Calculation Failure
- Internal Error

Readiness pipeline:

Asset Context

↓

Business Profile

↓

Market Snapshot

↓

Card Intelligence

↓

Strategy

↓

Offer Ladder

↓

Decision

Readiness Report fields:

- status
- blocking issues
- warnings
- ready components
- missing components

Validation layers:

- Configuration Validator checks Business Profile, Market Snapshot, and Strategy configuration.
- Readiness Validator checks Card Intelligence and optional Playability readiness.
- System Readiness Engine composes component readiness before Strategy, Offer Ladder, and Decision Resolver execution.
- Offer Ladder Validator still validates ladder math after prerequisites are ready.

Production UI shows user-facing readiness blockers. Atlas Inspector shows System Readiness, Configuration Readiness, Offer Ladder Readiness, Decision Readiness, and dependency state in developer mode.

## Engine Rules

- Business engines must remain provider-independent.
- Query, canonical, intent, entity, and constraint engines must remain independent from React.
- UI components render data and user controls; they do not calculate business values.
- Intelligence Console renders intelligence output only and must not create business decisions.
- UI components dispatch workflow commands; they do not own selected workflow context.
- UI components do not mutate Asset Context.
- Asset Context validation must happen before downstream market data is treated as current.
- Market Provider data has precedence over any future condition inference.
- Condition changes must request a generation-aware Market Snapshot before evaluation is current.
- History is append-only and immutable.
- Business Profiles supply assumptions and must not query providers.
- Business Profiles own Offer Policy.
- System Readiness owns prerequisite validation before Strategy, Offer Ladder, or Decision execution.
- Business engines assume READY inputs and should not expose configuration failures directly.
- Offer Ladder must consume Business Profile assumptions when available.
- Pipeline Inspector must terminate at the first invalid or unavailable stage.
- Zero-valued Offer Ladder outputs are invalid unless a future feature explicitly declares zero as an intended outcome.
- Business engines must not write or mutate history.
- Dictionaries and config files should evolve before parser logic is rewritten.
- Finish selection must be resolved by domain data, constraints, and the Variant Resolution Policy, not by UI defaults.
- Condition must never affect identity resolution.
- Card Intelligence must not negotiate or choose BUY / PASS.
- Intelligence models must not make decisions.
- Every Intelligence Model must use the Intelligence Tile presentation contract.
- Future intelligence must use the Asset Intelligence Framework contract.
- Playability must measure play demand only and must not negotiate or decide BUY / PASS.
- Negotiation Ladder owns negotiation guidance.
- Offer Ladder Validator validates negotiation output before Decision Resolver execution.
- Decision Resolver compares asking price against the Negotiation Ladder.
- Decision Resolver must remain deterministic and business-profile agnostic after receiving a validated ladder.
- Scryfall prices must be labeled as market estimates, never live inventory.
- Recommendation explanations must add decision context instead of repeating visible metrics.
- Vendor Workspace shortcuts must preserve normal typing behavior inside inputs and selects.
- Context invalidation must stay centralized in `ContextInvalidationEngine`.
