# Global Command Palette

## Feature ID

`PHR-UX-002`

## Title

Global Command Palette and Universal Asset Picker Orchestration

## Status

Completed

## Priority

High

## Category

UX, UI, Workflow

## Objective

Replace the passive global search field with a keyboard-first command palette that orchestrates the existing identity, eligibility, printing, finish, condition, and workflow boundaries.

## Background

Platform v1.0 already contains the Universal Asset Picker flow in Vendor Workspace. The application shell search field is passive, which prevents it from serving as the platform-wide entry point.

## Problem Statement

Users must navigate to a workflow before identifying an asset. A second search implementation would duplicate identity behavior and violate the existing architecture.

## Proposed Solution

Add a shell-owned Cards-mode command palette. It invokes the existing identity search API after a short debounce, filters through the Eligibility Engine, and progresses through identity, printing, finish, and condition. A separate workflow routing boundary receives the completed selection: Market Watch handles addition; Vendor Workspace receives URL selection intent. The palette owns no pricing, watchlist, evaluation, or provider-market logic.

## Functional Requirements

- Open from the shell trigger, Command-K, or Control-K.
- Search immediately after a short debounce without a submit button.
- Use `/api/identity/search` and `filterIdentityResultsForVendorWorkflow`.
- Show artwork, card, game, set, collector number, finish availability, and confidence.
- Support identity, printing, finish, and condition steps.
- Route the completed selection according to shell workflow context.
- Support Escape, Enter, Arrow Up/Down, and Tab.
- Show loading skeletons and the exact no-result message “No matching collectible found.”
- Current mode is Cards; future mode types include Watchlists, Collections, Inventory, Commands, and Settings.
- Never call the market snapshot endpoint or JustTCG while searching.

## Non-Functional Requirements

### Performance

Debounce input by approximately 200 milliseconds, abort superseded requests, lazy-load canonical thumbnails, and avoid blocking transitions.

### Scalability

Search modes and workflow actions use typed registries so future modes and destinations do not change palette hierarchy.

### Maintainability

Identity and eligibility remain engine-owned. Workflow modules own final business actions.

### Reliability

Stale requests are aborted; errors produce a recoverable refine-search state.

### Accessibility

Use dialog, combobox, listbox, option, live status, focus management, visible focus, and labelled controls.

### Offline Support

No new offline identity repository is introduced. Cached artwork remains governed by PHR-UI-001.

### Security

Queries are URL encoded and no raw provider response is rendered.

### Extensibility

Mode and workflow-context unions reserve future platform destinations.

### Responsiveness

The centered palette fits desktop and mobile viewports with scrollable results.

## User Stories

- As the founder, I can press Command-K, select an asset variant, and enter the current workflow in under 15 seconds.
- As a developer, I can inspect identity, eligibility, confidence, and image/cache provenance without market requests.

## Acceptance Criteria

- Global trigger reads “Search anything…” and displays the platform shortcut.
- Search invokes existing identity and eligibility paths only.
- Every result uses `CardThumbnail`.
- Keyboard-only selection reaches the context action.
- Market Watch action adds through the watchlist workspace boundary.
- Vendor action opens Vendor Workspace with selection intent.
- Empty and loading states are never blank.

## Edge Cases

- Queries shorter than two characters show refinement guidance.
- Results without eligible printings are removed by the Eligibility Engine.
- Printings without finish variants derive finish availability from normalized printing data.
- Closing or changing query clears dependent selections.
- Failed identity requests do not close or freeze the palette.

## Dependencies

- `PHR-UI-001` canonical asset visual identity.
- Platform v1.0 Identity and Eligibility engines.
- Vendor Workflow Machine and Market Watch storage boundary.

## Future Enhancements

- Watchlists, Collections, Inventory, Commands, and Settings modes.
- Repository-backed identity index and recent searches.
- Global developer-mode setting.

## Technical Notes

The palette uses the identity API already consumed by Vendor Workspace. Final selections are expressed as a typed workflow selection. The shell routes; workflow consumers mutate their own state.

## UI / UX Notes

Use a calm Spotlight-style overlay, dense rows, limited cyan focus accents, stable artwork dimensions, breadcrumb-like step labels, and concise shortcut hints.

## Success Metrics

- Keyboard-to-action flow can complete in fewer than 15 seconds under normal identity latency.
- Zero JustTCG or market snapshot requests before explicit workflow continuation.
- One global canonical interaction entry point.

## Open Questions

- A future identity repository may define repository/replay diagnostics more precisely than the current identity provider response.

## Traceability

- Originating work order: PHR-UX-002 Global Command Palette.
- Related implementation prompt: `docs/prompts/PHR-UX-002-implementation-prompt.md`.
- Related tests: `tests/command-palette.test.ts`.
- Related release notes: `docs/release-notes/PHR-UX-002.md`.
- Last modified: 2026-07-09.
- Modification reason: Initial specification and implementation.
