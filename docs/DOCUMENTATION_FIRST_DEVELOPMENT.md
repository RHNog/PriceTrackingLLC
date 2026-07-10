# Documentation-First Development System

Documentation is part of the implementation of Project Phronesis.

Every meaningful feature, enhancement, architectural decision, workflow improvement, optimization, bug fix with architectural impact, or business rule must produce and maintain structured documentation.

Implementation follows documentation. Documentation does not merely summarize implementation after the fact.

## Objective

The documentation-first system ensures that every meaningful change is:

- Documented.
- Categorized.
- Traceable.
- Reusable.
- Understandable by humans and AI coding agents.

## When This Applies

Apply this system when a discussion, request, work order, implementation, or bug fix represents one or more of:

- New Feature.
- Feature Enhancement.
- User Experience Improvement.
- Technical Improvement.
- Architecture Decision.
- Business Rule.
- Workflow.
- Database Change.
- API Change.
- Infrastructure Change.
- Optimization.
- Refactor.
- Technical Debt.
- Architecturally relevant Bug Fix.
- Future Idea.
- Research Item.

Small text corrections, typo fixes, formatting-only edits, and non-architectural housekeeping do not require a full feature specification unless they change behavior, policy, workflow, or project meaning.

## Required Workflow

### Step 1: Identify The Change

Classify the change before implementation.

If a request contains multiple changes, create or update a specification for each meaningful feature or system concern.

### Step 2: Generate Or Update A Feature Specification

Use the standard feature specification format in `docs/templates/FeatureSpecificationTemplate.md`.

A specification must be detailed enough that another AI coding agent or developer could implement the feature with little or no additional clarification.

### Step 3: Classify Documentation Destination

Select every relevant destination:

- Product Backlog.
- Product Requirements Document.
- Architecture.
- Technical Design.
- Database Design.
- API Specification.
- UI Specification.
- UX Specification.
- User Workflow.
- Business Rules.
- Roadmap.
- Future Ideas.
- Release Notes.
- Developer Notes.
- Testing Documentation.
- Implementation Prompts.

A feature may belong to multiple destinations.

### Step 4: Maintain Traceability

Every feature receives a permanent Feature ID.

Examples:

- `PHR-BACKLOG-001`
- `PHR-UI-004`
- `PHR-API-012`
- `PHR-TECH-018`
- `PHR-DB-006`

Feature IDs must never change after assignment.

Use the same Feature ID in:

- Feature specifications.
- Implementation prompts.
- Architecture notes.
- Technical documentation.
- Test documentation.
- Release notes.
- Future enhancements.
- GitHub issues and pull requests, when used.
- Commit messages, when commits are created.
- Database migrations, when applicable.
- API endpoint documentation, when applicable.

### Step 5: Generate An Implementation Prompt

Every implementation-grade specification should have an AI-ready implementation prompt using `docs/templates/ImplementationPromptTemplate.md`.

The prompt must include:

- Project context.
- Objective.
- Implementation requirements.
- Constraints.
- Expected architecture.
- Testing expectations.
- Documentation updates.

### Step 6: Update Dependent Documentation

When an existing feature changes:

1. Update the existing specification.
2. Preserve the original Feature ID.
3. Record the modification date.
4. Record the reason for the change.
5. Update dependent documentation.

Documentation must not become stale.

## Repository Documentation Structure

Documentation destinations:

```text
docs/
  backlog/
  prd/
  architecture/
  technical/
  database/
  api/
  ui/
  ux/
  workflows/
  business-rules/
  testing/
  roadmap/
  release-notes/
  future/
  prompts/
```

Existing top-level documents such as `docs/ARCHITECTURE.md`, `docs/ROADMAP.md`, `docs/ATLAS.md`, `docs/DECISIONS.md`, and business documents remain valid. The structured folders add implementation-grade traceability for future work.

## Documentation Quality Standard

Documentation should not be a lightweight summary.

It should be implementation-grade.

Another developer or AI coding agent should be able to build the feature using the documentation alone.

Quality rules:

- Avoid placeholders whenever possible.
- Expand assumptions into explicit requirements.
- When ambiguity exists, document assumptions clearly.
- Separate current capability from future vision.
- Record constraints and non-goals.
- Document edge cases and recovery behavior.
- Document testing expectations.

## AI Behavior Standard

AI coding agents working in this repository must:

- Check whether the request triggers documentation-first workflow.
- Create or update feature specifications before or alongside implementation.
- Use permanent Feature IDs.
- Add implementation prompts for meaningful future or active work.
- Update related Atlas, roadmap, decision, release-note, testing, or prompt documents when relevant.
- Present improvement suggestions separately from implemented changes so they can be approved independently.

## Improvement Suggestions

When implementing a feature, continuously evaluate whether:

- The feature can be generalized.
- Duplicate functionality exists.
- Abstractions should be introduced.
- Future extensibility can be improved.
- Workflows can be simplified.
- Performance can be improved.
- UI can be simplified.
- Documentation should be expanded.

Suggestions are not automatic scope. Document them separately for approval.

## Development Philosophy

Project Phronesis is intended to become a complete operating system for trading-card businesses.

Every implementation should prioritize:

- Modularity.
- Scalability.
- Maintainability.
- Transparency.
- Developer experience.
- AI-assisted development.
- Long-term extensibility.

When multiple solutions exist, prefer the one that best supports future growth and traceability.
