import type { MarketSnapshotField } from "@/lib/market/MarketSnapshotMetadata";

export interface MarketFieldRefreshPolicy {
  field: MarketSnapshotField;
  reason: string;
  ttlMs: number;
}

const minute = 60 * 1000;
const hour = 60 * minute;
const day = 24 * hour;

export const marketRefreshPolicies: Record<
  MarketSnapshotField,
  MarketFieldRefreshPolicy
> = {
  cardMetadata: {
    field: "cardMetadata",
    ttlMs: 30 * day,
    reason: "Card metadata is practically static.",
  },
  printingMetadata: {
    field: "printingMetadata",
    ttlMs: 30 * day,
    reason: "Printing metadata is practically static.",
  },
  marketPrice: {
    field: "marketPrice",
    ttlMs: 6 * hour,
    reason: "Market price changes during trading sessions but does not require minute-level refresh.",
  },
  lowestListing: {
    field: "lowestListing",
    ttlMs: 15 * minute,
    reason: "Lowest listing can move quickly as inventory changes.",
  },
  listingCount: {
    field: "listingCount",
    ttlMs: 15 * minute,
    reason: "Listing count reflects near-term inventory depth.",
  },
  recentSales: {
    field: "recentSales",
    ttlMs: 30 * minute,
    reason: "Recent sales are active demand evidence with moderate churn.",
  },
  spread: {
    field: "spread",
    ttlMs: 30 * minute,
    reason: "Spread depends on current market price and lowest listing.",
  },
  liquidity: {
    field: "liquidity",
    ttlMs: 30 * minute,
    reason: "Liquidity should track inventory and sales movement.",
  },
  salesVelocity: {
    field: "salesVelocity",
    ttlMs: 2 * hour,
    reason: "Sales velocity changes slower than listings but faster than long-run volatility.",
  },
  volatility: {
    field: "volatility",
    ttlMs: 12 * hour,
    reason: "Volatility is a slower statistical signal.",
  },
  marketConfidence: {
    field: "marketConfidence",
    ttlMs: 2 * hour,
    reason: "Market confidence depends on evidence completeness and provider freshness.",
  },
  providerHealth: {
    field: "providerHealth",
    ttlMs: 5 * minute,
    reason: "Provider health should be checked frequently without coupling it to market values.",
  },
  providerCapabilities: {
    field: "providerCapabilities",
    ttlMs: 24 * hour,
    reason: "Provider capabilities rarely change during a work session.",
  },
};

export const marketSnapshotFields = Object.keys(
  marketRefreshPolicies,
) as MarketSnapshotField[];

export function getMarketRefreshPolicy(field: MarketSnapshotField) {
  return marketRefreshPolicies[field];
}
