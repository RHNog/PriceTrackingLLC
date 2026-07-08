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

Card Intelligence

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

Every `CardProfile` contains identity, printing, variant, condition, market context, condition market snapshot, signals, overall confidence, and generation timestamp.

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

## Stable Systems

The following systems are stable extension points. Future work should enrich them instead of redesigning their boundaries:

- Knowledge Platform
- Query Engine
- Canonical Resolution
- Intent Resolution
- Constraint Satisfaction
- Variant Resolution
- Card Intelligence Platform
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

## Engine Rules

- Business engines must remain provider-independent.
- Query, canonical, intent, entity, and constraint engines must remain independent from React.
- UI components render data and user controls; they do not calculate business values.
- Dictionaries and config files should evolve before parser logic is rewritten.
- Finish selection must be resolved by domain data, constraints, and the Variant Resolution Policy, not by UI defaults.
- Condition must never affect identity resolution.
- Card Intelligence must not negotiate or choose BUY / PASS.
- Negotiation Ladder owns negotiation guidance.
- Decision Resolver compares asking price against the Negotiation Ladder.
- Scryfall prices must be labeled as market estimates, never live inventory.
- Recommendation explanations must add decision context instead of repeating visible metrics.
- Vendor Workspace shortcuts must preserve normal typing behavior inside inputs and selects.
