import type { MarketSignal } from "@/lib/market/intelligence/MarketSignal";

export type MarketHealthRating = "Excellent" | "Healthy" | "Neutral" | "Weak" | "Distressed";

export function createMarketHealth(input: {
  confidenceScore: number;
  historicalPositionScore: number;
  momentumScore: number;
  signals: MarketSignal[];
  stabilityScore: number;
}): MarketHealthRating {
  const positiveSignals = input.signals.filter((signal) => signal.polarity === "POSITIVE").length;
  const negativeSignals = input.signals.filter((signal) => signal.polarity === "NEGATIVE").length;
  const score = Math.round(
    input.stabilityScore * 0.3 +
      input.momentumScore * 0.25 +
      input.historicalPositionScore * 0.25 +
      input.confidenceScore * 0.2 +
      (positiveSignals - negativeSignals) * 4,
  );

  if (score >= 82) {
    return "Excellent";
  }

  if (score >= 65) {
    return "Healthy";
  }

  if (score >= 45) {
    return "Neutral";
  }

  if (score >= 25) {
    return "Weak";
  }

  return "Distressed";
}
