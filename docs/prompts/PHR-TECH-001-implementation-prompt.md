# PHR-TECH-001 Implementation Prompt

## Project Context

Project Phronesis is the internal engineering initiative responsible for developing an evidence-driven decision intelligence platform for collectible markets.

Documentation is part of implementation. The repository must maintain implementation-grade documentation for meaningful changes.

## Feature ID

`PHR-TECH-001`

## Objective

Implement the Documentation-First Development System throughout the repository without modifying application runtime code.

## Required Reading

- `docs/DOCUMENTATION_FIRST_DEVELOPMENT.md`
- `docs/templates/FeatureSpecificationTemplate.md`
- `docs/templates/ImplementationPromptTemplate.md`
- `docs/technical/PHR-TECH-001-documentation-first-development-system.md`
- `AGENTS.md`

## Implementation Requirements

- Create the requested documentation taxonomy under `docs/`.
- Add README files for each documentation category.
- Add reusable feature specification and implementation prompt templates.
- Create the first traceable feature specification for the documentation-first system.
- Create this implementation prompt.
- Update repository-level agent instructions.
- Update Atlas, Decisions, Prompt History, Agent Handoff, and Changelog.

## Constraints

- Do not modify application code.
- Do not rename the repository, package, imports, namespaces, or application title.
- Preserve Project Phronesis as the engineering initiative, not necessarily the commercial brand.
- Keep implementation suggestions separate from approved work.

## Expected Architecture

Documentation ownership is distributed by category:

- System contract: `docs/DOCUMENTATION_FIRST_DEVELOPMENT.md`
- Templates: `docs/templates/`
- Feature specifications: category folders such as `docs/technical/`, `docs/api/`, `docs/ui/`, and `docs/workflows/`
- AI implementation prompts: `docs/prompts/`
- Cross-project index: `docs/ATLAS.md`
- Decisions: `docs/DECISIONS.md`
- Release notes: `docs/CHANGELOG.md`

## Testing Expectations

- Verify all required files exist.
- Verify the taxonomy directories exist.
- Verify `AGENTS.md` includes documentation-first instructions.
- Verify no application code changed.
- Verify generated documentation references `PHR-TECH-001`.

## Documentation Updates

- `docs/DOCUMENTATION_FIRST_DEVELOPMENT.md`
- `docs/templates/FeatureSpecificationTemplate.md`
- `docs/templates/ImplementationPromptTemplate.md`
- `docs/technical/PHR-TECH-001-documentation-first-development-system.md`
- `docs/prompts/PHR-TECH-001-implementation-prompt.md`
- `docs/ATLAS.md`
- `docs/DECISIONS.md`
- `docs/PROMPTS.md`
- `docs/AGENT_HANDOFF.md`
- `docs/CHANGELOG.md`
- `AGENTS.md`

## Acceptance Criteria

- Documentation-first workflow is discoverable by future AI agents.
- The feature specification template includes every required section.
- The implementation prompt template includes every required section.
- The repository has a visible taxonomy for documentation destinations.
- PHR-TECH-001 has end-to-end traceability.
- Application runtime code remains unchanged.

## Non-Goals

- No UI changes.
- No engine changes.
- No provider changes.
- No test runner changes.
- No package dependency changes.

## Notes For AI Coding Agents

- Preserve unrelated dirty worktree changes.
- Keep edits documentation-only.
- Update existing documentation rather than creating duplicate competing sources when possible.
