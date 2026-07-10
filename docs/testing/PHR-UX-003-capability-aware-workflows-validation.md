# PHR-UX-003 Validation

Automated coverage is defined in `tests/platform-capabilities.test.ts` and `tests/watchlist-entry-lifecycle.test.ts`.

Coverage includes:

- Magic identity and market Operational.
- Lorcana identity/artwork Operational and market Pending.
- Provider-unavailable finish explanation.
- Watchlist-scoped removal preserving a second membership.
- Position-preserving undo.
- Legacy membership migration to `default`.
- Lorcana refresh returning `Refresh Skipped` without invoking `fetch`.

Static validation includes ESLint, TypeScript, Next.js production build, `git diff --check`, and scans confirming no identity/repository/replay/history deletion path was added.

Manual browser validation should confirm overflow-menu visibility, confirmation focus/copy, cancel, edit persistence, immediate removal, seven-second undo toast, empty state, reload persistence, and disabled Lorcana refresh explanation.
