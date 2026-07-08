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

## Sprint 14

First Live Market Provider.

Added Scryfall Market Provider v1, normalized market price snapshots, and Vendor Workspace support for daily Scryfall market estimates. Lowest listing and recent sale remain unavailable until Market Provider v2 adds true marketplace inventory or sales data.

## Sprint 15

Variant Resolution Policy and Purchase Evaluation Engine.

Added a reusable Variant Resolution Policy that respects explicit finish requests, auto-selects single-finish printings, defaults multi-finish printings to Nonfoil, and falls back to the least-special finish. Vendor Workspace now completes the buying workflow with market estimate, asking price, estimated profit, ROI, recommended offer, confidence, and BUY / NEGOTIATE / PASS recommendations.

## Sprint 16

Decision-First Vendor Workspace.

Optimized Vendor Workspace for faster buying sessions by placing printing candidates beside a sticky decision panel, reorganizing metrics, removing repeated explanation text, and introducing Decision Drivers for concise business reasoning. Atlas now records backlog, technical debt, dependency graph, and reusable interaction patterns.

## Sprint 17

Vendor Workspace VX Optimization.

Compressed the in-person buying workflow for professional trading sessions. Printing rows are denser, thumbnails are smaller, common printing refinements are chip-based, purchase evaluation updates automatically with a short debounce, and the decision panel now surfaces BUY / NEGOTIATE / PASS plus offer, profit, and ROI as the first thing to read.

Keyboard behavior now supports ESC reset, natural tab order, Enter selection outside text inputs, and arrow-key printing navigation without interrupting typing.

## Sprint 18

Card Intelligence Platform.

Introduced Card Profile, Signal Registry, signal versioning, condition-adjusted market snapshots, Market Context, Negotiation Ladder, and a deterministic Decision Resolver. Purchase Evaluation now flows through card intelligence signals and a negotiation ladder before BUY / NEGOTIATE / PASS is selected.

Vendor Workspace gained a Condition selector and collapsible Card Profile panel. Automated tests now verify condition-sensitive market estimates, negotiation ladders, decisions, strategy signal weighting, finish-sensitive ladders, independent signals, and exact BUY / NEGOTIATE / PASS ladder invariants.
