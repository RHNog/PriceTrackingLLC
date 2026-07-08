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

Vendor Evaluation

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

## Engine Rules

- Business engines must remain provider-independent.
- Query, canonical, intent, entity, and constraint engines must remain independent from React.
- UI components render data and user controls; they do not calculate business values.
- Dictionaries and config files should evolve before parser logic is rewritten.
- Finish selection must be resolved by domain data and constraints, not by UI defaults.
- Scryfall prices must be labeled as market estimates, never live inventory.
