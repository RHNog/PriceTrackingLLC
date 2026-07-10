# PHR-WORKFLOW-001 Market Watch Validation

## Feature ID

`PHR-WORKFLOW-001`

## Validation Scope

Market Watch MVP, request economy behavior, repository-first refresh path, seeded examples, and developer diagnostics.

## Automated Verification

- `npm run lint`

## Manual Verification Checklist

- Open `/watchlists`.
- Confirm the page loads without triggering an automatic refresh.
- Confirm entries exist for Mox Opal, Lightning Bolt, Collected Company, and Elsa - Spirit of Winter.
- Confirm each row displays card, printing, current price, target, difference, trend, last updated, status, and refresh button.
- Enable developer diagnostics.
- Confirm diagnostics show repository hit, provider hit, replay, cache age, observation age, and API saved fields.
- Refresh Mox Opal manually.
- Confirm only the Mox Opal row enters refreshing state.
- Confirm scheduler diagnostics indicate whether the result came from Repository, RepositoryStale, or Provider.
- Confirm provider requests are counted only when a provider was actually queried.
- Confirm replay-compatible responses display as replay observations when replay metadata is present.

## Request Economy Expectations

- Initial load: zero provider requests.
- Manual refresh: one API route request for the selected entry.
- Repository fresh: provider request saved.
- Repository stale or missing: scheduler may query an eligible provider.
- Replay mode: live provider request should be skipped by replay infrastructure when an exact fixture is available.

## Regression Boundaries

- Repository behavior must remain unchanged.
- Replay behavior must remain unchanged.
- Assessment, Strategy, Negotiation, Decision, and Market Intelligence behavior must remain unchanged.
- No notifications, charts, or bulk refresh behavior should exist in this sprint.

## Result

Lint passes. Manual runtime verification should use replay fixtures or repository-seeded observations before live provider testing.
