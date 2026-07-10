# PHR-UX-005 Validation

## Presentation cases

- Borderless + Foil → Treatment: Borderless; Printing: Foil.
- Enchanted + Provider Does Not Supply → Treatment: Enchanted; Printing hidden.
- Standard + Cold Foil → Treatment hidden; Printing: Cold Foil.
- Standard + Regular/Normal/Nonfoil → Treatment and Printing hidden.
- Normal + Foil availability → only Printing: Foil is displayed.
- Pending Provider Support remains visible because it communicates unresolved capability rather than regular printing.

## Game coverage

Provider-neutral fixtures verify identical Standard/Regular suppression for Magic, Lorcana, Pokémon, and One Piece.

## Developer mode

Diagnostics retain canonical concept, canonical value, presentation label, presentation value, visibility, and visibility reason.

## Validation commands

- `npm run lint`
- `npm run build`
- `git diff --check`

All pass. No canonical ontology or provider mapping file was changed for PHR-UX-005.
