# PHR-ARCH-004 Validation

`tests/identity-platform.test.ts` covers the capability matrix, Mulan-to-Lorcast selection, Pokémon/One Piece/Flesh and Blood pending outcomes, operational canonical normalization, and temporary-offline classification.

Static validation requires ESLint, TypeScript, Next.js production build, and `git diff --check`. Architecture validation confirms application and feature layers have no concrete Scryfall imports and identity modules have no market-provider or market-snapshot dependency.

Local API validation initially confirmed pending Lorcana behavior. PHR-API-001 supersedes that state: Mulan now resolves operationally through Lorcast. Pokémon, One Piece, and Flesh and Blood remain `PROVIDER_PENDING`.

The focused TypeScript test file is included and is type-checked by the Next.js build. Direct Node execution cannot resolve the repository's `@/` aliases, and a transient unpinned runner was intentionally not installed.

Expected matrix:

| Game | Provider | Lifecycle |
|---|---|---|
| Magic | Scryfall | Operational |
| Lorcana | Lorcast | Operational |
| Pokémon | Pending adapter | Pending Connection |
| One Piece | Pending adapter | Pending Connection |
| Flesh and Blood | Pending adapter | Pending Connection |
