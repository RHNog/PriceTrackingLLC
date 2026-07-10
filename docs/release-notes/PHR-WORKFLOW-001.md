# PHR-WORKFLOW-001 Release Note

## Summary

Sprint 36 introduces Market Watch MVP, the first production-ready daily workflow for monitoring individual collectible assets against target selling prices.

## Added

- `features/watchlist/WatchlistWorkspace.tsx`
- `features/watchlist/WatchlistCard.tsx`
- `features/watchlist/WatchlistTable.tsx`
- `features/watchlist/WatchlistToolbar.tsx`
- `features/watchlist/WatchlistStorage.ts`
- `features/watchlist/WatchlistRefreshEngine.ts`

## Behavior

- `/watchlists` now opens the Market Watch workspace.
- Initial load uses seeded or locally persisted entries.
- Manual refresh targets one entry only.
- Refresh requests use the existing market snapshot API and preserve repository-first scheduling.
- Developer mode displays repository hit, provider hit, replay, cache age, observation age, API saved, and provider-request justification.

## Seeded Examples

- Mox Opal.
- Lightning Bolt.
- Collected Company.
- Elsa - Spirit of Winter as the Lorcana example.

## Non-Goals Preserved

- No alerts.
- No notifications.
- No charts.
- No bulk refresh.
- No Repository, Replay, Assessment, Strategy, Negotiation, Decision, or Market Intelligence redesign.

## Validation

- `npm run lint`

## Traceability

- Specification: `docs/workflows/PHR-WORKFLOW-001-market-watch-mvp.md`
- Implementation prompt: `docs/prompts/PHR-WORKFLOW-001-implementation-prompt.md`
- Validation: `docs/testing/PHR-WORKFLOW-001-market-watch-validation.md`
