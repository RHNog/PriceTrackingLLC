# Cross-Game Identity Ontology

## Feature ID

`PHR-ARCH-007`

## Title

Gameplay, Printing, Physical, and Market Identity Boundaries

## Status

Completed

## Priority

Critical

## Category

Architecture, Technical, API, Domain Model, Research

## Objective

Define a provider-neutral identity ontology that preserves the meaning of Lorcast, Scryfall, and TCGplayer records without treating similarly named provider fields as equivalent concepts.

## Background

Trading-card providers partition identity differently. Lorcast exposes gameplay and catalog-print data in one Card object. Scryfall explicitly supplies an Oracle identity and a print object with one or more available finishes. TCGplayer exposes catalog Products and market SKUs, where a SKU combines product, language, provider "printing" option, and condition. Project Phronesis currently flattens these distinctions into `Card`, `finish`, `treatment`, and one canonical identity object.

## Problem Statement

The current model overloads four distinct questions:

1. What game object is this under the rules?
2. Which published catalog printing is this?
3. Which physical manufacture or collectible variant is this?
4. Which marketplace-addressable product or SKU is being observed?

Flattening those questions can create false joins. The most important current example is Lorcast rarity: `Enchanted` is supplied as the rarity of a catalog print, while foil availability is represented only indirectly by separate price lanes. Rarity is therefore not reliable proof of a physical finish. Similarly, TCGplayer's `printingId` commonly identifies Normal/Foil at the SKU level and is not equivalent to a set printing.

## Proposed Solution

Use four linked canonical entities plus a separate inventory instance:

```text
GameplayIdentity
    1 ── * PrintingIdentity
             1 ── * PhysicalVariantIdentity
                       1 ── * MarketIdentity
                                 1 ── * MarketObservation

PhysicalVariantIdentity
    1 ── * InventoryInstance
```

Each entity owns only stable facts at its semantic level. Provider identifiers are typed aliases attached to the entity they actually identify. Unknown relationships remain unresolved rather than being inferred from prices or labels.

## Canonical Entity Definitions

### Gameplay Identity

The rules-equivalent game object, independent of edition, artwork, foil process, condition, seller, or price.

Recommended fields:

- `gameplayIdentityId`
- `gameId`
- `name`
- `subtitleOrVersion`
- `layout`
- `rulesText`
- `types`
- `subtypesOrClassifications`
- game-specific attributes in a namespaced `gameplayAttributes` value object
- legality snapshots as time-varying gameplay metadata, not identity keys
- typed provider aliases such as Scryfall `oracle_id`

Identity key rule: two records share Gameplay Identity only when they are rules-equivalent, not merely because their names match.

### Printing Identity

One published catalog occurrence of a Gameplay Identity in a set or product release. It answers which edition, collector slot, language-specific print record, and artwork were published.

Recommended fields:

- `printingIdentityId`
- `gameplayIdentityId`
- `setIdentityId`, set name, and set code
- `collectorNumber` as a string
- `language`
- `releaseDate`
- `rarity`
- `artworkIdentityId` and provider-returned artwork URIs
- illustrators
- frame, border, showcase, borderless, full-art, promo, and other print-design facets
- provider print record aliases such as Lorcast `id` or Scryfall `id`

Rarity belongs here. Alternate artwork and frame treatment belong here unless the provider proves they vary within the same print record.

### Physical Variant Identity

One manufacturable physical version of a Printing Identity. It answers what physical stock or surface treatment exists, independently of wear and marketplace listing.

Recommended fields:

- `physicalVariantIdentityId`
- `printingIdentityId`
- `finish`: Normal, Foil, Etched, Cold Foil, or provider vocabulary
- `materialOrProcess`
- `stampOrSecurityTreatment`
- `sizeOrFormFactor`
- `editionMark` when it distinguishes manufactured copies
- provenance, confidence, and resolution state for every derived facet
- provider variant aliases when available

Do not put condition here. Near Mint and Damaged describe a copy's state, not the manufactured identity. Do not use price presence as proof that a physical variant exists.

### Market Identity

A provider-specific address for trading or valuation. It binds a catalog product or SKU to the canonical physical object and the market segmentation required by that provider.

Recommended fields:

- `marketIdentityId`
- `marketProviderId`
- `providerProductId`
- `providerSkuId`
- resolved `physicalVariantIdentityId` when known
- provider language, finish/printing, and condition dimensions
- marketplace channel and region when they change addressability
- mapping status, evidence, confidence, and validity interval

Prices, listings, sales, currency, timestamps, and quantities belong to `MarketObservation`, not Market Identity.

### Inventory Instance

A user-owned or seller-listed physical copy. It references Physical Variant Identity and carries condition, grading, signature, alteration, provenance, acquisition, location, and quantity. These facts must not mutate canonical printing or gameplay identity.

## Lorcast Semantic Audit

| Lorcast concept | Canonical owner | Reason |
|---|---|---|
| `name`, `version`, `layout` | Gameplay Identity | Identify the Lorcana rules object and its named version. |
| `cost`, `inkwell`, `ink`, `type`, `classifications`, `text`, `move_cost`, `strength`, `willpower`, `lore` | Gameplay Identity | Rules and deck-construction meaning. |
| `legalities` | Gameplay metadata | Applies to play eligibility and can change over time; not a stable identity key. |
| `id` | Printing Identity provider alias | With `unique=prints`, each result is a catalog print record. |
| `set.id`, `set.code`, `set.name`, `collector_number`, `released_at`, `lang` | Printing Identity | Identify the published set occurrence. |
| `rarity` | Printing Identity | Catalog slot/tier. Enchanted or Promo may imply special print design, but does not prove foil manufacture. |
| `image_uris.digital`, `illustrators` | Printing/Artwork Identity | Describe the artwork associated with the print record. |
| `tcgplayer_id` | Market Identity alias candidate | Cross-reference to a marketplace Product; it requires validation before joining. |
| `prices.usd`, `prices.usd_foil` | Market Observation | Time-sensitive valuation lanes; neither field is identity evidence. |
| Normal/Foil/Cold Foil availability | Physical Variant Identity | Not explicitly modeled by the current Lorcast Card schema. Must remain unresolved unless another identity source proves it. |

Lorcast's `unique=cards` grouping expresses gameplay deduplication, while `unique=prints` exposes individual catalog prints. This is direct evidence that Gameplay Identity and Printing Identity are different layers.

## Scryfall Semantic Audit

| Scryfall concept | Canonical owner | Reason |
|---|---|---|
| `oracle_id` | Gameplay Identity provider alias | Stable across printings that share the same Oracle object. |
| name, mana/rules/type/color fields, card faces | Gameplay Identity | Rules-equivalent card semantics. |
| Scryfall `id` | Printing Identity provider alias | Identifies a Scryfall card/print object. |
| `set`, `set_id`, `collector_number`, `lang`, `released_at`, `rarity` | Printing Identity | Published edition metadata. |
| `illustration_id`, artist, image URIs | Artwork/Printing Identity | Artwork identity and print presentation. |
| frame, frame effects, border, full-art, promo types | Printing design facets | Visual/catalog treatment, not necessarily surface finish. |
| `finishes`, `foil`, `nonfoil` | Physical Variant Identity availability | Enumerate manufactured finish options attached to the print object. |
| `tcgplayer_id`, `tcgplayer_etched_id`, Cardmarket ID | Market Identity aliases | Marketplace cross-references; etched may require a separate physical-variant join. |
| `prices` | Market Observation | Daily provider price observations, not identity. |

Scryfall is the closest of the three providers to the proposed ontology, but its Card object still combines Gameplay, Printing, Physical availability, and Market observations in one payload.

## TCGplayer Semantic Audit

| TCGplayer concept | Canonical owner | Reason |
|---|---|---|
| `categoryId` | Game/product-line taxonomy | Marketplace category, not a canonical card identity. |
| `groupId` | Printing/set mapping candidate | Commonly represents the catalog group/set, but requires category-aware mapping. |
| `productId`, name, image, extended fields | Market Product / Printing mapping | Marketplace catalog identity; must be matched to a canonical printing rather than treated as rules identity. |
| SKU `languageId` | Market Identity dimension | Marketplace language segmentation. |
| SKU `printingId` or `variantId` | Physical finish dimension | TCGplayer category vocabulary such as Normal/Foil; the name is not equivalent to canonical Printing Identity. |
| SKU `conditionId` | Market Identity dimension | Required to address a market SKU, while the underlying condition belongs to a copy/listing state. |
| `skuId` / `productConditionId` | Market Identity provider alias | Addressable unit used by pricing endpoints. |
| market price, low price, shipping, Direct Low | Market Observation | Time-sensitive evidence attached to a SKU. |
| seller inventory, quantity, listing price | Listing Observation | Seller/channel-specific state, not identity. |

TCGplayer demonstrates why Market Identity cannot be reduced to `tcgplayerId` on a card. Product and SKU are separate levels, and the SKU composes language, finish vocabulary, and condition.

## Cross-Provider Comparison

| Meaning | Lorcast | Scryfall | TCGplayer | Canonical entity |
|---|---|---|---|---|
| Rules-equivalent object | `unique=cards` grouping; no explicit ID | `oracle_id` | Usually not explicit | Gameplay Identity |
| Published set occurrence | Card `id` with set/number/lang | Card `id` with set/number/lang | Product plus group/extended fields | Printing Identity |
| Artwork identity | Image URIs + illustrator; no artwork ID | `illustration_id` + images | Product images | Artwork Identity linked to Printing |
| Surface finish availability | Not explicit | `finishes` | category `printingId`/`variantId` | Physical Variant Identity |
| Condition | Not identity data | Not identity data | SKU `conditionId` | Market Identity dimension; Inventory Instance state |
| Marketplace product | `tcgplayer_id` cross-reference | `tcgplayer_id`/etched ID | `productId` | Market Identity/Product alias |
| Marketplace SKU | Not supplied | Not supplied | `skuId`/`productConditionId` | Market Identity |
| Price | `prices` | `prices` | pricing endpoints | Market Observation |

## Identity Keys and Join Policy

- Canonical IDs are internal, immutable, and never constructed solely from mutable names.
- Provider aliases use `(provider, namespace, value, entityType)`; a bare `providerId` is insufficient.
- A join from Lorcast/Scryfall print to TCGplayer Product requires corroborating game, set/group, collector number or provider cross-reference, language, and name/version.
- A join from Product to SKU requires explicit language, provider printing/finish, and condition dictionaries.
- Provider cross-reference IDs are evidence, not unquestioned truth; mappings carry status and confidence.
- Market observations are accepted only after the provider Market Identity resolves to the intended canonical entity.
- Unknown and unsupported facets remain explicit. Price lanes never create Physical Variant Identity records.

## Assessment of the Current Phronesis Model

### Correct foundations

- Provider adapters isolate raw schemas.
- Lorcast prices are excluded from identity normalization.
- Treatment carries source, confidence, explanation, and resolution state.
- TCGplayer market evidence is downstream from provider adapters.

### Semantic debt

- `CanonicalIdentityModel` represents both a gameplay identity and the first printing's fields.
- `Card` mixes printing facts, physical finish availability, artwork, rules metadata, and market cross-references.
- `canonicalIdentity` is name-derived for providers without a stable gameplay object ID.
- `tcgplayerId` lacks namespace and entity-level semantics.
- `conditionAvailability` is attached to canonical identity even though condition is inventory/market state.
- `Treatment` currently mixes print-design treatments (Borderless, Showcase, Enchanted) with physical finishes (Foil, Etched).
- The PHR-ARCH-006 Lorcast policy deriving `Standard` or `Enchanted` physical treatment from rarity overstates the provider evidence. That value should be reclassified as a Printing design/rarity facet; physical finish should be `Provider Does Not Supply` or `Pending Support`.

## Migration Proposal

1. Introduce the four new entity contracts without removing `Card`.
2. Add typed `ProviderAlias` and `IdentityMapping` records.
3. Adapt Scryfall first because `oracle_id`, print `id`, `illustration_id`, and `finishes` provide explicit boundaries.
4. Adapt Lorcast with a deterministic gameplay fingerprint until Lorcast exposes a stable gameplay-group ID; retain its Card `id` only as Printing Identity.
5. Replace single Treatment with separate `printingDesignFacets` and `physicalFinish`.
6. Model TCGplayer Product and SKU explicitly; never overload TCGplayer `printingId` as canonical Printing Identity.
7. Make Market Context reference `marketIdentityId` and validate its mapping to the selected Physical Variant.
8. Migrate UI through compatibility selectors, then deprecate overloaded `finish`, `treatment`, and bare `tcgplayerId` fields.

## Functional Requirements

- Preserve gameplay equivalence independently from print equivalence.
- Preserve print/art/design differences independently from physical finish.
- Preserve physical finish independently from condition.
- Preserve marketplace addressability independently from market observations.
- Expose provider provenance and mapping confidence at every join.
- Prevent price data from creating or changing canonical identity.

## Non-Functional Requirements

### Performance

Entity resolution must use indexed internal IDs and typed provider aliases. Market refresh must not repeat identity resolution when a valid mapping exists.

### Scalability

Game-specific gameplay attributes remain namespaced while the four identity layers remain shared.

### Maintainability

Provider vocabulary is translated only inside adapters and mapping registries.

### Reliability

Ambiguous joins fail closed and return a mapping state rather than selecting the nearest product.

### Accessibility

Product surfaces use human labels but retain precise developer explanations for unresolved identity dimensions.

### Offline Support

All canonical entities, aliases, mappings, and mapping evidence are repository-persistable.

### Security

Provider payloads remain untrusted input and require schema validation before mapping.

### Extensibility

The ontology supports sealed products, tokens, multi-face cards, graded copies, signatures, regional releases, and future games without provider-specific UI types.

### Responsiveness

No direct UI redesign is part of this proposal.

## User Stories

- As a collector, I want foil, showcase, language, printing, and condition to retain distinct meanings so I select the exact item I own.
- As a vendor, I want a market price tied to the correct marketplace SKU so a nearby but different variant cannot influence an offer.
- As a developer, I want provider IDs to declare what they identify so cross-provider joins are auditable.

## Acceptance Criteria

- Every audited provider field has one canonical semantic owner.
- Gameplay, Printing, Physical, Market, Observation, and Inventory Instance are separate contracts.
- Lorcast rarity is not used as proof of physical finish.
- Scryfall `oracle_id`, print `id`, and `finishes` map to different layers.
- TCGplayer Product and SKU are separate, and TCGplayer `printingId` is treated as provider finish vocabulary.
- Market observations cannot mutate identity.

## Edge Cases

- Same name but different rules text.
- Same rules object with different set, collector number, language, art, or frame.
- Same printing offered in Normal, Foil, Etched, or Cold Foil.
- One marketplace Product mapping to multiple condition/language/finish SKUs.
- Provider cross-reference pointing to a stale or merged Product.
- Double-faced, meld, token, oversized, serialized, signed, altered, graded, and sealed products.

## Dependencies

- `PHR-ARCH-004` Provider-Agnostic Identity Platform.
- `PHR-ARCH-006` Identity Fidelity and Treatment Model.
- Market Ontology and Market Truth validation.
- Lorcast, Scryfall, and TCGplayer provider documentation.

## Research Sources

- Lorcast Card API: `https://lorcast.com/docs/api/cards`
- Lorcast API overview and cache guidance: `https://lorcast.com/docs/api`
- Scryfall Card objects: `https://scryfall.com/docs/api/cards`
- TCGplayer Products: `https://docs.tcgplayer.com/reference/catalog_getproducts-1`
- TCGplayer Product SKUs: `https://docs.tcgplayer.com/reference/catalog_getskusbyproductid`
- TCGplayer category printings: `https://docs.tcgplayer.com/reference/catalog_getcategoryprintings`
- TCGplayer conditions: `https://docs.tcgplayer.com/reference/catalog_getconditions`
- TCGplayer SKU pricing: `https://docs.tcgplayer.com/reference/pricing_getproductconditionprices-1`

## Future Enhancements

- Provider-backed gameplay fingerprints for sources without stable gameplay IDs.
- Artwork Identity as a first-class reusable entity.
- Grading Identity and certification mappings.
- Serialized-copy and provenance identity.

## Technical Notes

The migration is implemented through authoritative ontology contracts plus compatibility projections for legacy `CardIdentity`, `Card`, workflow URL, watchlist, repository, and replay shapes.

PHR-ARCH-009 treats these canonical contracts as immutable and adds collector vocabulary only through a one-way presentation adapter.

## UI / UX Notes

Future selectors should present Printing Design and Physical Finish separately only when the distinction is actionable. Condition remains a later copy/market selection step.

## Success Metrics

- Zero cross-provider joins based solely on name.
- Zero market observations attached without a validated Market Identity mapping.
- Every provider alias declares its entity type and namespace.

## Open Questions

- Whether language is always Printing Identity or sometimes a Physical Variant under provider-specific catalogs.
- How to fingerprint Lorcast Gameplay Identity when name/version are corrected or rules receive errata.
- Whether Artwork Identity should be first-class in the first migration or remain a Printing value object.

## Traceability

- Originating work order: semantic audit of Lorcast, Scryfall, and TCGplayer identity concepts.
- Related implementation prompt: `docs/prompts/PHR-ARCH-007-implementation-prompt.md`.
- Related tests: `tests/cross-game-identity-ontology.test.ts`.
- Related release notes: `docs/release-notes/PHR-ARCH-007.md`.
- Last modified: 2026-07-10.
- Modification reason: canonical ontology migration completed with compatibility projections.
