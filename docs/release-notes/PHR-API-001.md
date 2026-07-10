# PHR-API-001 Release Note

Connected Lorcast as the operational Lorcana Identity Provider through PHR-ARCH-004. Lorcana search now returns real canonical identities, all matching printings, collector numbers, sets, languages, ink/type metadata, TCGplayer identifiers, and API-returned artwork.

Lorcast searches use `unique=prints`, a 24-hour in-memory identity cache, identical-request coalescing, and 75ms request spacing. Lorcast prices are deliberately discarded and never enter identity or market models.
