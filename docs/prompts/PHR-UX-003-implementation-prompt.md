# PHR-UX-003 Implementation Prompt

## Project Context

Project Phronesis separates identity, user workflow membership, repository evidence, replay, market acquisition, and history. Removing membership cannot delete upstream data.

## Feature ID

`PHR-UX-003`

## Objective

Complete Market Watch entry CRUD and make Market Watch capability-aware.

## Required Reading

- `docs/ux/PHR-UX-003-capability-aware-workflows.md`
- `docs/releases/Platform-v1.0.md`
- `docs/workflows/PHR-WORKFLOW-001-market-watch-mvp.md`
- `docs/architecture/PHR-ARCH-004-identity-platform.md`

## Implementation Requirements

- Add shared capability registry/resolver, CapabilityCard, and StatusBadge.
- Add watchlist-scoped edit/remove/undo persistence operations.
- Add overflow menu, confirmation/edit dialogs, and undo toast.
- Guard market refresh and capability-aware value/finish/status formatting.
- Preserve Magic behavior and make Lorcana identity-only market behavior explicit.

## Constraints

- Never delete canonical identity, repository evidence, replay fixtures, or market history.
- Never call market acquisition for a non-operational capability.
- Never fabricate finish or price data.
- Preserve current provider, repository, and workflow architecture.

## Expected Architecture

Game → PlatformCapabilityRegistry → resolver → shared CapabilityCard/StatusBadge and Market Watch guards. CRUD flows through WatchlistWorkspace → WatchlistStorage only.

## Testing Expectations

- Unit-test game capability resolution, scoped removal, undo restoration, migration, and refresh guard.
- Run ESLint, TypeScript build, production build, and boundary scans.
- Manually validate dialogs, menu, toast, reload persistence, and Lorcana presentation.

## Documentation Updates

- Feature Registry, Architecture, Atlas, Roadmap, Sprint History, Prompt History, testing, and release notes.

## Acceptance Criteria

- All PHR-UX-003 acceptance criteria pass.

## Non-Goals

- Multiple-watchlist UI, server persistence, provider connection, repository deletion, or market-provider implementation.

## Notes For AI Coding Agents

- Preserve all existing user and prior feature changes in the working tree.
