export type MarketSnapshotField =
  | "cardMetadata"
  | "printingMetadata"
  | "marketPrice"
  | "lowestListing"
  | "listingCount"
  | "recentSales"
  | "spread"
  | "liquidity"
  | "salesVelocity"
  | "volatility"
  | "marketConfidence"
  | "providerHealth"
  | "providerCapabilities";

export type MarketSnapshotFreshness = "Fresh" | "Stale" | "Expired" | "Missing";

export interface MarketSnapshotFieldMetadata {
  field: MarketSnapshotField;
  freshness: MarketSnapshotFreshness;
  lastRefresh: string | null;
  expiresAt: string | null;
  ttlMs: number;
}

export interface MarketSnapshotMetadata {
  createdAt: string;
  expiresAt: string;
  fieldMetadata: Record<MarketSnapshotField, MarketSnapshotFieldMetadata>;
  lastRefresh: string;
  provider: string;
  snapshotVersion: string;
  updatedAt: string;
}
