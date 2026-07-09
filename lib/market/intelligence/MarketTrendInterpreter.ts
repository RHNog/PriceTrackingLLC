export type MarketMomentum = "Strong Positive" | "Positive" | "Stable" | "Negative" | "Strong Negative" | "Unknown";

export interface MarketTrendInterpretation {
  momentum: MarketMomentum;
  momentumScore: number;
  primaryChangePct: number | null;
  trendSlope: number | null;
}

export function interpretMarketTrend(input: {
  priceChange7d: number | null;
  priceChange30d: number | null;
  priceChange90d: number | null;
  trendSlope7d: number | null;
  trendSlope30d: number | null;
  trendSlope90d: number | null;
}): MarketTrendInterpretation {
  const primaryChangePct =
    input.priceChange30d ?? input.priceChange7d ?? input.priceChange90d;
  const trendSlope =
    input.trendSlope30d ?? input.trendSlope7d ?? input.trendSlope90d;
  const combined = primaryChangePct ?? trendSlope;

  if (combined === null || combined === undefined) {
    return {
      momentum: "Unknown",
      momentumScore: 50,
      primaryChangePct: null,
      trendSlope: trendSlope ?? null,
    };
  }

  if (combined >= 8) {
    return { momentum: "Strong Positive", momentumScore: 88, primaryChangePct, trendSlope };
  }

  if (combined >= 1.5) {
    return { momentum: "Positive", momentumScore: 70, primaryChangePct, trendSlope };
  }

  if (combined <= -8) {
    return { momentum: "Strong Negative", momentumScore: 15, primaryChangePct, trendSlope };
  }

  if (combined <= -1.5) {
    return { momentum: "Negative", momentumScore: 32, primaryChangePct, trendSlope };
  }

  return { momentum: "Stable", momentumScore: 55, primaryChangePct, trendSlope };
}
