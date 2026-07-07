export interface Opportunity {
  id: string;
  cardId: string;
  buyListingId: string;
  sellListingId: string;
  watchlistId: string;
  estimatedFees: number;
  shippingCost: number;
  profit: number;
  paymentFee: number;
  totalCosts: number;
  roi: number;
  score: number;
  detectedAt: string;
}
