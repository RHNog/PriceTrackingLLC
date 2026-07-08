# Agent Handoff

## What Is This Project?

PriceTrackingLLC is a Professional TCG Decision Operating System.

It helps trading-card buyers discover opportunities, evaluate in-person purchases, and eventually manage portfolio decisions.

## Current Development Phase

Current sprint: Sprint 18, Card Intelligence Platform.

The app now evaluates a selected card through Card Profile, condition-adjusted market context, strategy-weighted signals, Negotiation Ladder, and deterministic Decision Resolver output.

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
- Printing finish variants with unresolved finish blocking in Vendor Workspace
- Scryfall Market Provider v1 for daily market estimates
- Internal market snapshot API
- Variant Resolution Policy
- Complete Vendor Workspace purchase evaluation output
- Decision-first Vendor Workspace layout
- Decision Drivers Engine
- Card Intelligence Engine
- Signal Registry
- Condition Resolution
- Market Context foundation
- Condition-adjusted market snapshots
- Negotiation Ladder Engine
- Deterministic Decision Resolver invariants
- Dense Vendor Workspace printing rows
- Printing filter chips
- Automatic debounced purchase evaluation
- ESC reset and keyboard printing navigation
- Project Atlas

## What Should Not Be Changed Casually?

- Provider-independent engine contracts
- Identity Provider vs Market Provider separation
- Query Engine dictionary-driven behavior
- Canonical, intent, entity, and constraint pipeline order
- Condition and grading preservation rules
- Domain-model image adaptation rules
- Printing-vs-finish-variant separation
- Market estimate vs live listing separation
- Variant policy vs UI selection separation
- Decision driver engine vs presentation copy separation
- Card Intelligence vs recommendation separation
- Negotiation Ladder vs Decision Resolver separation
- Condition must not affect identity resolution
- Automatic evaluation should remain engine-driven; UI components may debounce input but must not calculate business values.
- Printing filters should use buyer-facing vocabulary and avoid exposing internal engine terminology.

## Important Architectural Rules

- UI components must not know external provider response shapes.
- UI components must not fetch Scryfall images directly.
- Business engines must not call providers directly.
- Provider data must be normalized before entering domain objects.
- Query and constraint logic must stay deterministic and explainable.
- Multi-finish printings may default only through the Variant Resolution Policy.
- Scryfall prices are daily estimates and must not be treated as live inventory.
- Do not invent lowest listing, recent sale, or buylist values.
- Card Intelligence must not negotiate.
- Negotiation Ladder owns opening offer, target offer, maximum buy price, and walk-away price.
- Decision Resolver must return BUY at or below target, NEGOTIATE between target and maximum buy price, and PASS above maximum buy price.
- Production UI should not expose provider internals or placeholder engine language.
- Tailwind CSS only.
- No external libraries unless explicitly requested.

## Before Making Changes

Future agents must read:

1. `docs/AGENT_HANDOFF.md`
2. `docs/ARCHITECTURE.md`
3. `docs/DECISIONS.md`
4. `docs/ROADMAP.md`
5. `docs/SPRINT_HISTORY.md`
6. `docs/ATLAS.md`

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
7. `docs/ATLAS.md`

No sprint is complete until documentation is updated.

## Suggested Next Step

Market Provider v2 should add true live listings or recent sales from a marketplace-specific provider while preserving normalized `MarketSnapshot` output. Future Market Context work should add regional valuation, currency normalization, shipping, tax, import cost, and demand assumptions without changing the Card Intelligence → Negotiation Ladder → Decision Resolver contract.
