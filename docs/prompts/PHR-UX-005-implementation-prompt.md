# PHR-UX-005 Implementation Prompt

## Project Context

PHR-ARCH-007 is immutable. PHR-ARCH-009 owns collector-facing translations.

## Feature ID

`PHR-UX-005`

## Objective

Present physical finish as Printing and hide non-distinguishing Treatment/Printing values.

## Required Reading

- `docs/architecture/PHR-ARCH-007-cross-game-identity-ontology.md`
- `docs/architecture/PHR-ARCH-009-identity-presentation-layer.md`
- `docs/ux/PHR-UX-005-collector-presentation-rules.md`

## Implementation Requirements

- Add presentation visibility metadata and reasons.
- Centralize hide/show rules in the presentation formatter.
- Update Command Palette, Vendor results, and Watchlist.
- Preserve developer visibility.
- Validate Magic, Lorcana, Pokémon, and One Piece examples.

## Constraints

- Do not modify canonical ontology or provider mappings.
- Do not redesign UI hierarchy.
- Do not duplicate visibility rules in React components.

## Expected Architecture

Canonical values pass unchanged into presentation fields. The presentation formatter determines collector label, value, visibility, and visibility reason.

## Testing Expectations

- Standard/Regular/unavailable hiding.
- Borderless Foil, Enchanted, and Cold Foil examples.
- Four-game provider-neutral fixtures.
- Lint, build, and diff validation.

## Documentation Updates

- Atlas, Architecture, Roadmap, Sprint History, testing, and release notes.

## Acceptance Criteria

- PHR-UX-005 specification passes without ontology changes.

## Non-Goals

- Canonical changes.
- Provider changes.
- UI redesign.

## Notes For AI Coding Agents

- Preserve unrelated user changes.
