# Identity Fidelity and Treatment Model

## Feature ID

`PHR-ARCH-006`

## Title

Canonical Identity Fidelity, Treatment, and Completeness

## Status

Completed

Semantic refinement proposed by `PHR-ARCH-007`: rarity-derived Lorcast treatment is a current compatibility projection and must migrate to Printing design/rarity facets rather than authoritative Physical Variant finish.

## Priority

Critical

## Category

Architecture, Technical, API, UX

## Objective

Describe collectible identity with explicit physical treatment, provenance, completeness, and provider-field accountability before market reasoning.

## Background

The canonical `finish` string mixes provider finish variants, special printing styles, and missing-provider states. Lorcast currently emits `Unknown` because its documented card model has no dedicated finish field, even though reliable treatment information exists in documented rarity values.

## Problem Statement

Users see misleading unknown finish values, adapters do not expose completeness, and developer diagnostics cannot distinguish explicit, derived, inferred, unavailable, not-applicable, or pending identity states.

## Proposed Solution

Introduce canonical `IdentityTreatment`, field-state provenance, identity completeness metrics, and provider mapping audits. Keep legacy finish fields for compatibility while production surfaces consume treatment.

## Functional Requirements

- Treatment contains value, state, source, explanation, and confidence.
- Treatment states distinguish Explicit, Derived, Inferred, Unknown, Not Applicable, Provider Does Not Supply, and Pending Support.
- Canonical identity includes game, name, subtitle, printings, collector number, set/code, language, artwork, rarity, treatment, card type, provider identity, canonical identity, confidence, and TCGplayer ID.
- Every adapter exposes completeness for artwork, printing, collector number, treatment, language, and Market Not Applicable.
- Canonical results expose mapped, ignored, derived, and canonical field lists.
- Command Palette, Vendor results, printing results, and Watchlist display treatment rather than legacy finish.
- Magic remains compatible and derives treatment from existing explicit treatment/finish metadata.
- Lorcast derives Enchanted and Promo from documented rarity; other documented base rarities derive Standard.
- Lorcast never derives Cold Foil from prices.

## Lorcast Field Audit

| Provider field | Current state before PHR-ARCH-006 | PHR-ARCH-006 disposition |
|---|---|---|
| `id` | Mapped | Provider record identity |
| `name` | Mapped | Card name |
| `version` | Mapped | Canonical subtitle |
| `layout` | Mapped | Canonical layout metadata |
| `released_at` | Partially mapped | Release year derived; raw date remains provider-only |
| `image_uris.digital.small/normal/large` | Mapped | Canonical artwork |
| `cost` | Ignored | Future gameplay identity metadata |
| `inkwell` | Ignored | Future gameplay identity metadata |
| `ink` | Mapped | Canonical ink identity metadata |
| `type` | Mapped | Canonical card type |
| `classifications` | Partially mapped | Combined into card types; provider distinction retained only in raw diagnostics |
| `text` | Ignored | Future gameplay/rules identity metadata |
| `move_cost` | Ignored | Future location gameplay metadata |
| `strength` | Ignored | Future gameplay metadata |
| `willpower` | Ignored | Future gameplay metadata |
| `lore` | Ignored | Future gameplay metadata |
| `rarity` | Mapped | Canonical rarity and derived Treatment source |
| `illustrators` | Ignored | Future attribution metadata |
| `collector_number` | Mapped | Canonical collector number |
| `lang` | Mapped/derived | Canonical language name derived from provider code |
| `flavor_text` | Ignored | Future descriptive identity metadata |
| `tcgplayer_id` | Mapped | Canonical cross-provider identifier |
| `legalities.core` | Previously ignored | Canonical legality metadata |
| `set.id` | Previously ignored | Canonical provider set identity metadata |
| `set.code` | Mapped | Canonical set code |
| `set.name` | Mapped | Canonical set name/printing |
| `prices.usd` | Intentionally ignored | Market-only; prohibited from identity mapping |
| `prices.usd_foil` | Intentionally ignored | Market-only; prohibited from identity/treatment inference |

Derived fields: canonical identity, normalized rarity, language name, release year, product family, type line, provider confidence, treatment, treatment provenance, and completeness.

## Treatment Policy

- Lorcast rarity `Enchanted` → treatment `Enchanted`, state Derived, source `rarity`.
- Lorcast rarity `Promo` → treatment `Promo`, state Derived, source `rarity`.
- Other documented Lorcast rarities → treatment `Standard`, state Derived, source `rarity`.
- Cold Foil → Pending Support until an identity provider supplies an explicit reliable discriminator.
- Missing rarity → Unknown; no price-based inference.

## Non-Functional Requirements

### Performance

Completeness and treatment resolution are pure normalization-time calculations.

### Scalability

The treatment state model supports Magic, Lorcana, Pokémon, One Piece, and future providers without UI-specific rules.

### Maintainability

Adapters own provider mapping. UI consumes canonical treatment and completeness only.

### Reliability

Derived values retain source and confidence. Unknown is returned only when reliable determination is impossible.

### Accessibility

Treatment text replaces ambiguous unknown labels; diagnostics use readable field names and percentages.

### Offline Support

Treatment and completeness persist with canonical cached identity records.

### Security

No new provider or market request is introduced. Market values remain excluded.

### Extensibility

Completeness dimensions and treatment taxonomies can expand without replacing existing identity fields.

### Responsiveness

Presentation remains text-sized and compatible with existing compact rows.

## User Stories

- As a collector, I see Enchanted, Promo, Standard, Foil, or other reliable treatment instead of a generic Unknown.
- As a developer, I can audit which provider fields were mapped, ignored, or derived and how complete the identity is.

## Acceptance Criteria

- Five named Lorcana searches expose treatment, artwork, collector number, set, language, canonical identity, and completeness.
- No Lorcast canonical result presents legacy Unknown finish in treatment surfaces when rarity is present.
- Cold Foil is not fabricated.
- Magic search and selection remain operational.
- Market is Not Applicable in identity completeness and no market provider is added.

## Edge Cases

- Missing rarity produces Unknown with explicit missing-source explanation.
- Empty artwork reduces artwork completeness without failing identity.
- Mixed-printing identity completeness is calculated across printings.
- Existing persisted Watchlist finish migrates into treatment when canonical treatment is absent.

## Dependencies

- PHR-ARCH-004 Identity Platform.
- PHR-API-001 Lorcast Identity Provider.
- PHR-UX-003 capability-aware workflows.

## Future Enhancements

- Explicit Cold Foil provider mapping, richer Pokémon/One Piece treatment taxonomies, and provider-admin completeness thresholds.

## Technical Notes

Legacy `finish` remains a compatibility input for variant and market identity. `treatmentDetails` becomes the canonical collectible-identity concept.

## UI / UX Notes

Production UI displays treatment value. State/source/explanation appear in developer diagnostics, not primary labels.

## Success Metrics

- Zero misleading treatment Unknown values for documented-rarity Lorcast results.
- 100% field-audit accountability for the documented Lorcast card model.

## Open Questions

- Which approved provider will explicitly identify Lorcana Cold Foil variants?

## Traceability

- Originating work order: PHR-ARCH-006 Identity Fidelity.
- Related implementation prompt: `docs/prompts/PHR-ARCH-006-implementation-prompt.md`.
- Related tests: `tests/identity-fidelity.test.ts`, `tests/lorcast-identity-provider.test.ts`.
- Related release notes: `docs/release-notes/PHR-ARCH-006.md`.
- Last modified: 2026-07-10.
- Modification reason: Initial implementation.
