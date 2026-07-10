# PHR-ARCH-006 Implementation Prompt

## Project Context

Identity describes what a collectible is; market describes what it is worth. Provider-specific fields normalize behind PHR-ARCH-004.

## Feature ID

`PHR-ARCH-006`

## Objective

Add canonical treatment, mapping audit, identity completeness, and fidelity diagnostics without market changes.

## Required Reading

- `docs/architecture/PHR-ARCH-006-identity-fidelity-treatment-model.md`
- `docs/architecture/PHR-ARCH-004-identity-platform.md`
- `docs/api/PHR-API-001-lorcast-identity-provider.md`
- Lorcast API overview, Card Model, Images, and Search Syntax documentation.

## Implementation Requirements

- Add treatment state/provenance and completeness contracts.
- Audit and expand Lorcast raw types/mapping.
- Derive reliable Lorcast treatment from rarity only.
- Keep Cold Foil pending and price fields excluded.
- Expose audit/completeness in canonical results and developer diagnostics.
- Replace production finish labels with treatment labels across picker and Watchlist.

## Constraints

- No market provider or price inference.
- No provider-specific logic in UI.
- Preserve legacy finish for compatibility.
- Preserve Magic behavior.

## Expected Architecture

Provider raw record → provider normalizer/audit → canonical printing with treatment → canonical identity adapter/completeness → provider-agnostic UI.

## Testing Expectations

- Test treatment derivation, missing rarity, price exclusion, completeness, audit lists, five Lorcana identities, and Magic regression.
- Run ESLint, build, boundary scans, and live local API validation.

## Documentation Updates

- Registry, Architecture, Atlas, Capability Matrix, Provider Registry, Roadmap, Sprint History, Prompt History, validation, and release notes.

## Acceptance Criteria

- All PHR-ARCH-006 acceptance criteria pass.

## Non-Goals

- Market pricing, full gameplay model, provider connection, or Cold Foil inference without explicit evidence.

## Notes For AI Coding Agents

- Preserve all unrelated and prior working-tree changes.
