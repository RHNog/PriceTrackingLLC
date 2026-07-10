# Lightweight Watch History

## Feature ID

`PHR-UX-004`

## Title

Watch Lifecycle Metadata and Market Since Added

## Status

Completed

## Priority

High

## Category

UX, UI, Workflow, Technical

## Objective

Help users understand how a watch and its observed market value have evolved since the watchlist membership was created.

## Background

Market Watch currently stores current target and refresh state but not stable creation metadata or watch-owned observation history.

## Problem Statement

Users cannot answer when an asset was added, why it was added, how long it has been watched, or how current valuation compares with the valuation observed at watch creation.

## Proposed Solution

Add a compact `watchHistory` record to each membership. Capture creation metadata once, append only successful watch-time observations, calculate change independently from target price, render a lightweight SVG sparkline, and expose details through expandable rows/cards.

## Functional Requirements

- Store added timestamp, initial market valuation, initial observation source, optional reason, last successful refresh, refresh source, and watch-owned observations.
- Continue storing notes and last refresh on the entry.
- Derive date added, time added, watching duration, and current observation.
- Calculate absolute and percentage change from initial valuation independently of target difference.
- Append a successful observation when refresh produces a valuation.
- Do not append failed, skipped, or valuation-less refresh attempts.
- Render Rising, Falling, Volatile, Stable, or No Data sparkline state.
- Keep the default table compact and expand one row/card for details.
- Migrate existing entries once using their earliest available observation/refresh timestamp and current valuation as the initial watch observation.
- New identity-only entries retain null valuation and explicit capability messaging.

## Non-Functional Requirements

### Performance

Keep at most 32 watch-owned observations per membership. Render sparklines as small inline SVG without chart libraries.

### Scalability

History remains scoped by `watchlistId` and entry ID. It is not canonical market history.

### Maintainability

Pure helpers own initialization, append, duration, change, and trend calculations.

### Reliability

Migration is stable and persisted immediately. Initial valuation never changes after creation.

### Accessibility

Expand controls expose `aria-expanded`; sparklines have descriptive accessible labels; details use semantic labels.

### Offline Support

Metadata and details remain available from local storage.

### Security

No external writes or new provider requests are introduced.

### Extensibility

Watch-owned history can move to server persistence later without changing calculations or UI contracts.

### Responsiveness

Expanded details work in both desktop rows and mobile cards.

## User Stories

- As a collector, I can see how long I have watched a card and how its market value changed since addition.
- As a user, I can record why I added a watch and keep notes.

## Acceptance Criteria

- Existing and new entries have stable creation metadata.
- Market-since-added values use initial valuation, never target price.
- Successful refresh appends one bounded observation and updates last-successful metadata.
- Failed/skipped refresh does not alter successful history.
- Expanded details show every requested field.
- Sparkline communicates direction without a chart dependency or full history page.

## Edge Cases

- Null or zero initial valuation yields No Data percentage rather than division by zero.
- One observation renders Stable/insufficient movement.
- Invalid timestamps render No Data safely.
- Duplicate timestamp/value observations are not appended.
- Capability-pending market entries display Market Data Coming Soon.

## Dependencies

- PHR-WORKFLOW-001 Market Watch.
- PHR-UX-003 capability-aware workflows and membership CRUD.

## Future Enhancements

- Server-synchronized watch history, richer sampling policies, and full historical analytics in a separate approved feature.

## Technical Notes

Provider history predating the watch is intentionally excluded. This feature records watch lifecycle observations, not the market repository’s full history.

## UI / UX Notes

Use a disclosure control, compact two-column details, signed change formatting, human duration, and a restrained 112×28 SVG sparkline.

## Success Metrics

- Every membership answers Added, Watching For, and Market Since Added where evidence exists.
- No full chart or analytics route is introduced.

## Open Questions

- Future persistence may define observation sampling beyond explicit successful refreshes.

## Traceability

- Originating work order: Watch History.
- Related implementation prompt: `docs/prompts/PHR-UX-004-implementation-prompt.md`.
- Related tests: `tests/watch-history.test.ts`.
- Related release notes: `docs/release-notes/PHR-UX-004.md`.
- Last modified: 2026-07-10.
- Modification reason: Initial implementation.
