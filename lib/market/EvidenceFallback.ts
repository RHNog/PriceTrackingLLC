import type { MarketSnapshotField } from "@/lib/market/MarketSnapshotMetadata";

export type EvidenceFallbackStep = {
  label: string;
  providerName: string;
};

export type EvidenceFallbackConfig = Record<MarketSnapshotField, EvidenceFallbackStep[]>;

const repositoryFallback = {
  label: "Repository Snapshot",
  providerName: "repository",
};

const unavailableFallback = {
  label: "No connected provider currently supplies this evidence",
  providerName: "no-connected-provider",
};

export const evidenceFallbackChains: EvidenceFallbackConfig = {
  cardMetadata: [
    { label: "JustTCG Card Metadata", providerName: "justtcg" },
    { label: "Scryfall Card Metadata", providerName: "scryfall-market" },
    repositoryFallback,
    unavailableFallback,
  ],
  printingMetadata: [
    { label: "JustTCG Printing Metadata", providerName: "justtcg" },
    { label: "Scryfall Printing Metadata", providerName: "scryfall-market" },
    repositoryFallback,
    unavailableFallback,
  ],
  marketPrice: [
    { label: "Consensus", providerName: "consensus" },
    { label: "TCGplayer Market Estimate", providerName: "TCGplayer" },
    { label: "JustTCG Market Estimate", providerName: "justtcg" },
    { label: "Scryfall Market Estimate", providerName: "scryfall-market" },
    repositoryFallback,
    unavailableFallback,
  ],
  lowestListing: [
    { label: "TCGplayer Lowest Listing", providerName: "TCGplayer" },
    repositoryFallback,
    unavailableFallback,
  ],
  listingCount: [
    { label: "TCGplayer Listing Count", providerName: "TCGplayer" },
    repositoryFallback,
    unavailableFallback,
  ],
  recentSales: [
    { label: "TCGplayer Recent Sales", providerName: "TCGplayer" },
    repositoryFallback,
    unavailableFallback,
  ],
  spread: [
    { label: "TCGplayer Spread", providerName: "TCGplayer" },
    repositoryFallback,
    unavailableFallback,
  ],
  liquidity: [
    { label: "TCGplayer Liquidity", providerName: "TCGplayer" },
    repositoryFallback,
    unavailableFallback,
  ],
  salesVelocity: [
    { label: "TCGplayer Sales Velocity", providerName: "TCGplayer" },
    repositoryFallback,
    unavailableFallback,
  ],
  volatility: [
    { label: "TCGplayer Volatility", providerName: "TCGplayer" },
    { label: "JustTCG Volatility", providerName: "justtcg" },
    repositoryFallback,
    unavailableFallback,
  ],
  marketConfidence: [
    { label: "Consensus", providerName: "consensus" },
    { label: "TCGplayer Market Confidence", providerName: "TCGplayer" },
    { label: "JustTCG Market Confidence", providerName: "justtcg" },
    { label: "Scryfall Market Confidence", providerName: "scryfall-market" },
    repositoryFallback,
    unavailableFallback,
  ],
  providerHealth: [
    { label: "TCGplayer Provider Health", providerName: "TCGplayer" },
    { label: "JustTCG Provider Health", providerName: "justtcg" },
    repositoryFallback,
    unavailableFallback,
  ],
  providerCapabilities: [
    { label: "TCGplayer Provider Capabilities", providerName: "TCGplayer" },
    { label: "JustTCG Provider Capabilities", providerName: "justtcg" },
    repositoryFallback,
    unavailableFallback,
  ],
};

export function getEvidenceFallbackChain(
  field: MarketSnapshotField,
  fallbackConfig = evidenceFallbackChains,
) {
  return fallbackConfig[field];
}
