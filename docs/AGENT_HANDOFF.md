# Agent Handoff

## What Is This Project?

PriceTrackingLLC is a Professional TCG Decision Operating System.

It helps trading-card buyers discover opportunities, evaluate in-person purchases, and eventually manage portfolio decisions.

## Current Development Phase

Current sprint: Sprint 13, Visual Printing Confirmation and Documentation Recovery.

The app has a strong interpretation architecture but still uses mocked market pricing.

## What Has Been Built?

- Next.js App Shell
- Hot Opportunities
- Watchlists as buying strategies
- Vendor Workspace
- Purchase Evaluation
- Opportunity, Profit, Ranking, Strategy, Query, Canonical, Intent, Entity, and Constraint engines
- Scryfall Identity Provider
- Developer Identity Explorer
- Visual card confirmation in Vendor Workspace

## What Should Not Be Changed Casually?

- Provider-independent engine contracts
- Identity Provider vs Market Provider separation
- Query Engine dictionary-driven behavior
- Canonical, intent, entity, and constraint pipeline order
- Condition and grading preservation rules
- Domain-model image adaptation rules

## Important Architectural Rules

- UI components must not know external provider response shapes.
- UI components must not fetch Scryfall images directly.
- Business engines must not call providers directly.
- Provider data must be normalized before entering domain objects.
- Query and constraint logic must stay deterministic and explainable.
- Tailwind CSS only.
- No external libraries unless explicitly requested.

## Before Making Changes

Future agents must read:

1. `docs/AGENT_HANDOFF.md`
2. `docs/ARCHITECTURE.md`
3. `docs/DECISIONS.md`
4. `docs/ROADMAP.md`
5. `docs/SPRINT_HISTORY.md`

Then inspect the relevant source files before editing.

## Commands

Before changes:

```bash
git status --short
```

After changes:

```bash
npm run lint
npx tsc --noEmit
```

## Documentation Rule

Future agents must update documentation after every sprint.

Every sprint must update:

1. `CHANGELOG.md`
2. `docs/SPRINT_HISTORY.md`
3. `docs/AGENT_HANDOFF.md` if current state or next steps changed
4. `docs/ARCHITECTURE.md` if architecture changed
5. `docs/ROADMAP.md` if priorities changed
6. `docs/DECISIONS.md` if a major product or architecture decision was made

No sprint is complete until documentation is updated.

## Suggested Next Step

Sprint 14 should add the first live Market Provider while preserving provider-independent business engines.
