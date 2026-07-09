import type { MarketMomentum } from "@/lib/market/intelligence/MarketTrendInterpreter";
import type { MarketVolatilityLevel } from "@/lib/market/intelligence/MarketVolatilityInterpreter";

export type BuyingOpportunityRating =
  | "Very Strong"
  | "Strong"
  | "Moderate"
  | "Weak"
  | "Very Weak"
  | "Unknown";

export function createBuyingOpportunity(input: {
  confidenceScore: number;
  historicalPosition: number | null;
  momentum: MarketMomentum;
  volatilityLevel: MarketVolatilityLevel;
}): BuyingOpportunityRating {
  if (input.historicalPosition === null || input.confidenceScore < 25) {
    return "Unknown";
  }

  let score = 50;

  if (input.historicalPosition <= 0.25) {
    score += 25;
  } else if (input.historicalPosition <= 0.45) {
    score += 15;
  } else if (input.historicalPosition >= 0.8) {
    score -= 25;
  } else if (input.historicalPosition >= 0.65) {
    score -= 12;
  }

  if (input.momentum === "Positive") {
    score += 8;
  }

  if (input.momentum === "Strong Positive") {
    score += 14;
  }

  if (input.momentum === "Negative") {
    score -= 8;
  }

  if (input.momentum === "Strong Negative") {
    score -= 16;
  }

  if (input.volatilityLevel === "Low") {
    score += 8;
  }

  if (input.volatilityLevel === "High") {
    score -= 15;
  }

  if (input.confidenceScore < 50) {
    score -= 15;
  }

  if (score >= 82) {
    return "Very Strong";
  }

  if (score >= 65) {
    return "Strong";
  }

  if (score >= 45) {
    return "Moderate";
  }

  if (score >= 25) {
    return "Weak";
  }

  return "Very Weak";
}
