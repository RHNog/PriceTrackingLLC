export type PriceSourceType =
  | "affiliate_market_estimate"
  | "marketplace_listing"
  | "manual";

export interface PriceSource {
  providerId: string;
  providerName: string;
  sourceType: PriceSourceType;
  sourceLabel: string;
}
