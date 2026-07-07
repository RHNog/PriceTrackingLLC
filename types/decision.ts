export interface Decision {
  action: "BUY" | "NEGOTIATE" | "PASS";
  confidence: number;
  maximumPurchasePrice: number;
  expectedProfit: number;
  roi: number;
  explanation: string[];
}
