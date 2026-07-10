import type { Card } from "@/types/card";
import type { IdentityProvider } from "@/lib/engines/identity/IdentityProvider";

export class IdentityProviderRegistry {
  private providers = new Map<string, IdentityProvider>();

  register(provider: IdentityProvider) {
    this.providers.set(provider.id, provider);
    return this;
  }

  get(providerId: string) {
    return this.providers.get(providerId);
  }

  getForGame(game: Card["game"]) {
    return this.getAll().filter((provider) => provider.capability.games.includes(game));
  }

  getAll() {
    return [...this.providers.values()];
  }

  getCapabilityMatrix() {
    return this.getAll().map((provider) => ({
      ...provider.capability,
      providerId: provider.id,
      providerName: provider.name,
    }));
  }
}
