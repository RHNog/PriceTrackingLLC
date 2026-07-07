import type { Card } from "@/types/card";
import type { Listing } from "@/types/listing";

export interface MarketplaceProvider {
  readonly id: string;
  readonly name: string;
  getCard(cardId: string): Promise<Card | null>;
  getListings(cardId: string): Promise<Listing[]>;
  getRecentSales(cardId: string): Promise<Listing[]>;
}
