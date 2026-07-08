import type { MarketPrice } from "@/types/marketPrice";

export interface MarketSnapshot {
  printingId: string;
  variantId: string;
  prices: MarketPrice[];
  providerId: string;
  updatedAt: string;
  sourceLabel: string;
  rawPrices?: Record<string, string | null | undefined>;
  durationMs?: number;
  errorMessage?: string;
  priceMissing?: boolean;
}
