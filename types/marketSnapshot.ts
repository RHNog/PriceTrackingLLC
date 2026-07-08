import type { MarketPrice } from "@/types/marketPrice";

export type MarketTrend = "Increasing" | "Stable" | "Declining" | "Unknown";

export interface MarketPriceHistoryPoint {
  date: string;
  price: number;
}

export interface MarketIntelligenceEvidence {
  apiStatus: "LIVE" | "FALLBACK" | "UNAVAILABLE";
  demandMomentum: number;
  directLow: number | null;
  evidenceCoverage: number;
  healthStatus: string;
  inventoryHealth: number;
  lastSynchronizedAt: string;
  latencyMs: number | null;
  liquidity: number;
  listingCount: number;
  lowestListing: number | null;
  marketConfidence: number;
  marketPrice: number | null;
  marketStability: number;
  priceHistory: MarketPriceHistoryPoint[];
  providerId: string;
  providerName: string;
  recentSalesCount: number;
  salesVelocity: number;
  spread: number;
  trend: MarketTrend;
  volatility: number;
}

export interface MarketSnapshot {
  printingId: string;
  variantId: string;
  prices: MarketPrice[];
  providerId: string;
  updatedAt: string;
  sourceLabel: string;
  rawPrices?: Record<string, string | null | undefined>;
  marketIntelligence?: MarketIntelligenceEvidence;
  durationMs?: number;
  errorMessage?: string;
  priceMissing?: boolean;
}
