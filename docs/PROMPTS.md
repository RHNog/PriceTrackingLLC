# Prompt History

This file summarizes major prompts and architectural instructions. It intentionally avoids copying every prompt in full.

## Sprint 0

Purpose: set up the project.

Core instruction: create a Next.js, TypeScript, Tailwind application.

Major files affected: project root, `app/`, config files.

Result: working Next.js application.

## Sprint 1

Purpose: create the application shell and initial dashboard.

Core instruction: build a dark app shell with reusable sidebar/topbar components.

Major files affected: `components/ui/`, `app/page.tsx`.

Result: reusable shell and dashboard foundation.

## Sprint 2

Purpose: turn Watchlists into buying strategies.

Core instruction: model watchlists as professional buyer workflows.

Major files affected: `components/watchlists/`, `data/mockWatchlists.ts`, `types/watchlist.ts`.

Result: watchlist strategy UI.

## Sprint 3

Purpose: make Hot Opportunities the home page.

Core instruction: display buying opportunities instead of a generic dashboard.

Major files affected: `components/opportunities/`, `types/opportunity.ts`, `data/mockOpportunities.ts`.

Result: Opportunity Engine foundation.

## Sprints 4-8

Purpose: add scoring, profit, provider, ranking, and strategy engines.

Core instruction: keep business logic inside engines and UI focused on presentation.

Major files affected: `lib/engines/`, `types/`, `data/`.

Result: provider-independent decision architecture.

## Sprint 9

Purpose: introduce Vendor Workspace.

Core instruction: create a fast command-palette-style purchase evaluation workflow.

Major files affected: `features/vendor/`, `app/vendor/page.tsx`.

Result: search, select, asking price, evaluate workflow.

## Sprint 11

Purpose: add Scryfall Identity Provider and diagnostics.

Core instruction: validate raw provider data, adapter output, and normalized domain cards.

Major files affected: `lib/providers/identity/`, `features/developer/identity/`.

Result: development-only Identity Explorer.

## Sprint 12

Purpose: introduce Universal Query Engine.

Core instruction: parse buyer language into structured intent.

Major files affected: `lib/engines/query/`, `knowledge/`, `types/parsedQuery.ts`.

Result: dictionary-driven query parsing.

## Sprint 12.5

Purpose: add Intent Resolution.

Core instruction: separate identity meaning from printing constraints.

Major files affected: `lib/engines/intent/`.

Result: resolved identity and constraints.

## Sprint 12.6

Purpose: add Entity Resolution.

Core instruction: understand relationships like primary card, back face, token, emblem, split card.

Major files affected: `lib/engines/entity/`, `config/relationships.ts`.

Result: relationship-aware identity ranking.

## Sprint 12.7

Purpose: add Canonical Resolution.

Core instruction: resolve professional shorthand before intent resolution.

Major files affected: `lib/engines/canonical/`, `knowledge/shared/canonical/`.

Result: `bolt`, `fow`, `bob`, `monkey`, and similar terms resolve to canonical identities.

## Sprint 12.8

Purpose: add Constraint Satisfaction.

Core instruction: rank printings after identity resolution using parsed constraints.

Major files affected: `lib/engines/constraints/`, `features/vendor/components/PrintingResults.tsx`.

Result: Vendor Workspace avoids unrelated default printings.

## Sprint 12.9

Purpose: add Prefix Matching.

Core instruction: resolve progressive typed vocabulary like `invocatio` without overmatching short fragments.

Major files affected: `lib/engines/query/`, `config/query.ts`.

Result: safer progressive query resolution.

## Sprint 13

Purpose: add visual printing confirmation and recover documentation.

Core instruction: images are part of purchase evaluation and must come from normalized domain objects.

Major files affected: `types/card.ts`, `ScryfallAdapter.ts`, `features/vendor/`, `docs/`.

Result: Vendor Workspace card images and project documentation system.

## Sprint 14

Purpose: introduce the first live Market Provider.

Core instruction: use Scryfall prices as daily market estimates, not live listings.

Major files affected: `lib/providers/market/`, `types/marketPrice.ts`, `features/vendor/`.

Result: Vendor Workspace can use normalized market estimates.

## Sprint 15

Purpose: add default variant resolution and complete purchase evaluation.

Core instruction: default multi-finish printings through a reusable policy and return BUY / NEGOTIATE / PASS.

Major files affected: `lib/engines/variantResolution/`, `lib/engines/evaluation/`, `features/vendor/`.

Result: Vendor Workspace completes the first end-to-end buying workflow.

## Sprint 16

Purpose: optimize Vendor Workspace for real buying sessions.

Core instruction: make the decision visible immediately, reduce scrolling, remove repeated explanations, and synchronize Atlas.

Major files affected: `features/vendor/`, `lib/engines/decision/`, `docs/`.

Result: Decision-first workspace with sticky decision panel and Decision Drivers.

## Sprint 17

Purpose: optimize Vendor Workspace VX for professional in-person buying speed.

Core instruction: reduce scrolling and eye movement, make BUY / NEGOTIATE / PASS focal, compress printing rows, replace the manual Evaluate action with automatic debounced evaluation, add chip-based printing refinement, and preserve normal keyboard input behavior.

Major files affected: `features/vendor/`, `components/ui/CardImage.tsx`, `docs/`.

Result: denser command-palette-style Vendor Workspace with automatic decisions, compact printing rows, finish segmented controls, ESC reset, and keyboard printing navigation.

## Sprint 18

Purpose: introduce the Card Intelligence Platform.

Core instruction: stop evaluating price alone; evaluate Card, Printing, Variant, Condition, Market Context, and Strategy through reusable intelligence signals, then convert strategy into negotiation through a Negotiation Ladder before the Decision Resolver compares asking price.

Major files affected: `lib/engines/cardIntelligence/`, `lib/engines/negotiation/`, `lib/engines/decision/`, `lib/engines/evaluation/`, `types/`, `features/vendor/`, `tests/`, `docs/`.

Result: Card Profile, Signal Registry, signal versioning, condition-adjusted market snapshots, Market Context foundation, Negotiation Ladder Engine, deterministic Decision Resolver invariants, Vendor Workspace condition selection, and Card Profile signal panel.
