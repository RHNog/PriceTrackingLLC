import type {
  MarketSignal,
  MarketSignalId,
  MarketSignalPolarity,
  MarketSignalStrength,
} from "@/lib/market/intelligence/MarketSignal";

type MarketSignalDefinition = {
  id: MarketSignalId;
  name: string;
  polarity: MarketSignalPolarity;
};

export const marketSignalRegistry: MarketSignalDefinition[] = [
  { id: "stable-price-history", name: "Stable Price History", polarity: "POSITIVE" },
  { id: "healthy-uptrend", name: "Healthy Uptrend", polarity: "POSITIVE" },
  { id: "recovering-market", name: "Recovering Market", polarity: "POSITIVE" },
  { id: "cooling-demand", name: "Cooling Demand", polarity: "NEGATIVE" },
  { id: "high-price-volatility", name: "High Price Volatility", polarity: "NEGATIVE" },
  { id: "low-volatility", name: "Low Volatility", polarity: "POSITIVE" },
  { id: "strong-momentum", name: "Strong Momentum", polarity: "POSITIVE" },
  { id: "weak-momentum", name: "Weak Momentum", polarity: "NEGATIVE" },
  { id: "price-compression", name: "Price Compression", polarity: "POSITIVE" },
  { id: "price-expansion", name: "Price Expansion", polarity: "NEGATIVE" },
  { id: "near-historical-low", name: "Near Historical Low", polarity: "POSITIVE" },
  { id: "near-historical-high", name: "Near Historical High", polarity: "NEGATIVE" },
  { id: "historical-recovery", name: "Historical Recovery", polarity: "POSITIVE" },
  { id: "market-consolidation", name: "Market Consolidation", polarity: "NEUTRAL" },
  { id: "provider-confidence-high", name: "Provider Confidence High", polarity: "POSITIVE" },
  { id: "evidence-coverage-moderate", name: "Evidence Coverage Moderate", polarity: "NEUTRAL" },
];

export function createMarketSignal(input: {
  confidence: number;
  contributingObservations: string[];
  explanation: string;
  id: MarketSignalId;
  score: number;
  strength?: MarketSignalStrength;
}): MarketSignal {
  const definition = marketSignalRegistry.find((signal) => signal.id === input.id);

  if (!definition) {
    throw new Error(`Unknown market signal: ${input.id}`);
  }

  return {
    confidence: clampScore(input.confidence),
    contributingObservations: input.contributingObservations,
    explanation: input.explanation,
    id: definition.id,
    name: definition.name,
    polarity: definition.polarity,
    score: clampScore(input.score),
    strength: input.strength ?? getSignalStrength(input.score),
  };
}

function getSignalStrength(score: number): MarketSignalStrength {
  if (score >= 75) {
    return "HIGH";
  }

  if (score >= 45) {
    return "MODERATE";
  }

  return "LOW";
}

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}
