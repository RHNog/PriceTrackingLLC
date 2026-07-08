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

These provider families must stay separate.

Current state:

- Scryfall is the first Identity Provider.
- Scryfall is the first Market Provider.
- Scryfall market data is daily affiliate market estimate data, not live listing inventory.
- Lowest listing and recent sale data are not live yet.
- UI components must never know Scryfall response shapes.
- Provider data must be adapted into domain objects before it reaches engines or UI.

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

## Engine Rules

- Business engines must remain provider-independent.
- Query, canonical, intent, entity, and constraint engines must remain independent from React.
- UI components render data and user controls; they do not calculate business values.
- UI components dispatch workflow commands; they do not own selected workflow context.
- UI components do not mutate Asset Context.
- Asset Context validation must happen before downstream market data is treated as current.
- Market Provider data has precedence over any future condition inference.
- Condition changes must request a generation-aware Market Snapshot before evaluation is current.
- History is append-only and immutable.
- Business engines must not write or mutate history.
- Dictionaries and config files should evolve before parser logic is rewritten.
- Finish selection must be resolved by domain data, constraints, and the Variant Resolution Policy, not by UI defaults.
- Condition must never affect identity resolution.
- Card Intelligence must not negotiate or choose BUY / PASS.
- Intelligence models must not make decisions.
- Future intelligence must use the Asset Intelligence Framework contract.
- Negotiation Ladder owns negotiation guidance.
- Offer Ladder Validator validates negotiation output before Decision Resolver execution.
- Decision Resolver compares asking price against the Negotiation Ladder.
- Scryfall prices must be labeled as market estimates, never live inventory.
- Recommendation explanations must add decision context instead of repeating visible metrics.
- Vendor Workspace shortcuts must preserve normal typing behavior inside inputs and selects.
- Context invalidation must stay centralized in `ContextInvalidationEngine`.
