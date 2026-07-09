# JustTCG Provider Data Model

This document records the observed JustTCG SDK response model from `justtcg-js@0.2.1`.

Representative live schema checks were run against normal printings, old printings, promos, foreign-language variants, foil variants, and Masterpiece-style premium entries including:

- Lightning Bolt
- Mox Opal
- Chrome Mox
- Black Lotus
- Urza's Saga
- Sol Ring
- Counterspell

## Response Shape

```text
JustTCGApiResponse<Card[]>
  data[]
    card fields
    variants[]
      variant fields
  pagination
  usage
  error?
  code?
```

## Card Fields

| Provider field | Kind | Classification | Notes |
| --- | --- | --- | --- |
| `card.id` | string | Raw observation | Provider card slug. |
| `card.uuid` | string | Raw observation | Stable provider card UUID. |
| `card.name` | string | Raw observation | Provider card name. |
| `card.game` | string | Raw observation | Provider game name. |
| `card.set` | string | Raw observation | Provider set slug. |
| `card.set_name` | string, optional | Raw observation | Human-readable set name. |
| `card.number` | string or null | Raw observation | Collector number, sometimes `N/A` or null for older printings. |
| `card.rarity` | string or null | Raw observation | Provider rarity label. |
| `card.tcgplayerId` | string or null | Raw observation | External product identifier. |
| `card.scryfallId` | string or null | Raw observation | External Scryfall identifier. |
| `card.mtgjsonId` | string or null | Raw observation | External MTGJSON identifier. |
| `card.details` | string or null | Raw observation | Additional provider card details when available. |
| `card.variants` | array | Raw observation collection | Condition, finish, language, SKU, price, history, and statistics live here. |

## Variant Fields

| Provider field | Kind | Classification | Notes |
| --- | --- | --- | --- |
| `variant.id` | string | Raw observation | Provider variant slug. Encodes condition and printing in many observed MTG cases. |
| `variant.uuid` | string | Raw observation | Stable provider variant UUID. |
| `variant.condition` | string | Raw observation | Observed values: Near Mint, Lightly Played, Moderately Played, Heavily Played, Damaged. |
| `variant.printing` | string | Raw observation | Observed examples: Normal, Foil, Foil - Japanese, Normal - French. |
| `variant.language` | string or null | Raw observation | Observed English and foreign-language variants. |
| `variant.tcgplayerSkuId` | string, optional | Raw observation | Provider SKU/product variant identifier. |
| `variant.price` | number | Raw observation | Current provider price for this exact variant. Do not assume it equals UI market price. |
| `variant.lastUpdated` | number | Raw observation | Epoch seconds for provider observation timestamp. |
| `variant.priceHistory[].t` | number | Raw observation | Epoch seconds for history point. |
| `variant.priceHistory[].p` | number | Raw observation | Historical provider price at timestamp. |
| `variant.priceChange24hr` | number or null | Derived metric from provider | Provider-calculated movement. |
| `variant.priceChange7d` | number or null | Derived metric from provider | Provider-calculated movement. |
| `variant.priceChange30d` | number or null | Derived metric from provider | Provider-calculated movement. |
| `variant.priceChange90d` | number or null | Derived metric from provider | Provider-calculated movement. |
| `variant.avgPrice` | number or null | Derived metric from provider | Provider 7-day average. |
| `variant.avgPrice30d` | number or null | Derived metric from provider | Provider 30-day average. |
| `variant.avgPrice90d` | number or null | Derived metric from provider | Provider 90-day average. |
| `variant.minPrice7d` | number or null | Derived metric from provider | Provider range statistic. |
| `variant.maxPrice7d` | number or null | Derived metric from provider | Provider range statistic. |
| `variant.minPrice30d` | number or null | Derived metric from provider | Provider range statistic. |
| `variant.maxPrice30d` | number or null | Derived metric from provider | Provider range statistic. |
| `variant.minPrice90d` | number or null | Derived metric from provider | Provider range statistic. |
| `variant.maxPrice90d` | number or null | Derived metric from provider | Provider range statistic. |
| `variant.stddevPopPrice7d` | number or null | Derived metric from provider | Provider volatility statistic. |
| `variant.stddevPopPrice30d` | number or null | Derived metric from provider | Provider volatility statistic. |
| `variant.stddevPopPrice90d` | number or null | Derived metric from provider | Provider volatility statistic. |
| `variant.covPrice7d` | number or null | Derived metric from provider | Provider coefficient of variation. |
| `variant.covPrice30d` | number or null | Derived metric from provider | Provider coefficient of variation. |
| `variant.covPrice90d` | number or null | Derived metric from provider | Provider coefficient of variation. |
| `variant.iqrPrice7d` | number or null | Derived metric from provider | Provider dispersion statistic. |
| `variant.iqrPrice30d` | number or null | Derived metric from provider | Provider dispersion statistic. |
| `variant.iqrPrice90d` | number or null | Derived metric from provider | Provider dispersion statistic. |
| `variant.trendSlope7d` | number or null | Derived metric from provider | Provider trend statistic. |
| `variant.trendSlope30d` | number or null | Derived metric from provider | Provider trend statistic. |
| `variant.trendSlope90d` | number or null | Derived metric from provider | Provider trend statistic. |
| `variant.priceChangesCount7d` | number or null | Derived metric from provider | Provider activity statistic. |
| `variant.priceChangesCount30d` | number or null | Derived metric from provider | Provider activity statistic. |
| `variant.priceChangesCount90d` | number or null | Derived metric from provider | Provider activity statistic. |
| `variant.priceRelativeTo30dRange` | number or null | Derived metric from provider | Provider range-position statistic. |
| `variant.priceRelativeTo90dRange` | number or null | Derived metric from provider | Provider range-position statistic. |
| `variant.minPriceAllTime` | number or null | Derived metric from provider | Provider lifetime range statistic. |
| `variant.maxPriceAllTime` | number or null | Derived metric from provider | Provider lifetime range statistic. |
| `variant.minPriceAllTimeDate` | string or null | Derived metric from provider | Date attached to provider lifetime statistic. |
| `variant.maxPriceAllTimeDate` | string or null | Derived metric from provider | Date attached to provider lifetime statistic. |

## Response Metadata

| Provider field | Kind | Classification | Notes |
| --- | --- | --- | --- |
| `pagination.total` | number | Raw observation | Query result count. |
| `pagination.limit` | number | Raw observation | Page size. |
| `pagination.offset` | number | Raw observation | Page offset. |
| `pagination.hasMore` | boolean | Raw observation | More result pages available. |
| `usage.apiRequestLimit` | number | Raw observation | Account/API quota metadata. |
| `usage.apiDailyLimit` | number | Raw observation | Account/API quota metadata. |
| `usage.apiRateLimit` | number | Raw observation | Account/API quota metadata. |
| `usage.apiRequestsUsed` | number | Raw observation | Account/API quota metadata. |
| `usage.apiDailyRequestsUsed` | number | Raw observation | Account/API quota metadata. |
| `usage.apiRequestsRemaining` | number | Raw observation | Account/API quota metadata. |
| `usage.apiDailyRequestsRemaining` | number | Raw observation | Account/API quota metadata. |
| `usage.apiPlan` | string | Raw observation | Account/API plan label. |
| `error` | string, optional | Raw observation | Provider error message. |
| `code` | string, optional | Raw observation | Provider error code. |

## Observed Variant Representation

Condition-specific data is represented as separate `variant` objects, not as nested listing arrays.

Observed examples:

- `condition: "Near Mint"`, `printing: "Normal"`
- `condition: "Lightly Played"`, `printing: "Foil"`
- `condition: "Moderately Played"`, `printing: "Normal - Japanese"`
- `condition: "Damaged"`, `printing: "Foil - Spanish"`

Special printings and products appear through `card.set_name`, `card.rarity`, `variant.printing`, `variant.language`, and provider IDs:

- Judge Promos
- Buy-A-Box Promos
- FNM Promos
- Secret Lair Drop Series
- Special Guests
- Masterpiece Series: Kaladesh Inventions
- foreign-language normal and foil variants

## Internal Normalization Rule

Do not map provider fields directly to UI fields.

The provider layer should preserve:

- Raw card observations.
- Raw variant observations.
- Raw price observations.
- Raw history observations.
- Provider-supplied derived statistics as provider metrics.

The Market Intelligence Repository should store raw observations as evidence. Platform market fields such as liquidity, volatility, market confidence, market stability, demand momentum, and selected market estimate should be derived internally from those observations.

## Market Ontology Capability

JustTCG is registered as a variant-level market evidence provider.

Supported evidence domains:

- Variant Valuation
- Historical Pricing
- Price Trend
- Volatility
- Market Confidence
- Provider Metadata

Partially supported evidence domains:

- Market Liquidity, because valuation and movement context can contribute to liquidity reasoning but cannot prove live market depth by itself.

Unsupported evidence domains:

- Listing Intelligence
- Transaction Intelligence
- Inventory Intelligence

Do not populate Lowest Listing, listing count, recent sales, spread, seller competition, shipping, quantity, listing freshness, completed sales, or inventory depth from JustTCG. The current SDK response abstracts listing-level data away behind variant price and statistics.

## Transitional Projection

Until the Market Intelligence Engine exists, JustTCG Variant Valuation may be projected into the existing Current Market Estimate field.

Projection rules:

- Current Market Estimate may use Variant Valuation.
- Lowest Listing must not use Variant Valuation.
- Recent Sales must not use Variant Valuation.
- Listing and transaction fields remain empty unless their own evidence domains are supplied.

Developer diagnostics mark the projection with Requested UI Field, Resolved Evidence Domain, Evidence Source, and Projection Used. This compatibility bridge should be removed once Current Market Estimate is owned by the Market Intelligence Engine.

## Repository Design Implication

Evidence nodes should be scoped by:

- asset identity
- printing
- finish
- condition
- language
- provider product identifier
- future certification identity, such as PSA/BGS/CGC provider and grade

This lets raw JustTCG observations for Near Mint, Lightly Played, foil, foreign-language, promo, Masterpiece, and future graded variants coexist without collapsing into one generic market snapshot.
