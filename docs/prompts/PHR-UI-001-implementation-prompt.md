# PHR-UI-001 Implementation Prompt

## Project Context

Project Phronesis is an evidence-driven collectible-market decision platform. Platform v1.0 separates identity, provider, replay, repository, and UI ownership. Documentation is implementation.

## Feature ID

`PHR-UI-001`

## Objective

Implement provider-agnostic, cached, reusable card imagery for Market Watch and the Universal Asset Picker.

## Required Reading

- `docs/ui/PHR-UI-001-asset-visual-identity.md`
- `docs/releases/Platform-v1.0.md`
- `docs/workflows/PHR-WORKFLOW-001-market-watch-mvp.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/12-images.md`

## Implementation Requirements

- Create the four requested modules under `components/cards/`.
- Make `CardThumbnail` canonical and provider-agnostic.
- Resolve Repository, Replay, Provider, Cached, and Placeholder states.
- Add reusable overlay, action, hover, and selected-state structure.
- Update Market Watch and picker results.
- Validate the four named assets and fallback behavior.

## Constraints

- Do not duplicate provider or search logic.
- Do not make image rendering trigger provider API requests.
- Preserve repository-first Market Watch request economy.
- Never show a broken image.

## Expected Architecture

Normalized identity/repository image candidates flow into `CardImageCache`, then `CardImage`, with `CardThumbnail` as the module-facing visual. Next.js optimization and browser caching own bytes.

## Testing Expectations

- Unit-test source priority, cache hits, size fallback, invalidation, and placeholder resolution.
- Run TypeScript/lint and production build checks.
- Manually inspect Market Watch and picker layouts when a browser is available.

## Documentation Updates

- Feature Registry, Atlas, Roadmap, Sprint History, Prompt History, testing record, and release notes.

## Acceptance Criteria

- All criteria in `PHR-UI-001` pass.

## Non-Goals

- Persistent offline image bytes, hover preview content, quick-action business logic, or new provider integrations.

## Notes For AI Coding Agents

- Preserve unrelated user changes and keep edits scoped to PHR-UI-001.
