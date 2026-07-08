# Agent Handoff

## What Is This Project?

PriceTrackingLLC is a Professional TCG Decision Operating System.

It helps trading-card buyers discover opportunities, evaluate in-person purchases, and eventually manage portfolio decisions.

## Current Development Phase

Current sprint: Sprint 22, Playability Intelligence Platform.

The app now evaluates a selected card through deterministic Vendor Workflow states, Card Profile, Asset Intelligence models, condition-adjusted market context, strategy-weighted signals, Negotiation Ladder, and deterministic Decision Resolver output.

Playability Intelligence now measures why a card has play demand. It is registered in the Asset Intelligence Framework, backed first by Scryfall legalities, exposed on `CardProfile.playabilityProfile`, and consumed by strategies through configurable `Playability` signal weights.

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
- Asset Intelligence Framework
- Playability Intelligence Platform
- Playability Provider Registry
- Scryfall Playability Provider using legalities
- Intelligence Model registry
- Indicator registry
- Signal Registry
- Condition Resolution
- Market Context foundation
- Condition-adjusted market snapshots
- Negotiation Ladder Engine
- Deterministic Decision Resolver invariants
- Dense Vendor Workspace printing rows
- Printing filter chips
- Automatic debounced purchase evaluation
- Vendor Workflow State Machine
- Single Printing Rule
- Vendor Workflow diagnostics
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
- Playability vs recommendation separation
- Playability Provider abstraction and registry
- Asset Intelligence model contract
- Indicator contract and status metadata
- Negotiation Ladder vs Decision Resolver separation
- Offer Ladder Validator vs Decision Resolver separation
- Condition must not affect identity resolution
- Automatic evaluation should remain engine-driven; UI components may debounce input but must not calculate business values.
- Printing filters should use buyer-facing vocabulary and avoid exposing internal engine terminology.
- Vendor Workflow command processing should stay centralized in `lib/workflow/commands/WorkflowCommandProcessor.ts`.
- Vendor Workspace should dispatch workflow commands, not workflow events or manual state transitions.
- Workflow Command Processor owns Asset Context and context generation.
- Asset Context validation lives in `lib/workflow/AssetContextValidator.ts`.
- Workflow context owns selected and highlighted Vendor Workspace state.
- Context invalidation must stay centralized in `lib/workflow/commands/ContextInvalidationEngine.ts`.
- Successful identity selection must reach `ReadyForEvaluation` or `Error`.
- Candidate, highlighted, and selected identity states must remain separate.

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
- Playability must not negotiate or decide BUY / PASS.
- Future intelligence must be registered as an Asset Intelligence model, not built as an isolated scoring engine.
- Strategies must not read provider data directly.
- Strategies may consume Playability only through normalized signal/model outputs and configured weights.
- Negotiation Ladder owns opening offer, target offer, maximum buy price, and walk-away price.
- Offer Ladder Validator must approve the ladder before Decision Resolver executes.
- Decision Resolver must return BUY at or below target, NEGOTIATE between target and maximum buy price, and PASS above maximum buy price.
- Missing evaluation data must return unavailable or invalid results, never fallback zero.
- Evaluation Trace should be preserved for future replay, backtesting, and simulation work.
- Rejected workflow commands must leave selected identity, printing, variant, and decision context unchanged.
- Production Vendor Workspace must not display workflow or Asset Context diagnostics.
- Atlas Inspector is development-only and toggled with Cmd/Ctrl+Shift+D.
- Condition changes must dispatch `ChangeCondition` and trigger a generation-aware market snapshot request.
- Market Provider data always has precedence over future condition inference.
- Evaluation history is append-only and lives under `lib/history/`.
- Only completed `READY` evaluations should create `EvaluationSnapshot` records.
- Snapshot validation must reject incomplete Asset Context, Offer Ladder, or Decision data.
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

Next Playability work should add official provider integrations for EDHREC-style deck penetration, MTGGoldfish-style format popularity, and Melee / MTGO / Top8 competitive results without scraping. Market Provider v2 should add true live listings or recent sales from a marketplace-specific provider while preserving normalized `MarketSnapshot` output. Future intelligence work should register models in the Asset Intelligence Framework without changing the Asset Intelligence → Strategy → Negotiation Ladder → Offer Ladder Validation → Decision Resolver contract. Evaluation History is now the input for future backtesting, simulation, strategy replay, evaluation replay, Market Context replay, signal validation, personal buying history, and portfolio tracking.
