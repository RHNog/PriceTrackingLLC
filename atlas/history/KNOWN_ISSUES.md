# Known Issues

Atlas tracks internal development risks. This file is not customer-facing.

## Open Bugs

- Direct `node --test tests/*.test.ts` is not currently a reliable project test command because TypeScript path aliases such as `@/*` are not resolved by Node's default test runner.
- Browser visual regression coverage is not active because Playwright browser binaries are not installed in this environment.

## Architectural Risks

- Business Profile persistence is not implemented; current settings are in-memory.
- Readiness Reports and Pipeline Reports are runtime objects and are not yet persisted into evaluation history.
- Market data is still Scryfall daily market estimate data, not live listing, recent sale, or buylist data.
- Condition pricing uses deterministic condition adjustment; provider-native condition pricing is future work.
- Atlas currently has no automated drift detection between repository structure and architecture documentation.

## Regression Risks

- Vendor Workflow context ownership can regress if components reintroduce local selected identity, printing, variant, or condition state.
- Offer Ladder integrity can regress if missing values are represented as `0` instead of `UNAVAILABLE` or `INVALID`.
- Provider boundaries can regress if UI components start consuming provider response shapes directly.
- Intelligence model boundaries can regress if a model starts producing BUY, NEGOTIATE, PASS, or offer values.

## Workarounds

- Use `npm run lint`, `npx tsc --noEmit`, and `npm run build` for broad verification until a project test runner is formalized.
- Treat `docs/` as the canonical project memory until Atlas report generation is automated.
- Keep Atlas changes inside `/atlas` unless a sprint explicitly asks to integrate automation.
