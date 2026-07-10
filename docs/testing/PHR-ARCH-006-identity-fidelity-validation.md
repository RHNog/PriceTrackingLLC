# PHR-ARCH-006 Identity Fidelity Validation

## Automated validation

- ESLint passes.
- Next.js production build and TypeScript pass.
- Lorcast normalization regression verifies identity fields, artwork, provider set identity, TCGplayer ID, excluded prices, and derived Treatment provenance.
- Treatment regression verifies Enchanted, Promo, Iconic, Standard, Unknown, and the prohibition on deriving Cold Foil.
- Completeness regression verifies artwork, printing, collector number, treatment, language, and Market Not Applicable independently.

## Identity scenarios

- Elsa, Mulan, Mickey Mouse, Belle, and Maleficent route through Lorcast and retain individual printings, collector numbers, set, language, artwork, canonical identity, treatment, and completeness.
- Mox Opal continues to route through Scryfall; explicit Magic finish metadata resolves into canonical Treatment without changing market-provider behavior.

## Invariants

- `prices.usd` and `prices.usd_foil` are ignored by identity normalization.
- UI components consume canonical Treatment and contain no Lorcast-specific logic.
- Legacy finish remains only as a compatibility field for variant and market workflows.
