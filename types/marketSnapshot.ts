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

export interface MarketProviderRawObservation {
  observedAt: string;
  providerField: string;
  providerName: string;
  rawValue: boolean | number | string | null;
  unit?: string;
}

export interface MarketEvidenceDiagnostics {
  conditionSpecific: boolean;
  coverage?: {
    domainName: string;
    freshness: string;
    status: string;
  }[];
  evidenceSource: string | null;
  evidenceNodeId: string | null;
  fallbackReason: string;
  fallbackUsed: boolean;
  finish: string;
  mergeResult?: string;
  missingEvidence?: string[];
  providerCondition: string | null;
  providersQueried?: string[];
  providersSkipped?: {
    providerName: string;
    reason: string;
  }[];
  projectionUsed: boolean;
  requestedCondition: string;
  requestedUiField: string | null;
  resolvedEvidenceDomain: string | null;
  selectedProvider: string | null;
}

export interface MarketSnapshotIdentityEvidence {
  canonicalName?: string | null;
  collectorNumber?: string | null;
  condition?: string | null;
  finish?: string | null;
  game?: string | null;
  language?: string | null;
  productIdentifier?: string | null;
  providerTimestamp?: string | null;
}

export interface MarketSnapshot {
  printingId: string;
  variantId: string;
  prices: MarketPrice[];
  providerId: string;
  updatedAt: string;
  sourceLabel: string;
  identityEvidence?: MarketSnapshotIdentityEvidence;
  rawObservations?: MarketProviderRawObservation[];
  rawPrices?: Record<string, string | null | undefined>;
  marketIntelligence?: MarketIntelligenceEvidence;
  marketEvidenceDiagnostics?: MarketEvidenceDiagnostics;
  durationMs?: number;
  errorMessage?: string;
  priceMissing?: boolean;
}
