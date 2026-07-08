# Changelog

All notable changes to this project will be documented in this file.

The format is inspired by "Keep a Changelog".

---

## [Unreleased]

### Added
- Sprint 18 Card Intelligence Platform foundation.
- Deterministic Card Profile and signal architecture for investment, flip, grading, collector, liquidity, volatility, scarcity, demand, playability, reprint risk, market confidence, and historical stability signals.
- Condition Resolution with NM, LP, MP, HP, and DMG condition profiles.
- Condition-adjusted market snapshots for purchase evaluation.
- Market Context domain object for country, region, currency, marketplace, language, tax, and shipping assumptions.
- Negotiation Ladder Engine with opening offer, target offer, maximum buy price, and walk-away price.
- Deterministic Decision Resolver that compares asking price against the Negotiation Ladder.
- Vendor Workspace Condition selector and collapsible Card Profile panel.
- Automated tests for condition-sensitive market estimates, negotiation ladders, decisions, signal independence, strategy signal weighting, finish-sensitive ladders, and BUY / NEGOTIATE / PASS invariants.
- Sprint 17 Vendor Workspace VX optimization for denser, keyboard-first buying sessions.
- Printing filter chips for common buyer refinements such as Foil, Judge, Retro, Textless, Secret Lair, Special Guests, and Masterpiece.
- Automatic debounced purchase evaluation when asking price, finish, or printing changes.
- Compact quick summary showing decision, target offer, expected profit, and ROI after evaluation.
- Decision-first Vendor Workspace layout with a desktop sticky decision panel.
- Decision Drivers Engine for concise recommendation reasoning.
- Project Atlas documentation for backlog, patterns, dependency graph, and technical debt.
- Variant Resolution Policy for automatic purchasable finish selection.
- Complete purchase evaluation output with BUY / NEGOTIATE / PASS, recommended offer, margin, ROI, and confidence.
- Scryfall Market Provider v1 for daily market estimate snapshots.
- Normalized `MarketPrice`, `MarketSnapshot`, and `PriceSource` domain types.
- Internal market snapshot API for Vendor Workspace market estimates.
- Printing finish variants for multi-finish Scryfall printings.
- Visual card images in Vendor Workspace identity results.
- Printing candidate thumbnails with image fallbacks.
- Selected printing image display in the purchase panel.
- Structured card image URLs and card-face image metadata.
- Documentation recovery system under `docs/`.
- Agent handoff documentation.
- Sprint history documentation.
- Architecture, roadmap, decision, product spec, prompt history, and documentation changelog files.

### Changed
- Purchase Evaluation now consumes Card Profile, condition-adjusted market price, strategy signal weights, and Negotiation Ladder output.
- Decision Resolver no longer independently calculates BUY / PASS; it follows Negotiation Ladder invariants.
- Seeded strategies now include explicit Card Intelligence signal weights.
- Vendor Workspace market estimate, negotiation ladder, and decision now update when condition changes.
- Vendor Workspace now removes the manual Evaluate action in favor of live evaluation.
- Printing rows are denser, image thumbnails are smaller, and match score remains visible for faster scanning.
- ESC now resets Vendor Workspace and returns focus to search while arrows and Enter support printing navigation outside text inputs.
- Finish selection now renders as a compact segmented control using only available finish variants.
- Decision panel ordering now emphasizes selected card, recommendation, confidence, market estimate, asking price, maximum price, offer, profitability, and drivers.
- Vendor Workspace now puts printing candidates beside the decision panel on desktop.
- Production Vendor Workspace copy now avoids provider and engine implementation details.
- Multi-finish printings now default to Nonfoil through the Variant Resolution Policy while preserving one-click finish switching.
- Vendor Workspace now recalculates market estimate and purchase evaluation when the selected finish changes.
- Vendor Workspace now uses Scryfall market estimates when a selected printing and finish variant have price data.
- Purchase evaluation now consumes normalized market prices instead of marketplace listing objects.
- Vendor Workspace now treats a printing and its purchasable finish variant as separate selections.
- Scryfall adapter now preserves all available finishes instead of collapsing multi-finish printings to foil.
- Scryfall adapter now maps image data into normalized domain card objects.
- README now describes PriceTrackingLLC instead of the default Next.js template.

### Fixed
- Multi-finish printings no longer auto-select foil when the query does not specify a finish.
- `foil` constraints no longer match `Nonfoil` variants.
- Special foil treatments such as Halo, Surge, Galaxy, and Confetti are normalized as distinct finish variants.
- Missing card images now render a clean fallback instead of disappearing from the workflow.
- Apostrophe and punctuation-heavy card names now receive a normalization boost during identity scoring.
- `urza's saga textless`, `urzas saga textless`, and `urza saga textless` now resolve to Urza's Saga and load printing candidates.
- Textless variants such as `text less` and `no text` are recognized as treatment constraints.
- Clear low-confidence identity candidates can now load printing candidates instead of leaving Vendor Workspace stuck at an identity row.

### Documented
- Sprint 18 Card Intelligence philosophy, Signal Registry, Market Context, Negotiation Ladder, canonical pipeline, and decision invariants.
- Sprint 17 VX optimization, keyboard workflow, chip filters, automatic evaluation, and dense printing patterns.
- Sprint 16 Atlas synchronization, decision-first pattern, backlog, and technical debt.
- Variant Resolution Policy and complete Vendor Workspace buying workflow.
- Scryfall prices as daily market estimates rather than live listing or recent sale data.
- Product vision as a Professional TCG Decision Operating System.
- Current architecture and provider boundaries.
- Permanent documentation update rule for future sprints.

---

## [0.1.0] - 2026-07-07

### Added
- Initial project structure
- Development environment
- React + Next.js application
- First working dashboard UI
- AI-assisted development workflow with Codex
