# Collector Presentation Rules

## Feature ID

`PHR-UX-005`

## Title

Collector Terminology and Meaningful Identity Visibility

## Status

Completed

## Priority

High

## Category

UX, UI, Presentation

## Objective

Refine PHR-ARCH-009 so collector-facing identity surfaces show only meaningful Treatment and Printing information while canonical values remain intact for diagnostics.

## Background

PHR-ARCH-007 defines immutable canonical identity. PHR-ARCH-009 translates canonical concepts for collectors. Standard treatments and regular or unavailable physical finishes add visual noise without helping experienced collectors distinguish an item.

## Problem Statement

Production UI currently renders Treatment even when Standard and renders physical-finish availability even when Regular or Provider Does Not Supply. The presentation label Finish also differs from the collector vocabulary required by this work order.

## Proposed Solution

- Present `PrintingDesignFacet` as Treatment.
- Present `PhysicalFinish` as Printing.
- Present canonical `PrintingIdentity` location as Set so it cannot be confused with physical printing/finish.
- Add presentation visibility metadata rather than deleting or changing canonical values.
- Hide Treatment when its presentation value is Standard.
- Hide physical Printing when Regular, Normal, Nonfoil, or Provider Does Not Supply.
- Keep hidden values in developer diagnostics with a visibility reason.

## Functional Requirements

- Borderless/Foil displays Treatment: Borderless and Printing: Foil.
- Enchanted with unavailable physical finish displays Treatment: Enchanted only.
- Cold Foil without a special design facet displays Printing: Cold Foil only.
- Standard, Regular, Normal, Nonfoil, and Provider Does Not Supply do not render as production badges or inline identity facts.
- Set, collector number, language, and artwork remain visible.
- Developer mode retains canonical values and presentation visibility decisions.
- Apply consistently to Command Palette, Vendor results, and Watchlist.

## Non-Functional Requirements

### Performance

Visibility decisions remain pure synchronous presentation formatting.

### Scalability

Rules apply provider-neutrally to Magic, Lorcana, Pokémon, One Piece, and future games.

### Maintainability

Visibility rules exist only in the Identity Presentation Layer.

### Reliability

Hidden presentation values remain available in canonical records and diagnostics.

### Accessibility

Visible facts retain explicit Treatment and Printing labels.

### Offline Support

No provider access is required.

### Security

No security impact.

### Extensibility

Presentation fields expose visibility and reason metadata for future policies.

### Responsiveness

Removing low-information text reduces compact-layout noise.

## User Stories

- As a collector, I see only characteristics that distinguish the collectible.
- As a developer, I can still inspect why a canonical value was hidden.

## Acceptance Criteria

- Canonical ontology files are unchanged.
- Treatment is hidden for Standard.
- Printing is hidden for Regular, Normal, Nonfoil, and Provider Does Not Supply.
- Borderless Foil, Enchanted, and Cold Foil match the specified examples.
- Magic, Lorcana, Pokémon, and One Piece fixtures share the same presentation rules.

## Edge Cases

- Multiple meaningful treatments remain joined and visible.
- Multiple finishes display only meaningful distinct values.
- A mixture of Normal and Foil displays Foil only.
- Unknown remains the final fallback and is visible because it represents unresolved data.

## Dependencies

- PHR-ARCH-007 immutable canonical ontology.
- PHR-ARCH-009 Identity Presentation Layer.

## Future Enhancements

- Locale-specific collector vocabulary.
- Context-specific compact and expanded presentation policies.

## Technical Notes

Do not change provider mappings or canonical contracts. Add visibility policy to presentation fields only.

## UI / UX Notes

This is a terminology and density refinement, not a layout redesign.

## Success Metrics

- No production rendering of Standard Treatment or unavailable/regular Printing.

## Open Questions

- None.

## Traceability

- Originating work order: PHR-UX-005 Collector Presentation Rules.
- Related implementation prompt: `docs/prompts/PHR-UX-005-implementation-prompt.md`.
- Related tests: `tests/identity-presentation-layer.test.ts`.
- Related release notes: `docs/release-notes/PHR-UX-005.md`.
- Last modified: 2026-07-10.
- Modification reason: centralized terminology, visibility metadata, shared rendering, diagnostics, and validation completed.
