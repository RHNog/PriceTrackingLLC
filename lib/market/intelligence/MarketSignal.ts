export type MarketSignalPolarity = "POSITIVE" | "NEUTRAL" | "NEGATIVE";

export type MarketSignalStrength = "LOW" | "MODERATE" | "HIGH";

export type MarketSignalId =
  | "cooling-demand"
  | "evidence-coverage-moderate"
  | "healthy-uptrend"
  | "high-price-volatility"
  | "historical-recovery"
  | "low-volatility"
  | "market-consolidation"
  | "near-historical-high"
  | "near-historical-low"
  | "price-compression"
  | "price-expansion"
  | "provider-confidence-high"
  | "recovering-market"
  | "stable-price-history"
  | "strong-momentum"
  | "weak-momentum";

export interface MarketSignal {
  confidence: number;
  contributingObservations: string[];
  explanation: string;
  id: MarketSignalId;
  name: string;
  polarity: MarketSignalPolarity;
  score: number;
  strength: MarketSignalStrength;
}
