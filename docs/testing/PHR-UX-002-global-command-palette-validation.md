# PHR-UX-002 Validation

Automated validation covers workflow action labels and typed Vendor Workspace selection routing in `tests/command-palette.test.ts`. Existing image-cache validation covers canonical artwork reuse.

Static validation requires ESLint, TypeScript, a Next.js production build, and `git diff --check`.

Manual validation should verify Command-K and Control-K, Escape/back behavior, Arrow navigation, Enter selection, Tab focus, debounce cancellation, loading skeletons, exact empty-state copy, Market Watch addition, Vendor Workspace continuation, and that palette search produces identity requests only—never `/api/market/snapshot` or JustTCG requests.
