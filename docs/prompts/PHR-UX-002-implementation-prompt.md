# PHR-UX-002 Implementation Prompt

## Project Context

Project Phronesis Platform v1.0 separates identity, eligibility, provider-market acquisition, repository, and workflow business logic. Documentation precedes implementation.

## Feature ID

`PHR-UX-002`

## Objective

Connect the existing Universal Asset Picker to the global shell through a context-aware command palette.

## Required Reading

- `docs/ux/PHR-UX-002-global-command-palette.md`
- `docs/releases/Platform-v1.0.md`
- `docs/ui/PHR-UI-001-asset-visual-identity.md`
- `docs/workflows/PHR-WORKFLOW-001-market-watch-mvp.md`

## Implementation Requirements

- Replace passive topbar search with the global palette trigger.
- Reuse identity API, Eligibility Engine, printing data, condition profiles, and CardThumbnail.
- Implement debounce, cancellation, loading, empty, error, and keyboard states.
- Route completed typed selections to workflow-owned boundaries.
- Preserve future mode and context extension points.

## Constraints

- Do not create a search engine.
- Do not call JustTCG or market snapshot APIs while searching.
- Do not place watchlist or evaluation business logic in the palette.

## Expected Architecture

Topbar opens CommandPalette; CommandPalette orchestrates identity and eligibility; CommandPaletteRouter converts a completed selection into a workflow event or URL; the destination workflow owns mutation and downstream acquisition.

## Testing Expectations

- Unit-test context labels, URL routing, and finish normalization.
- Run ESLint, command-palette tests, and production build.
- Manually verify keyboard behavior and network request economy.

## Documentation Updates

- Registry, Atlas, Roadmap, Sprint History, Prompt History, validation, and release note.

## Acceptance Criteria

- All PHR-UX-002 acceptance criteria pass.

## Non-Goals

- Future search modes, new providers, market acquisition, inventory, or collection workflows.

## Notes For AI Coding Agents

- Preserve PHR-UI-001 working-tree changes and unrelated user changes.
