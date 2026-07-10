# PHR-UX-004 Implementation Prompt

## Project Context

Watchlist membership is user-owned workflow state, separate from canonical identity and repository market history.

## Feature ID

`PHR-UX-004`

## Objective

Add lightweight watch lifecycle metadata, market-since-added calculation, sparkline, and expandable details.

## Required Reading

- `docs/ux/PHR-UX-004-watch-history.md`
- `docs/ux/PHR-UX-003-capability-aware-workflows.md`
- `docs/workflows/PHR-WORKFLOW-001-market-watch-mvp.md`

## Implementation Requirements

- Add bounded watch metadata and observation helpers.
- Initialize/migrate and persist stable creation state.
- Update successful refresh paths only.
- Add lightweight accessible sparkline and expanded watch details.
- Extend edit UI with reason added.

## Constraints

- Do not build analytics, a full chart, or a history page.
- Do not import provider history from before watch creation.
- Do not conflate target difference with market-since-added change.
- Preserve capability-aware no-market behavior.

## Expected Architecture

WatchlistStorage initializes membership history; WatchlistRefreshEngine appends successful observations; pure WatchHistory helpers calculate presentation; shared feature components render details.

## Testing Expectations

- Test initialization, stable migration, bounded append, duplicate suppression, duration, signed change, and trend classification.
- Run ESLint, TypeScript/production build, and `git diff --check`.

## Documentation Updates

- Registry, Atlas, Architecture, Roadmap, Sprint History, Prompt History, workflow, testing, and release notes.

## Acceptance Criteria

- All PHR-UX-004 acceptance criteria pass.

## Non-Goals

- Full market history, analytics, forecasting, provider refresh expansion, or new routes.

## Notes For AI Coding Agents

- Preserve unrelated and prior feature changes.
