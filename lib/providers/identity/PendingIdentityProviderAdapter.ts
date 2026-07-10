import { CanonicalCardIdentityAdapter } from "@/lib/engines/identity/IdentityProviderAdapter";
import type { IdentityProvider } from "@/lib/engines/identity/IdentityProvider";
import type { Card } from "@/types/card";

export abstract class PendingIdentityProviderAdapter implements IdentityProvider {
  abstract readonly id: string;
  abstract readonly name: string;
  abstract readonly game: Card["game"];

  get adapter() {
    return new CanonicalCardIdentityAdapter(`${this.name}PendingAdapter`, this.id);
  }

  get capability() {
    return {
      artwork: true,
      conditions: false,
      finishes: true,
      games: [this.game],
      languages: true,
      lifecycle: "PENDING_CONNECTION" as const,
      printings: true,
    };
  }

  async searchCards() {
    return [];
  }

  async getCard() {
    return null;
  }
}
