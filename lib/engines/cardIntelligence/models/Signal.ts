export type SignalName =
  | "InvestmentPotential"
  | "FlipPotential"
  | "GradingPotential"
  | "CollectorAppeal"
  | "Liquidity"
  | "Volatility"
  | "Scarcity"
  | "Demand"
  | "Playability"
  | "ReprintRisk"
  | "MarketConfidence"
  | "HistoricalStability";

export type SignalStatus = "live" | "estimated" | "placeholder" | "future";

export interface Signal {
  name: SignalName;
  label: string;
  score: number;
  confidence: number;
  version: string;
  contributingFactors: string[];
  supportingDataSources: string[];
  generatedAt: string;
  source: string;
  explanation: string;
  status: SignalStatus;
}
