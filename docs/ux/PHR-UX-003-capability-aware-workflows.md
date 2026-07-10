# Capability-Aware Workflows and Watchlist Entry Lifecycle

## Feature ID

`PHR-UX-003`

## Title

Capability-Aware Workflows and Complete Market Watch Entry Lifecycle

## Status

Completed

## Priority

High

## Category

UX, UI, Workflow, Technical

## Objective

Complete Create/View/Edit/Remove for Market Watch membership while giving every collectible game explicit, reusable workflow capability states.

## Background

Market Watch can create and view entries but cannot edit or remove them. It also treats missing market providers like failed or unknown data, which is misleading for identity-only games such as Lorcana.

## Problem Statement

Users cannot manage the full entry lifecycle and cannot distinguish unknown data from unsupported, unavailable, pending, disabled, or not-applicable capabilities. Lorcana entries may expose stale seed values, `Unknown`, or a refresh action even though no compatible market provider exists.

## Proposed Solution

Create a platform capability registry/resolver, shared status badge, and reusable `CapabilityCard`. Resolve each entry by game before formatting values or refreshing. Add scoped watchlist membership IDs, an overflow entry menu, edit dialog, removal confirmation, persisted removal, and timed undo restoration.

## Functional Requirements

- Create remains owned by the Command Palette/Market Watch event boundary.
- View remains the responsive Market Watch table/card presentation.
- Edit supports target price and notes without replacing identity or evidence.
- Remove is available through a subtle overflow menu.
- Removal requires a confirmation dialog naming the asset.
- Removal updates current UI and local storage immediately.
- Undo restores the exact prior entry and position during the toast lifetime.
- Membership removal is scoped by `watchlistId` and never deletes canonical identity, repository observations, replay fixtures, or market history.
- Capability names include Identity, Artwork, Printings, Finish, Condition, Market Data, Market Intelligence, Portfolio, Inventory, Watchlists, Purchase Evaluation, and Developer Diagnostics.
- Capability states are Operational, Pending, Unavailable, Not Applicable, or Disabled.
- Shared status presentation additionally supports Coming Soon, Repository, Replay, and Provider labels.
- Magic identity and market capabilities are Operational.
- Lorcana identity/artwork/printings are Operational; finish is provider-unavailable; market and market intelligence are Pending.
- Market Watch never formats missing market data as `$0.00`.
- Market refresh is disabled and never requested when market capability is not Operational.
- Unknown finish is replaced with a precise capability explanation.
- Developer mode shows source, provider, resolution, selected provider, reason, and future provider.

## Non-Functional Requirements

### Performance

Capability resolution is synchronous registry lookup. CRUD mutations update local state and storage once.

### Scalability

`watchlistId` scopes membership for future multiple-watchlist support. Capability records are keyed by game and reusable across modules.

### Maintainability

Formatting and refresh guards share the same capability resolver. UI does not infer provider support.

### Reliability

Undo restores the removed immutable entry snapshot and original index. Storage parse/migration preserves older entries by assigning the default watchlist.

### Accessibility

Menus, dialogs, status labels, disabled reasons, toast status, and form controls are keyboard accessible and explicitly labelled.

### Offline Support

CRUD and undo operate against local storage without network access.

### Security

No external mutations or destructive repository APIs are introduced.

### Extensibility

CapabilityCard accepts filtered capability records; future Inventory, Collection, Portfolio, Vendor Workspace, and Purchase Evaluation surfaces can reuse it.

### Responsiveness

Overflow actions, dialogs, capability summaries, and undo work on desktop and mobile cards.

## User Stories

- As a collector, I can edit or remove a watched asset and undo an accidental removal.
- As a Lorcana user, I understand that identity works while compatible market pricing is coming later.
- As a developer, I can inspect how a capability was resolved and which provider is expected.

## Acceptance Criteria

- Single removal, persisted reload, and undo restoration work.
- Editing target/notes persists without changing identity or evidence.
- Removing from the default watchlist changes only that membership.
- No deletion call targets identity, repository, replay, or history modules.
- Lorcana shows operational identity/artwork, pending market provider, no `$0.00`, no misleading Unknown finish, and no executable refresh.
- Magic retains operational refresh behavior.
- Shared CapabilityCard and StatusBadge are used by Market Watch.

## Edge Cases

- Removing while refresh is active clears the entry-specific loading state and ignores later stale UI ownership.
- Undo after another mutation inserts at the bounded original position unless the membership already exists.
- Older persisted entries without `watchlistId` migrate to `default`.
- Invalid edit values do not save.
- Repeated remove confirmation cannot delete a different entry.

## Dependencies

- PHR-WORKFLOW-001 Market Watch.
- PHR-ARCH-004 Identity Platform.
- PHR-API-001 Lorcast Identity Provider.
- Existing Market Ontology and Repository boundaries.

## Future Enhancements

- Multiple named watchlists, move/copy membership, server persistence, and multi-selection removal.
- Capability registry populated dynamically from provider administration.

## Technical Notes

Capabilities describe workflow availability, not evidence values. A Pending market capability prevents acquisition. Removal calls only the membership storage boundary.

## UI / UX Notes

Use a row-hover ellipsis, compact professional dialog, short-lived undo toast, calm capability card, and concise status labels. Destructive emphasis appears only inside confirmation.

## Success Metrics

- Zero market requests for Lorcana entries.
- Zero `$0.00` placeholders for unavailable market data.
- Complete watchlist membership CRUD without reload.

## Open Questions

- Future provider administration will determine whether capability declarations become runtime-configured.

## Traceability

- Originating work order: PHR-UX-003.
- Related implementation prompt: `docs/prompts/PHR-UX-003-implementation-prompt.md`.
- Related tests: `tests/platform-capabilities.test.ts`, `tests/watchlist-entry-lifecycle.test.ts`.
- Related release notes: `docs/release-notes/PHR-UX-003.md`.
- Last modified: 2026-07-10.
- Modification reason: Initial implementation.
