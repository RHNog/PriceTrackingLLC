# Sprint History

This file records logical product milestones. Sprint numbers may not perfectly match commit history.

## Sprint 0

Project setup, GitHub, Next.js, TypeScript, Tailwind CSS.

## Sprint 1

Application shell and first dashboard.

## Sprint 2

Watchlists became buying strategies instead of simple card lists.

## Sprint 3

Hot Opportunities and the first Opportunity domain model.

## Sprint 4

Opportunity scoring and ranking foundation.

## Sprint 5

Profit Engine for calculated net profit, fees, shipping, and total costs.

## Sprint 6

Marketplace Provider abstraction for provider-independent opportunity generation.

## Sprint 7

Weighted Opportunity Ranking Engine.

## Sprint 8

Strategy Engine and strategy-specific opportunity ranking.

## Sprint 9

Vendor Workspace for fast in-person purchase evaluation.

## Sprint 10

Universal Search Engine foundation.

## Sprint 11

Scryfall Identity Provider Platform and developer diagnostics.

## Sprint 12

Universal Query Engine and TCG Knowledge Platform.

## Sprint 12.5

Intent Resolution Engine.

## Sprint 12.6

Entity Resolution and identity relationships.

## Sprint 12.7

Canonical Resolution Engine for professional shorthand.

## Sprint 12.8

Constraint Satisfaction Engine for printing selection.

## Sprint 12.9

Prefix Matching and Progressive Query Resolution.

## Sprint 12.10

Special Guests / bonus-sheet vocabulary and zero-match default prevention.

## Sprint 12.11

Identity-token vs constraint-token separation for queries like `collected company tarkir`.

## Sprint 13

Visual Printing Confirmation and Documentation Recovery.

Added domain image URL support, Scryfall image adaptation, image fallbacks, Vendor Workspace card images, and recovered documentation.

### Targeted Vendor Workspace Fix

Improved punctuation normalization, Textless knowledge recognition, and low-confidence identity handling so queries such as `urza's saga textless`, `urzas saga textless`, and `urza saga textless` resolve to Urza's Saga and show printing candidates.

### Targeted Printing Variant Fix

Introduced explicit printing finish variants. Multi-finish printings now keep finish selection unresolved until the query or user selects a finish, while explicit queries such as `urza's saga secret lair foil` and `urza's saga secret lair nonfoil` select the correct variant.
