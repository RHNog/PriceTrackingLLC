import type { Listing } from "@/types/listing";
import type { MarketSnapshot } from "@/types/marketSnapshot";

export interface MarketProvider {
  readonly id: string;
  readonly name: string;
  getListings(cardId: string): Promise<Listing[]>;
  getRecentSales(cardId: string): Promise<Listing[]>;
  getMarketSnapshot?(
    printingId: string,
    variantId: string,
  ): Promise<MarketSnapshot>;
}
