# PHR-ARCH-009 Implementation Prompt

## Project Context

PHR-ARCH-007 is immutable. This feature translates canonical identity into collector terminology at the presentation boundary.

## Feature ID

`PHR-ARCH-009`

## Objective

Create a reusable Identity Presentation Layer and route production identity surfaces through it.

## Required Reading

- `docs/architecture/PHR-ARCH-007-cross-game-identity-ontology.md`
- `docs/architecture/PHR-ARCH-009-identity-presentation-layer.md`
- `docs/ARCHITECTURE.md`

## Implementation Requirements

- Create the four presentation modules specified by the work order.
- Translate Printing, Treatment, Finish, Market, and Condition consistently.
- Update Command Palette, Vendor results, Watchlist, and developer diagnostics.
- Audit Lorcast for Cold Foil misclassification.
- Add presentation regression tests.

## Constraints

- Do not change PHR-ARCH-007 canonical contracts.
- Do not infer finish from rarity, treatment, or prices.
- Do not add provider-specific logic to React components.
- Do not redesign workflows.

## Expected Architecture

Canonical records flow one-way through a pure adapter into presentation models. Developer diagnostics retain both sides of every translation.

## Testing Expectations

- Magic treatment and finish examples.
- Lorcana Enchanted and unavailable finish.
- Unknown-state translations.
- Cold Foil classification guard.
- UI build and lint validation.

## Documentation Updates

- Architecture, Atlas, Roadmap, Provider Documentation, Canonical Model, Identity Platform, Sprint History, testing, and release notes.

## Acceptance Criteria

- All PHR-ARCH-009 acceptance criteria pass without canonical-model changes.

## Non-Goals

- Canonical ontology changes.
- New provider connections.
- UI redesign.

## Notes For AI Coding Agents

- Preserve unrelated user changes.
- Keep edits scoped to presentation.
