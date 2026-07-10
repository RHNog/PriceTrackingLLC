# PHR-WORKFLOW-001 Implementation Prompt

## Project Context

Project Phronesis is the internal engineering initiative responsible for developing an evidence-driven decision intelligence platform for collectible markets.

Documentation is part of implementation. Follow the originating feature specification before changing code.

## Feature ID

`PHR-WORKFLOW-001`

## Objective

Implement the Market Watch MVP as the first production-ready daily workflow for tracking assets against target selling prices while conserving provider requests.

## Required Reading

- `FOUNDATION/FOUNDATION_INDEX.md`
- `docs/ARCHITECTURE.md`
- `docs/workflows/PHR-WORKFLOW-001-market-watch-mvp.md`
- `lib/market/MarketRefreshScheduler.ts`
- `lib/market/MarketIntelligenceRepository.ts`
- `app/api/market/snapshot/route.ts`

## Implementation Requirements

- Create `features/watchlist/` with workspace, table, card, toolbar, storage, and refresh engine modules.
- Display asset identity, printing, finish, condition, language, current valuation, target, difference, percent to target, market trend, last observation, last refresh, status, and observation source.
- Seed Mox Opal, Lightning Bolt, Collected Company, and one Lorcana example.
- Do not refresh automatically on page load.
- Refresh exactly one entry when the user clicks refresh.
- Use the existing market snapshot API so repository-first refresh behavior remains centralized.
- Display developer diagnostics only behind a developer-mode toggle.
- Track a 100 provider-request budget and avoid unnecessary provider calls.

## Constraints

- Do not modify Assessment, Strategy, Negotiation, Decision, Market Intelligence, Replay, or Repository behavior.
- Do not build notifications, SMS, email, Discord, automation, charts, or analytics dashboards.
- Do not refresh the entire watchlist automatically.
- Do not expose provider credentials in client code.

## Expected Architecture

```text
Watchlist Workspace
  -> Watchlist Storage
  -> Watchlist Refresh Engine
  -> Market Snapshot API
  -> Market Refresh Scheduler
  -> Repository first
  -> Provider only if scheduler determines evidence is missing or stale
```

## Testing Expectations

- Run lint.
- Verify initial load uses seeded/local storage data without API calls.
- Verify manual refresh targets one entry.
- Verify developer diagnostics expose repository hit, provider hit, replay, cache age, observation age, and API saved.
- Verify no notifications, charts, or background refreshes were introduced.

## Documentation Updates

- `docs/workflows/PHR-WORKFLOW-001-market-watch-mvp.md`
- `docs/testing/PHR-WORKFLOW-001-market-watch-validation.md`
- `docs/release-notes/PHR-WORKFLOW-001.md`
- `docs/FEATURE_REGISTRY.md`
- `docs/ATLAS.md`
- `docs/ROADMAP.md`
- `docs/SPRINT_HISTORY.md`

## Acceptance Criteria

- Market Watch is available from `/watchlists`.
- The dashboard loads and displays the required model fields.
- Manual refresh preserves repository-first behavior through the existing API.
- Developer diagnostics explain request economy behavior.

## Non-Goals

- Server-side watchlist persistence.
- Bulk refresh.
- Alerts or notifications.
- Charts.
- Market engine redesign.

## Notes For AI Coding Agents

- Preserve unrelated user changes.
- Keep edits scoped to Market Watch workflow and required documentation.
- Present future improvements separately from implemented changes.
