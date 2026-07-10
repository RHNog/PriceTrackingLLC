# PHR-ARCH-007 Implementation Prompt

## Project Context

Project Phronesis requires provider-neutral identity semantics across collectible games and marketplaces. Documentation is part of implementation.

## Feature ID

`PHR-ARCH-007`

## Objective

Implement separate Gameplay, Printing, Physical Variant, and Market Identity entities while preserving current workflows through compatibility selectors.

## Required Reading

- `docs/architecture/PHR-ARCH-007-cross-game-identity-ontology.md`
- `docs/architecture/PHR-ARCH-004-identity-platform.md`
- `docs/architecture/PHR-ARCH-006-identity-fidelity-treatment-model.md`
- `docs/ARCHITECTURE.md`

## Implementation Requirements

- Create immutable canonical contracts for all four identity layers.
- Add typed provider aliases and evidence-backed cross-provider mappings.
- Separate printing design facets from physical finish.
- Map Scryfall Oracle, print, artwork, finish, and market IDs to their correct layers.
- Map Lorcast Card IDs to Printing Identity and stop deriving physical finish from rarity.
- Model TCGplayer Product and SKU separately.
- Preserve current UI and workflow behavior through compatibility projections during migration.

## Constraints

- Do not infer identity from prices.
- Do not treat TCGplayer `printingId` as canonical Printing Identity.
- Do not put provider-specific fields in UI components.
- Do not remove legacy contracts before all consumers migrate.
- Do not change market calculations as part of identity migration.

## Expected Architecture

Providers normalize raw records into typed identity entities and aliases. An Identity Mapping Repository owns cross-provider joins and evidence. Market observations reference Market Identity; inventory copies reference Physical Variant Identity.

## Testing Expectations

- Unit tests for entity keys and alias namespaces.
- Provider mapping tests for Lorcast, Scryfall, and TCGplayer.
- Negative tests for name-only joins, price-derived finish, and Product/SKU conflation.
- Compatibility tests for Command Palette, Watchlist, and Vendor Workspace.

## Documentation Updates

- Update this specification when implementation decisions change.
- Update Atlas, Architecture, Roadmap, Sprint History, testing records, and release notes.

## Acceptance Criteria

- All acceptance criteria in PHR-ARCH-007 pass without current workflow regression.

## Non-Goals

- UI redesign.
- New market provider connections.
- Historical analytics or inventory-instance implementation beyond required references.

## Notes For AI Coding Agents

- Preserve unrelated user changes.
- Keep edits scoped to the specification.
- Present improvement suggestions separately from implementation.
