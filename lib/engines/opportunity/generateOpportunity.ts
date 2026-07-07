import { calculateNetProfit } from "@/lib/engines/profit/calculateNetProfit";
import type { Opportunity } from "@/types/opportunity";
import type { Listing } from "@/types/listing";
import type { MarketProvider } from "@/types/marketProvider";

const DEFAULT_MARKETPLACE_FEES = 46;
const DEFAULT_SHIPPING_COST = 18;
const DEFAULT_WATCHLIST_ID = "cards-to-watch";

function sortByLowestPrice(first: Listing, second: Listing) {
  return first.price - second.price;
}

function sortByHighestPrice(first: Listing, second: Listing) {
  return second.price - first.price;
}

function calculateRoi(profit: number, purchasePrice: number) {
  if (purchasePrice <= 0) {
    return 0;
  }

  return Math.round((profit / purchasePrice) * 1000) / 10;
}

export async function generateOpportunity(
  provider: MarketProvider,
  cardId: string,
): Promise<Opportunity | null> {
  const listings = await provider.getListings(cardId);
  const recentSales = await provider.getRecentSales(cardId);
  const buyListing = [...listings].sort(sortByLowestPrice)[0];
  const sellListing = [...recentSales].sort(sortByHighestPrice)[0];

  if (!buyListing || !sellListing) {
    return null;
  }

  const profit = calculateNetProfit({
    purchasePrice: buyListing.price,
    sellPrice: sellListing.price,
    marketplaceFees: DEFAULT_MARKETPLACE_FEES,
    shippingCost: DEFAULT_SHIPPING_COST,
  });
  const roi = calculateRoi(profit.netProfit, buyListing.price);
  return {
    id: `${provider.id}-${cardId}`,
    cardId,
    buyListingId: buyListing.id,
    sellListingId: sellListing.id,
    watchlistId: DEFAULT_WATCHLIST_ID,
    estimatedFees: DEFAULT_MARKETPLACE_FEES,
    shippingCost: DEFAULT_SHIPPING_COST,
    profit: profit.netProfit,
    paymentFee: profit.paymentFee,
    totalCosts: profit.totalCosts,
    roi,
    detectedAt: "Now",
  };
}
