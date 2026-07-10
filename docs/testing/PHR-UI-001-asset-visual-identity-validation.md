# PHR-UI-001 Validation

Automated coverage validates provider-neutral source priority, size selection, repeated resolution cache state, invalidation, and placeholder fallback in `tests/card-image-cache.test.ts`.

Static validation covers TypeScript, ESLint, and the Next.js production build. Seed validation covers Mox Opal (SOM 179), Lightning Bolt (M11 149), Collected Company (DTK 177), and Elsa – Spirit of Winter (The First Chapter 42) using repository-owned normalized artwork URLs.

Manual browser validation should confirm lazy network loading, no duplicate optimized image transfer across client navigation, hover/selected styling, and fallback behavior under a blocked image request.
