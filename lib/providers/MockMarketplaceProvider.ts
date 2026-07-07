import { mockCards } from "@/data/mockCards";
import { mockListings } from "@/data/mockListings";
import type { MarketplaceProvider } from "@/types/provider";

const supportedCardId = "store-championship-urzas-saga-textless";
const recentSaleIds = [
  "sale-store-championship-urzas-saga-tcgplayer-1",
  "sale-store-championship-urzas-saga-card-kingdom-1",
];

export class MockMarketplaceProvider implements MarketplaceProvider {
  readonly id = "mock";
  readonly name = "Mock Marketplace Provider";

  async getCard(cardId: string) {
    if (cardId !== supportedCardId) {
      return null;
    }

    return mockCards.find((card) => card.id === supportedCardId) ?? null;
  }

  async getListings(cardId: string) {
    return mockListings.filter(
      (listing) =>
        listing.cardId === cardId && !recentSaleIds.includes(listing.id),
    );
  }

  async getRecentSales(cardId: string) {
    return mockListings.filter(
      (listing) =>
        listing.cardId === cardId && recentSaleIds.includes(listing.id),
    );
  }
}
