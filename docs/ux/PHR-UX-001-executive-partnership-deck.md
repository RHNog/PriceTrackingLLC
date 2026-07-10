# PHR-UX-001: Executive Partnership Deck

## Feature ID

`PHR-UX-001`

## Title

Executive Partnership Deck

## Status

Completed

## Priority

High

## Category

UX Specification / Business Documentation / Presentation System

## Objective

Create a premium executive presentation format for the TCGplayer Ecosystem Partnership Proposal that removes friction between the reader and the core message.

## Background

The written proposal is approved. The next communication need is not more content, but a clearer executive presentation that can be understood by a reader with limited time.

## Problem Statement

A prose proposal can require too much effort from an executive reader. Dense tables, paragraphs, and appendix-style structures can slow comprehension even when the underlying content is strong.

## Proposed Solution

Create an executive partnership deck that preserves the approved message while converting it into one primary idea per slide, with concise statements, simple diagrams, minimal comparison layouts, and generous whitespace.

## Functional Requirements

- Preserve the approved proposal content and meaning.
- Produce a Markdown deck source.
- Produce an editable PPTX.
- Produce a Google Slides compatible PPTX.
- Produce an editable DOCX.
- Produce a presentation-quality PDF.
- Use the Project Phronesis corporate visual language.
- Use a fixed logo slot so the approved raster logo can be replaced later with one image change.
- Avoid decorative graphics and visual clutter.
- Make the document understandable in approximately seven minutes.

## Non-Functional Requirements

### Performance

No runtime impact.

### Scalability

The deck structure should be reusable for PSA, Cardmarket, eBay, investors, distributors, publishers, and future partnerships.

### Maintainability

The Markdown deck source should remain the source of truth for regenerated exports.

### Reliability

Generated PPTX, DOCX, and PDF files should validate as their respective file types.

### Accessibility

Slides should use short text, high contrast, readable hierarchy, and minimal cognitive load.

### Offline Support

All artifacts should be generated locally.

### Security

The deck must not disclose proprietary implementation details.

### Extensibility

The presentation pattern should support future partner-specific decks.

### Responsiveness

Not applicable to app UI.

## User Stories

- As a marketplace executive, I want to understand the proposal quickly so that I can decide whether a meeting is worthwhile.
- As a partnerships lead, I want a concise deck so that I can share it internally without requiring a full written proposal.
- As an engineering director, I want clear boundaries so that I can evaluate seriousness without seeing proprietary implementation details.

## Acceptance Criteria

- Deck source exists at `docs/business/TCGPLAYER_EXECUTIVE_PARTNERSHIP_DECK.md`.
- PPTX exists and validates as a PowerPoint file.
- Google Slides compatible PPTX exists.
- DOCX exists and validates as a Word file.
- PDF exists and validates as a PDF.
- Deck contains the requested 15-page flow.
- Existing proposal is not substantially rewritten.
- No application code is changed.

## Edge Cases

- If no raster logo is present in the repository, preserve a fixed logo slot and report that the approved raster logo was not found.
- If a reader skips body text, slide titles and callouts should still communicate the story.
- If imported into Google Slides, text and shapes should remain editable.

## Dependencies

- Approved proposal: `docs/business/TCGPLAYER_ECOSYSTEM_PARTNERSHIP_PROPOSAL.md`
- Corporate style guide: `docs/templates/CorporateStyleGuide.md`
- Documentation-first system: `PHR-TECH-001`

## Future Enhancements

- Add approved raster and SVG logo assets.
- Add a reusable deck generator script under a documentation tooling folder.
- Add partner-specific deck variants for PSA, Cardmarket, eBay, and investors.

## Technical Notes

Generated artifacts are documentation outputs. The app runtime is unaffected.

## UI / UX Notes

Design decisions should prioritize comprehension over decoration. Every slide should have one primary idea and a short memorable callout.

## Success Metrics

- A seven-minute reader understands who Project Phronesis is, why TCGplayer benefits, and why a meeting is worthwhile.
- The deck feels professional without requiring dense reading.

## Open Questions

- Where should the approved raster logo asset be stored?
- Should future decks use a maintained local generation script?

## Traceability

- Originating prompt or work order: TCGplayer executive partnership deck redesign.
- Related implementation prompt: not required for this documentation-only deck generation.
- Related tests: file validation commands.
- Related release notes: `docs/CHANGELOG.md`
- Last modified: July 9, 2026
- Modification reason: Initial creation.
