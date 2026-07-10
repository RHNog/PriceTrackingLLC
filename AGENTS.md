<!-- BEGIN:documentation-first-development -->
# Documentation-First Development

Documentation is part of implementation for Project Phronesis.

Before or alongside any meaningful feature, enhancement, architecture decision, workflow improvement, optimization, refactor, technical-debt item, business rule, API change, database change, UI/UX change, infrastructure change, or architecturally relevant bug fix:

1. Identify the change category.
2. Create or update a feature specification using `docs/templates/FeatureSpecificationTemplate.md`.
3. Assign or preserve a permanent Feature ID such as `PHR-TECH-001`.
4. Classify the documentation destination under `docs/`.
5. Generate or update an AI-ready implementation prompt using `docs/templates/ImplementationPromptTemplate.md` when implementation work is required.
6. Update dependent documentation such as Atlas, Decisions, Roadmap, Release Notes, Testing, or Prompt History when relevant.

The system contract lives in `docs/DOCUMENTATION_FIRST_DEVELOPMENT.md`.

Implementation follows documentation. Do not let documentation become stale.
<!-- END:documentation-first-development -->

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
