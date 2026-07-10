import type { Card } from "@/types/card";
import type { IdentityProvider } from "@/lib/engines/identity/IdentityProvider";
import type { IdentityProviderRegistry } from "@/lib/engines/identity/IdentityProviderRegistry";
import { gameIdentityHints } from "@/data/identity/gameIdentityHints";

export type IdentitySearchContext = {
  game?: Card["game"];
  query: string;
  userPreferredProviderId?: string;
};

export type IdentityProviderSelection = {
  fallbackProvider?: string;
  game: Card["game"];
  provider?: IdentityProvider;
  reason: string;
};

function inferGame(query: string): Card["game"] | undefined {
  const normalized = query.toLowerCase();
  return gameIdentityHints.find((entry) =>
    entry.terms.some((term) => normalized.includes(term)),
  )?.game;
}

export function selectIdentityProvider(
  registry: IdentityProviderRegistry,
  context: IdentitySearchContext,
): IdentityProviderSelection {
  const fallback = registry.getForGame("Magic")[0];
  const game = context.game ?? inferGame(context.query) ?? "Magic";
  const providers = registry.getForGame(game);
  const preferred = context.userPreferredProviderId
    ? providers.find((provider) => provider.id === context.userPreferredProviderId)
    : undefined;
  const provider = preferred ?? providers[0];

  return {
    fallbackProvider: context.game || inferGame(context.query) ? undefined : fallback?.name,
    game,
    provider,
    reason: context.game
      ? "Selected from explicit game context."
      : inferGame(context.query)
        ? "Selected from recognized collectible identity context."
        : "No game context was resolved; used the configured Magic fallback.",
  };
}
