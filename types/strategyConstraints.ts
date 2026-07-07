import type { Card } from "@/types/card";

export interface StrategyConstraints {
  minimumProfit: number;
  minimumROI: number;
  maximumPurchasePrice: number;
  minimumOpportunityScore: number;
  allowedGames: Card["game"][];
  allowedMarketplaces: string[];
}
