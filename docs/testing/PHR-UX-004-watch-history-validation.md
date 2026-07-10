# PHR-UX-004 Validation

`tests/watch-history.test.ts` covers stable creation metadata, initial/source preservation, market-since-added change, null/zero handling, bounded successful observations, duplicate suppression, 18-day and three-month duration formatting, and rising/falling classification.

The Next.js build type-checks watch history integration with existing capability and lifecycle tests. Static validation includes ESLint, production build, `git diff --check`, and confirmation that no new route, chart dependency, provider request, or repository-history mutation was introduced.

Manual browser validation should confirm compact default rows, disclosure state, date/time formatting, signed currency/percent, notes/reason editing, stable migration after reload, and sparkline labels on desktop and mobile.
