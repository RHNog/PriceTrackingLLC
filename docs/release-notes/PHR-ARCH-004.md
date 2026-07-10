# PHR-ARCH-004 Release Note

Introduced the provider-agnostic Identity Platform. Application surfaces now call an Identity Orchestrator instead of constructing Scryfall. The registry exposes operational Magic/Scryfall capability and pending Lorcana, Pokémon, One Piece, and Flesh and Blood adapters.

Canonical results now retain provider identity, provider confidence, normalization source, canonical identity, artwork, conditions, printings, finishes, languages, and collector numbers. Known pending games receive explicit connection-status messages rather than false no-match results.
