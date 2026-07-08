import type { PlayabilityFormat } from "@/lib/intelligence/playability/PlayabilityIndicator";
import type { PlayabilityProvider } from "@/lib/intelligence/playability/PlayabilityProvider";

export const playabilityFormats: PlayabilityFormat[] = [
  "Overall",
  "Commander",
  "Modern",
  "Legacy",
  "Vintage",
  "Pioneer",
  "Standard",
  "Pauper",
  "Explorer",
  "Canadian Highlander",
];

export class PlayabilityRegistry {
  private providers: PlayabilityProvider[] = [];

  register(provider: PlayabilityProvider) {
    this.providers = [
      ...this.providers.filter((item) => item.id !== provider.id),
      provider,
    ];
  }

  getProviders() {
    return this.providers;
  }

  getProviderForFormat(format: PlayabilityFormat) {
    return this.providers.find((provider) =>
      provider.supportedFormats.includes(format),
    );
  }
}

export const playabilityRegistry = new PlayabilityRegistry();

