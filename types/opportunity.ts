export interface Opportunity {
  id: string;
  cardId: string;
  buyListingId: string;
  sellListingId: string;
  watchlistId: string;
  estimatedFees: number;
  shippingCost: number;
  expectedProfit: number;
  roi: number;
  confidence: number;
  detectedAt: string;
}
