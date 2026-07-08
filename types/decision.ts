export interface Decision {
  action: "BUY" | "NEGOTIATE" | "PASS";
  confidence: number;
  maximumPurchasePrice: number;
  negotiationMargin: number;
  recommendedOffer: number;
  expectedProfit: number;
  estimatedMargin: number;
  roi: number;
  explanation: string[];
}
