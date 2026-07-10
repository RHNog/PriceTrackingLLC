# PHR-ARCH-009 Validation

## Coverage

- Printing Identity translates to Printing.
- Printing Design Facet translates to Treatment.
- Physical Finish translates to Finish.
- Market Observation translates to Market.
- Inventory condition translates to Condition.
- Borderless/Foil, Retro/Etched, Enchanted/Cold Foil, and Illustration Rare/Reverse Holo remain independent pairs.
- Provider Does Not Supply and Pending Provider Support precede Unknown.
- Lorcast Enchanted appears only under Treatment.
- Lorcast finish presents Provider Does Not Supply.
- Cold Foil is absent from Lorcast Treatment and is never inferred.
- Developer diagnostics preserve canonical and presentation values.

## Build validation

- `npm run lint` passes.
- `npm run build` passes TypeScript and production compilation.
- `git diff --check` passes.

## Live provider validation

- Mox Opal Double Masters #362 resolves Borderless and Full Art as Treatment while Normal/Foil remain Finish.
- Mox Opal Secret Lair Drop #1072 resolves Etched only as Finish.
- Mox Opal Kaladesh Inventions #19 resolves Masterpiece as Treatment and Foil as Finish.
- Mulan — Resourceful Recruit Winterspell #229 resolves Enchanted as Treatment and Provider Does Not Supply as Finish.
- Base Mulan Winterspell #69 resolves Standard presentation treatment and the same meaningful finish-availability explanation.

## Scope invariant

No PHR-ARCH-007 canonical contract was changed by PHR-ARCH-009.

## Identity Mapping Verification — Mulan Resourceful Recruit

Verified on 2026-07-10 against the live Lorcast API and the local Identity Orchestrator. No divergent transformation was found; no runtime repair was made.

### Winterspell #69

| Execution layer | Source | Destination | Canonical layer | Actual value |
|---|---|---|---|---|
| Lorcast JSON | `rarity` | Raw provider rarity | Provider payload | `Super_rare` |
| `deriveLorcastPrintingDesignFacets` | normalized `super rare` | `printingDesignFacets` | Normalizer projection | `[]` |
| `printingFromCard` | `card.printingDesignFacets` | `PrintingIdentity.printingDesignFacets` | Printing Identity | `[]` |
| `adaptCardPresentation` | `PrintingIdentity.printingDesignFacets` | presentation input | Presentation boundary | `[]` |
| `formatPresentationTreatment` | empty facet list | `Treatment` | Presentation model | `Standard` |
| Command Palette / Vendor / Watchlist | `presentation.treatment` | rendered label/value | Collector UI | `Treatment: Standard` |
| Lorcast normalizer | no explicit finish field | `PhysicalFinish` | Physical Variant Identity | `Provider Does Not Supply` |
| Presentation formatter | canonical resolution state | `Finish` | Collector UI | `Finish: Provider Does Not Supply` |

Expected and actual values match.

### Winterspell #229

| Execution layer | Source | Destination | Canonical layer | Actual value |
|---|---|---|---|---|
| Lorcast JSON | `rarity` | Raw provider rarity | Provider payload | `Enchanted` |
| `deriveLorcastPrintingDesignFacets` | normalized `enchanted` | `printingDesignFacets[0]` | Normalizer projection | `Enchanted`, source `rarity`, Explicit |
| `printingFromCard` | `card.printingDesignFacets` | `PrintingIdentity.printingDesignFacets` | Printing Identity | `[Enchanted]` |
| `adaptCardPresentation` | `PrintingIdentity.printingDesignFacets` | presentation input | Presentation boundary | `[Enchanted]` |
| `formatPresentationTreatment` | facet values | `Treatment` | Presentation model | `Enchanted` |
| Command Palette / Vendor / Watchlist | `presentation.treatment` | rendered label/value | Collector UI | `Treatment: Enchanted` |
| Lorcast normalizer | no explicit finish field | `PhysicalFinish` | Physical Variant Identity | `Provider Does Not Supply` |
| Presentation formatter | canonical resolution state | `Finish` | Collector UI | `Finish: Provider Does Not Supply` |

Expected and actual values match. No layer introduced `Standard` for #229.

### Price-field exclusion

The live #69 payload contained `prices.usd` and `prices.usd_foil`; #229 contained `prices.usd_foil`. Neither field entered Printing Design Facets or Physical Finish. This confirms that price-lane presence did not create Treatment or Finish identity.
