import type { MarketSnapshotField } from "@/lib/market/MarketSnapshotMetadata";

export type ProviderPriorityConfig = Record<
  MarketSnapshotField,
  Record<string, number>
>;

const defaultPriority = 10;

export const evidenceProviderPriority: ProviderPriorityConfig = {
  cardMetadata: {
    justtcg: 80,
    "scryfall-market": 70,
  },
  printingMetadata: {
    justtcg: 80,
    "scryfall-market": 70,
  },
  marketPrice: {
    consensus: 100,
    justtcg: 90,
    repository: 60,
    tcgplayer: 40,
    "tcgplayer-intelligence": 40,
    "scryfall-market": 30,
  },
  lowestListing: {
    consensus: 100,
    tcgplayer: 90,
    "tcgplayer-intelligence": 80,
    repository: 20,
  },
  listingCount: {
    consensus: 100,
    tcgplayer: 90,
    "tcgplayer-intelligence": 80,
    repository: 20,
  },
  recentSales: {
    consensus: 100,
    tcgplayer: 90,
    "tcgplayer-intelligence": 80,
    repository: 20,
  },
  spread: {
    consensus: 100,
    tcgplayer: 90,
    "tcgplayer-intelligence": 80,
    repository: 20,
  },
  liquidity: {
    consensus: 100,
    tcgplayer: 90,
    "tcgplayer-intelligence": 80,
    justtcg: 40,
    repository: 20,
  },
  salesVelocity: {
    consensus: 100,
    tcgplayer: 90,
    "tcgplayer-intelligence": 80,
    repository: 20,
  },
  volatility: {
    consensus: 100,
    tcgplayer: 90,
    "tcgplayer-intelligence": 80,
    justtcg: 80,
    repository: 20,
  },
  marketConfidence: {
    consensus: 100,
    tcgplayer: 90,
    "tcgplayer-intelligence": 80,
    justtcg: 80,
    "scryfall-market": 60,
    repository: 20,
  },
  providerHealth: {
    justtcg: 90,
    tcgplayer: 80,
    "scryfall-market": 60,
  },
  providerCapabilities: {
    justtcg: 90,
    tcgplayer: 80,
    "scryfall-market": 60,
  },
};

function normalizeProvider(providerName: string) {
  return providerName.toLowerCase().trim();
}

export function getEvidencePriority(input: {
  field: MarketSnapshotField;
  providerName: string;
  priorityConfig?: ProviderPriorityConfig;
}) {
  const priorities = input.priorityConfig ?? evidenceProviderPriority;
  const normalizedProvider = normalizeProvider(input.providerName);

  return priorities[input.field][normalizedProvider] ?? defaultPriority;
}
