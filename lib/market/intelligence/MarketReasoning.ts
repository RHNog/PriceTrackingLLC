import type { BuyingOpportunityRating } from "@/lib/market/intelligence/MarketOpportunity";
import type { MarketSignal } from "@/lib/market/intelligence/MarketSignal";
import type { MarketHealthRating } from "@/lib/market/intelligence/MarketHealth";
import type { MarketMomentum } from "@/lib/market/intelligence/MarketTrendInterpreter";
import type { MarketVolatilityLevel } from "@/lib/market/intelligence/MarketVolatilityInterpreter";

export function createMarketReasoning(input: {
  buyingOpportunity: BuyingOpportunityRating;
  confidenceLabel: string;
  currentPrice: number | null;
  health: MarketHealthRating;
  historicalPosition: number | null;
  momentum: MarketMomentum;
  signals: MarketSignal[];
  volatilityLevel: MarketVolatilityLevel;
}): string[] {
  const reasoning: string[] = [];
  const positionText = describeHistoricalPosition(input.historicalPosition);
  const leadingSignals = input.signals.slice(0, 3).map((signal) => signal.name);

  reasoning.push(
    `Market health is ${input.health} because current valuation is ${positionText}, momentum is ${input.momentum.toLowerCase()}, and volatility is ${input.volatilityLevel.toLowerCase()}.`,
  );

  if (typeof input.currentPrice === "number") {
    reasoning.push(
      `Current variant valuation is ${formatCurrency(input.currentPrice)}, interpreted against observed historical range rather than business targets.`,
    );
  }

  if (leadingSignals.length) {
    reasoning.push(`Primary market signals: ${leadingSignals.join(", ")}.`);
  }

  reasoning.push(
    `Buying opportunity is ${input.buyingOpportunity} from market structure only: trend, volatility, historical range, valuation, and evidence confidence.`,
  );
  reasoning.push(
    `Confidence is ${input.confidenceLabel}; this measures coverage, freshness, provider quality, and observation density, not whether the market is attractive.`,
  );

  return reasoning;
}

function describeHistoricalPosition(position: number | null) {
  if (position === null) {
    return "not located within a usable historical range";
  }

  if (position <= 0.25) {
    return "near the lower portion of its observed range";
  }

  if (position >= 0.75) {
    return "near the upper portion of its observed range";
  }

  return "inside the middle portion of its observed range";
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: value >= 100 ? 0 : 2,
    style: "currency",
  }).format(value);
}
