import { PendingIdentityProviderAdapter } from "@/lib/providers/identity/PendingIdentityProviderAdapter";

export class PokemonIdentityProviderAdapter extends PendingIdentityProviderAdapter {
  readonly id = "pokemon-pending";
  readonly name = "Pokémon";
  readonly game = "Pokemon" as const;
}
