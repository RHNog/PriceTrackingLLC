export interface Decision {
  action: "BUY" | "NEGOTIATE" | "PASS";
  confidence: number;
  maximumPurchasePrice: number;
  negotiationMargin: number;
  expectedProfit: number;
  roi: number;
  explanation: string[];
}
