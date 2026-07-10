# PHR-ARCH-007 — Cross-Game Identity Ontology

Migrated canonical collectible identity to Gameplay, Printing, Physical Variant, and Market Identity layers. Market Observation, Inventory Instance, and OwnershipRelationship are independent contracts.

Scryfall now maps Oracle, print, finish, and market identifiers to their correct layers. Lorcast rarity produces Printing Design Facets but never physical finish; absent Lorcast finish evidence reports `Provider Does Not Supply`. TCGplayer Product and SKU semantics are modeled separately.

Compatibility projections and hydration preserve existing Command Palette, Vendor Workspace, Market Watch, repository, and replay behavior.
