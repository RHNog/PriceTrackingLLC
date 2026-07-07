export interface OpportunityRanking {
  score: number;
  grade: "S" | "A" | "B" | "C" | "D";
  explanation: string[];
}

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
  detectedAt: string;
}

export interface RankedOpportunity extends Opportunity {
  score: number;
  ranking: OpportunityRanking;
}
