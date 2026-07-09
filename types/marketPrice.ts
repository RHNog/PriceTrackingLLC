export type PriceType =
  | "market_estimate"
  | "variant_valuation"
  | "lowest_known"
  | "buylist"
  | "recent_sale"
  | "manual";

export interface MarketPrice {
  id: string;
  cardId: string;
  printingId: string;
  variantId: string;
  providerId: string;
  source: string;
  currency: string;
  finish: string;
  price: number;
  priceType: PriceType;
  updatedAt: string;
  confidence: number;
  condition?: string;
  conditionSpecific?: boolean;
}
