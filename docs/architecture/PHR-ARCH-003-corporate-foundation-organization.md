# PHR-ARCH-003: Corporate Foundation Organization

## Feature ID

`PHR-ARCH-003`

## Title

Corporate Foundation Organization

## Status

Completed

## Priority

High

## Category

Repository Organization / Foundation / Partnerships / Brand / Business Documentation

## Objective

Transform Project Phronesis documentation into a mature corporate knowledge structure and create a reusable partnership submission package for future proposals.

## Background

Project Phronesis has developed foundational philosophy, brand guidance, business strategy, partnership materials, templates, and presentation assets. These documents need a clear corporate organization that supports reuse without moving or invalidating existing canonical files.

## Problem Statement

Foundation, business, brand, and partnership materials existed across several locations. Future proposal generation, especially using external AI systems, required a curated package and clear upload order.

## Proposed Solution

Create a numbered `FOUNDATION/` structure:

- `01_Founding`
- `02_Brand`
- `03_Business`
- `04_Partnerships`
- `05_Templates`
- `06_Presentations`
- `PARTNERSHIP_SUBMISSION_PACKAGE`

Copy existing canonical documents into this structure, create missing brand and template assets, and document a temporary submission package workflow.

## Functional Requirements

- Do not modify application code.
- Do not modify business logic.
- Do not modify architecture.
- Do not move existing canonical files.
- Copy documents into the Foundation structure.
- Create the Brand Production Brief in Markdown, DOCX, and PDF.
- Create Brand Board PNG.
- Create Brand Book.
- Create reusable templates for executive decks, whitepapers, technical proposals, and investor memos.
- Create the temporary Partnership Submission Package.
- Include README with purpose, upload order, workflow, and reuse guidance.
- Register the structure in Atlas.

## Non-Functional Requirements

### Performance

No runtime impact.

### Scalability

The structure must support future partners, investors, distributors, publishers, and strategic documents.

### Maintainability

Canonical documents must be updated first. Temporary package copies must be refreshed from canonical sources.

### Reliability

Submission package users must be able to identify upload order and canonical source rules.

### Accessibility

Documents should remain readable as Markdown and exported artifacts.

### Offline Support

All files live in the repository.

### Security

No secrets or proprietary implementation details are added beyond existing approved documentation.

### Extensibility

Additional partners can be added under `FOUNDATION/04_Partnerships/`.

### Responsiveness

Not applicable.

## User Stories

- As a founder, I want a corporate knowledge structure so that strategic documents are easy to find and reuse.
- As a future AI agent, I want a curated submission package so that I can generate partner proposals with the right context.
- As a designer, I want a brand production brief and brand board so that visual work starts from approved guidance.
- As a partnerships contributor, I want reusable proposal and deck templates so that future partner materials remain consistent.

## Acceptance Criteria

- Requested `FOUNDATION/` structure exists.
- Brand Production Brief exists in Markdown, DOCX, and PDF.
- Brand Board PNG exists.
- TCGplayer partnership materials are copied into Foundation.
- Submission package contains requested files.
- Submission package README explains purpose, upload order, workflow, and reuse.
- Atlas registers the structure.
- No application code changes.

## Edge Cases

- If a canonical document changes, the submission package must be refreshed by copying it again.
- If a future partner needs different materials, add them under that partner's folder without changing the existing TCGplayer package.
- If a final logo is added later, replace brand board and document logo slots from canonical brand assets.

## Dependencies

- Foundation governance: `PHR-ARCH-002`
- Founding Charter: `PHR-ARCH-001`
- Existing business and partnership documents.
- Existing corporate proposal and deck materials.

## Future Enhancements

- Add an automated package refresh script.
- Add final vector logo and approved raster logo assets.
- Add partner-specific folders for PSA, Cardmarket, Beckett, eBay, publishers, distributors, and investors.

## Technical Notes

This is repository organization only.

## UI / UX Notes

Not applicable to application UI.

## Success Metrics

- A future contributor can build a partner proposal from the Foundation package without searching across the repo.
- Gemini or another AI system can receive the package files in a documented order.
- Canonical-vs-temporary document responsibility is explicit.

## Open Questions

- Should package refresh be automated in a future documentation tooling sprint?
- Where should final logo source files live once produced?

## Traceability

- Originating prompt or work order: Repository organization and partnership submission package work order.
- Related implementation prompt: not required for this documentation-only organization work.
- Related tests: file presence, export validation, no application-code diff.
- Related release notes: `docs/release-notes/PHR-ARCH-003.md`
- Last modified: July 9, 2026
- Modification reason: Initial creation.
