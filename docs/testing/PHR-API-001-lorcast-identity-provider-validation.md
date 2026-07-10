# PHR-API-001 Validation

Fixture coverage in `tests/lorcast-identity-provider.test.ts` validates canonical normalization, artwork mapping, explicit price exclusion, `unique=prints`, identical-query caching, malformed queries, HTTP 429, HTTP 5xx, and network failures.

Live local API validation on 2026-07-09 confirmed:

| Query | Provider | Status | Required identity fields |
|---|---|---|---|
| Elsa | Lorcast | Operational | Present |
| Mulan | Lorcast | Operational | Present |
| Mickey Mouse | Lorcast | Operational | Present |
| Belle | Lorcast | Operational | Present |
| Maleficent | Lorcast | Operational | Present |
| Mox Opal | Scryfall | Operational | Present |

For every named Lorcana query, at least one exact-name identity included artwork, printing count, collector number, set, English language, and canonical identity. Mox Opal retained nine Scryfall printings in the observed response.

Static validation includes ESLint, Next.js TypeScript/production build, `git diff --check`, absence of Lorcast imports in application/UI layers, and absence of mapped Lorcast prices in canonical output.
