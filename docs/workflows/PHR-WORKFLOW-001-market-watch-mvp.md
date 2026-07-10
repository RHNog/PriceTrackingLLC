# PHR-WORKFLOW-001: Market Watch MVP

## Feature ID

`PHR-WORKFLOW-001`

## Title

Market Watch MVP

## Status

Completed

## Priority

High

## Category

Workflow, UI, Technical, Testing, Roadmap, Release Notes

## Objective

Create the first daily-use Market Watch workflow for tracking asset valuations against user-defined target selling prices.

## Background

Project Phronesis separates observation acquisition from reasoning and business judgment. Market Watch applies that philosophy to a daily workflow: users monitor known assets, compare current repository evidence to a target price, and request a new provider observation only when the request is justified.

## Problem Statement

The previous watchlist surface represented broad strategy buckets. It did not provide a production-grade daily workspace for individual assets, target price tracking, repository reuse, refresh priority, or developer-visible request economy diagnostics.

## Proposed Solution

Add a `features/watchlist/` workflow module that owns Market Watch presentation, persistence, target math, refresh priority, and single-entry manual refresh behavior. The workflow uses the existing market snapshot API, which already routes through `MarketRefreshScheduler` and the Market Intelligence Repository.

## Functional Requirements

- Display watchlist entries with asset identity, printing, finish, condition, language, target price, current valuation, difference, percent to target, market trend, last observation, last refresh, refresh status, and observation source.
- Compute target progress as current valuation divided by target selling price.
- Compute difference as current valuation minus target price.
- Use repository evidence first by relying on the existing market snapshot API and scheduler.
- Never refresh the full watchlist automatically.
- Allow manual refresh for one entry at a time.
- Track refresh priority using manual refresh, target proximity, observation age, and recent refresh state.
- Assume a 100 provider-request budget and surface remaining budget in the workspace.
- Hide developer diagnostics unless developer mode is enabled.
- Preserve replay compatibility by treating replay responses as provider-shaped observations without changing replay infrastructure.

## Non-Functional Requirements

### Performance

Initial page load must not issue provider requests. Manual refresh must target exactly one asset.

### Scalability

The workflow keeps provider-request prioritization independent from UI rendering so later storage and scheduling backends can reuse it.

### Maintainability

Refresh math, target math, diagnostics, and storage are isolated in `features/watchlist/`.

### Reliability

Refresh failures are captured on the affected row and do not break the workspace.

### Accessibility

The dashboard uses semantic tables on desktop, buttons for actions, and readable status labels.

### Offline Support

Seed and persisted entries load from local browser storage. Provider refresh requires network and the existing API route.

### Security

No provider credentials are exposed to the client. The client calls the application API route only.

### Extensibility

Future alerts, charts, bulk refresh, and persisted server storage can be added without changing market engines.

### Responsiveness

Desktop uses an information-dense table. Mobile uses compact cards.

## User Stories

- As a seller, I want to track a card against my desired selling price so I can know when it is near my target.
- As an operator, I want the repository reused before provider calls so daily monitoring does not burn limited API quota.
- As a developer, I want diagnostics showing repository hit, provider hit, replay, cache age, observation age, and API saved.

## Acceptance Criteria

- Market Watch loads with Mox Opal, Lightning Bolt, Collected Company, and a Lorcana example.
- No provider request occurs on initial load.
- Manual refresh calls one entry only.
- Repository-backed responses show repository reuse diagnostics.
- Provider-backed responses show provider-hit diagnostics.
- Replay-backed responses can be displayed as replay observations.
- The watchlist page remains clean and information-dense.

## Edge Cases

- Unknown valuation displays as unknown and does not produce invalid target math.
- Failed refresh remains row-local and records the error message.
- Missing printing or variant identifiers rely on the market snapshot API's existing error response.
- Recently refreshed entries receive lower refresh priority unless manually refreshed.

## Dependencies

- `app/api/market/snapshot/route.ts`
- `lib/market/MarketRefreshScheduler.ts`
- `lib/market/MarketIntelligenceRepository.ts`
- `lib/providers/replay/`

## Future Enhancements

- Persist watchlist entries server-side.
- Add user-created entries.
- Add alerts and notification channels.
- Add historical trend charts.
- Add batch refresh with budget-aware scheduling.

## Technical Notes

Market Watch is a workflow implementation, not a market engine. It does not modify Repository, Replay, Assessment, Strategy, Negotiation, Decision, or Market Intelligence. It calls the existing market snapshot API for manual refresh, and that API preserves repository-first behavior.

## UI / UX Notes

The dashboard prioritizes scan speed: card, printing, current price, target, difference, trend, last updated, status, and refresh action. Developer diagnostics are opt-in.

## Success Metrics

- Initial workspace load performs zero provider requests.
- Manual refresh produces at most one market snapshot request.
- Developer diagnostics explain whether API quota was saved.

## Open Questions

- What persistent user storage should replace local browser storage?
- Which provider should own Lorcana market observations when connected?

## Traceability

### PHR-UX-003 Enhancement

Market Watch entries now support complete membership Create/View/Edit/Remove, confirmation, persisted removal, and undo. Membership is scoped by `watchlistId`. Capability resolution prevents market acquisition for games without an operational market provider and replaces misleading zero/unknown presentation with explicit capability explanations.

Removal never deletes canonical identity, repository observations, replay fixtures, or market history.

### PHR-UX-004 Enhancement

Each membership now stores stable creation metadata and a bounded series of successful observations captured during the watch. Expanded details show watch age, refresh metadata, notes/reason, current observation, market change since addition, and a lightweight sparkline. Target difference remains a separate calculation.

- Originating prompt or work order: Sprint 36 Market Watch workflow.
- Related implementation prompt: `docs/prompts/PHR-WORKFLOW-001-implementation-prompt.md`
- Related tests: `docs/testing/PHR-WORKFLOW-001-market-watch-validation.md`
- Related release notes: `docs/release-notes/PHR-WORKFLOW-001.md`
- Last modified: 2026-07-09
- Modification reason: Initial Market Watch MVP implementation.
