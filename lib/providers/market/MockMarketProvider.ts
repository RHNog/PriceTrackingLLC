import { mockListings } from "@/data/mockListings";
import type { MarketProvider } from "@/types/marketProvider";

const recentSaleIds = [
  "sale-store-championship-urzas-saga-tcgplayer-1",
  "sale-store-championship-urzas-saga-card-kingdom-1",
];
const fallbackCardId = "store-championship-urzas-saga-textless";

function getMockCardId(cardId: string) {
  const hasMockListings = mockListings.some((listing) => listing.cardId === cardId);

  return hasMockListings ? cardId : fallbackCardId;
}

export class MockMarketProvider implements MarketProvider {
  readonly id = "mock";
  readonly name = "Mock Market Provider";

  async getListings(cardId: string) {
    const mockCardId = getMockCardId(cardId);

    return mockListings.filter(
      (listing) =>
        listing.cardId === mockCardId && !recentSaleIds.includes(listing.id),
    );
  }

  async getRecentSales(cardId: string) {
    const mockCardId = getMockCardId(cardId);

    return mockListings.filter(
      (listing) =>
        listing.cardId === mockCardId && recentSaleIds.includes(listing.id),
    );
  }
}
