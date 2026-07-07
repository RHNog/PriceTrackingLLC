import type { Listing } from "@/types/listing";

export interface MarketProvider {
  readonly id: string;
  readonly name: string;
  getListings(cardId: string): Promise<Listing[]>;
  getRecentSales(cardId: string): Promise<Listing[]>;
}
