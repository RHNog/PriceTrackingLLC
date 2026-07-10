# Identity Presentation Layer

## Feature ID

`PHR-ARCH-009`

## Title

Collector-Facing Identity Presentation Ontology

## Status

Completed

## Priority

High

## Category

Architecture, Technical, UI, UX

## Objective

Translate the immutable PHR-ARCH-007 Canonical Collectible Ontology into familiar collector terminology without changing canonical identity meaning or provider mappings.

## Background

The canonical ontology deliberately uses precise terms such as Printing Identity, Printing Design Facet, Physical Finish, Market Observation, and Inventory Instance. These terms support correct system reasoning but are unnecessarily technical for collector workflows.

The work order references PHR-ARCH-008, but no PHR-ARCH-008 specification exists in the workspace as of 2026-07-10. PHR-ARCH-007 and this work order therefore define the available authoritative boundary.

## Problem Statement

Current UI surfaces expose labels such as Design and Physical Finish. Collectors expect Printing, Treatment, Finish, Market, and Condition. Renaming canonical concepts inside the domain model would damage the ontology; formatting them ad hoc in components would duplicate semantic logic.

## Proposed Solution

Introduce a pure Identity Presentation Layer:

```text
Canonical Collectible Ontology
  -> IdentityPresentationAdapter
  -> IdentityPresentationModel
  -> Collector UI

Canonical + Presentation
  -> IdentityPresentationDiagnostics
  -> Developer UI
```

## Canonical-to-Presentation Mapping

| Canonical concept | Collector label |
|---|---|
| GameplayIdentity name | Card Name |
| PrintingIdentity | Set |
| PrintingDesignFacet | Treatment |
| PhysicalFinish | Printing |
| MarketObservation | Market |
| InventoryInstance condition | Condition |

PHR-UX-005 refined the original vocabulary and visibility: Physical Finish presents as Printing, canonical Printing Identity location presents as Set, Standard Treatment is hidden, and Regular/provider-unavailable Printing is hidden. Canonical and diagnostic values remain unchanged.

## Functional Requirements

- Create `IdentityPresentationModel`, `IdentityPresentationAdapter`, `IdentityPresentationFormatter`, and `IdentityPresentationDiagnostics`.
- Keep all PHR-ARCH-007 contracts immutable.
- Present printing as set and collector number.
- Present printing-design facets as Treatment.
- Present physical finish as Finish.
- Translate unresolved states into Provider Does Not Supply, Pending Provider Support, or Not Applicable before falling back to Unknown.
- Update Command Palette, Vendor results, and Watchlist without redesigning workflows.
- Preserve canonical developer diagnostics and add canonical-to-presentation translation diagnostics.
- Keep provider-specific rules outside React components.

## Lorcast Mapping Audit

- Lorcast `rarity=Enchanted`, `Promo`, and `Iconic` map only to Printing Design Facets.
- Lorcast exposes no explicit Cold Foil field in the normalized identity payload.
- Lorcast Physical Finish remains Provider Does Not Supply.
- `prices.usd_foil` remains ignored and cannot establish Cold Foil.
- No Cold Foil correction is required in the current Lorcast adapter because it is not mapped into Printing Design Facets or Physical Finish.

## Scryfall Mapping Refinement

- `border_color=borderless`, supported frame effects, `full_art`, and non-manufacturing promo types map to Printing Design Facets and present as Treatment.
- Explicit foil-process promo tags such as Galaxy Foil and Confetti Foil refine Physical Finish and never appear as Treatment.
- Generic frame effects such as `legendary` are not collector treatments and are excluded from presentation facets.

## Non-Functional Requirements

### Performance

Presentation translation is synchronous, pure, and allocation-bounded per displayed record.

### Scalability

The presentation vocabulary supports Magic, Lorcana, Pokémon, One Piece, Flesh and Blood, and future games without changing canonical contracts.

### Maintainability

React components consume presentation models and never rename ontology concepts independently.

### Reliability

Presentation never invents canonical facts. It may improve labels but preserves canonical resolution state and provenance.

### Accessibility

Labels use explicit text and do not depend on icons or color.

### Offline Support

Translation requires no provider or network access.

### Security

Presentation values are plain normalized strings from canonical records.

### Extensibility

Presentation diagnostics retain both canonical and collector-facing values.

### Responsiveness

Existing compact result and watchlist layouts remain intact.

## User Stories

- As a collector, I see Treatment and Finish rather than ontology vocabulary.
- As a developer, I can inspect exactly how each canonical field was translated.

## Acceptance Criteria

- No production identity surface labels Printing Design as Design.
- No production identity surface labels Physical Finish as Physical Finish.
- Enchanted appears under Treatment.
- Cold Foil can appear only under Finish when explicit provider evidence exists.
- Lorcast missing finish displays Provider Does Not Supply.
- Developer diagnostics show canonical and presentation values.
- PHR-ARCH-007 ontology contracts remain unchanged.

## Edge Cases

- No printing-design facets: Treatment displays Standard.
- Multiple printing-design facets: values are joined without losing individual canonical facets.
- Multiple physical finishes: Finish lists unique values.
- Pending provider mapping: Pending Provider Support.
- Missing market observation: No Market Data.
- Missing condition: Not Selected or Not Applicable according to context.

## Dependencies

- PHR-ARCH-007 Canonical Collectible Ontology.
- PHR-ARCH-008 referenced by the work order but absent from the workspace.
- PHR-UX-002 Command Palette.
- PHR-WORKFLOW-001 Market Watch.

## Future Enhancements

- Locale-specific presentation vocabulary.
- Collector-configurable treatment and finish aliases.
- Presentation models for graded and serialized collectibles.

## Technical Notes

The presentation layer imports canonical types. Canonical engines and provider adapters never import presentation types.

## UI / UX Notes

This is a terminology correction, not a layout redesign.

## Success Metrics

- Zero duplicated Treatment/Finish label resolution in production components.
- Zero canonical ontology mutations.

## Open Questions

- Locate or recreate PHR-ARCH-008 if it contains additional constraints not included in the work order.

## Traceability

- Originating work order: Identity Presentation Layer migration.
- Related implementation prompt: `docs/prompts/PHR-ARCH-009-implementation-prompt.md`.
- Related tests: `tests/identity-presentation-layer.test.ts`.
- Related release notes: `docs/release-notes/PHR-ARCH-009.md`.
- Last modified: 2026-07-10.
- Modification reason: presentation adapter, formatter, diagnostics, UI adoption, and validation completed.
