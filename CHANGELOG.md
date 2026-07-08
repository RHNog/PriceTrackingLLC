# Changelog

All notable changes to this project will be documented in this file.

The format is inspired by "Keep a Changelog".

---

## [Unreleased]

### Added
- Visual card images in Vendor Workspace identity results.
- Printing candidate thumbnails with image fallbacks.
- Selected printing image display in the purchase panel.
- Structured card image URLs and card-face image metadata.
- Documentation recovery system under `docs/`.
- Agent handoff documentation.
- Sprint history documentation.
- Architecture, roadmap, decision, product spec, prompt history, and documentation changelog files.

### Changed
- Scryfall adapter now maps image data into normalized domain card objects.
- README now describes PriceTrackingLLC instead of the default Next.js template.

### Fixed
- Missing card images now render a clean fallback instead of disappearing from the workflow.
- Apostrophe and punctuation-heavy card names now receive a normalization boost during identity scoring.
- `urza's saga textless`, `urzas saga textless`, and `urza saga textless` now resolve to Urza's Saga and load printing candidates.
- Textless variants such as `text less` and `no text` are recognized as treatment constraints.
- Clear low-confidence identity candidates can now load printing candidates instead of leaving Vendor Workspace stuck at an identity row.

### Documented
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
