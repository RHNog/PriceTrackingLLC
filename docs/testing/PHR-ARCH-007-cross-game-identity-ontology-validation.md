# PHR-ARCH-007 Validation

## Automated coverage

- Mulan Enchanted maps to Printing Design Facet `Enchanted`.
- Lorcast Physical Finish maps to `Provider Does Not Supply` and never Cold Foil.
- Scryfall Oracle, print, finish, and marketplace identifiers map to separate ontology layers.
- TCGplayer Product and SKU remain Market Identity; provider `printingId` is retained as finish segmentation.
- Legacy `CardIdentity` records migrate without removing compatibility fields.
- Typed alias mappings resolve only when validated.
- Inventory Instance and OwnershipRelationship remain separate from canonical identity.
- Watchlist hydration preserves existing membership and migrates legacy finish selections.
- Market snapshots expose independent canonical Market Observation references.

## Live provider validation

- `Mulan Resourceful Recruit` returned Winterspell #69 as a base printing and Winterspell #229 with Printing Design Facet `Enchanted`.
- Both Lorcast printings returned Physical Finish `Provider Does Not Supply`; neither returned Unknown or Cold Foil.
- `Mox Opal` remained routed through Scryfall with an Oracle-backed Gameplay Identity, Scryfall Printing Identity, explicit Normal/Foil Physical Variants, and TCGplayer Market Identity candidates.

## Commands

- `npm run lint`
- `npm run build`
- `git diff --check`

## Persistence invariants

- No watchlist deletion or replacement is performed.
- Market repository keys retain legacy printing/variant/condition compatibility.
- Replay schema remains backward compatible and accepts optional ontology references.
