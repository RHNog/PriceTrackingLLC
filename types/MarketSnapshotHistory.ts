import type { MarketPrice } from "@/types/marketPrice";

export interface MarketSnapshotHistory {
  confidence: number;
  currency: string;
  marketSnapshotId: string;
  price: number;
  priceType: MarketPrice["priceType"];
  providerId: string;
  source: string;
  updatedAt: string;
}
