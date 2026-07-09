export type MarketVolatilityLevel = "Low" | "Moderate" | "High" | "Unknown";

export interface MarketVolatilityInterpretation {
  priceStability: "High" | "Moderate" | "Low" | "Unknown";
  volatilityLevel: MarketVolatilityLevel;
  volatilityScore: number;
  volatilitySource: string;
}

export function interpretMarketVolatility(input: {
  coefficientOfVariation: number | null;
  highPrice: number | null;
  lowPrice: number | null;
  priceHistory: number[];
}): MarketVolatilityInterpretation {
  const computedVolatility =
    input.coefficientOfVariation ??
    calculateRangeVolatility({
      highPrice: input.highPrice,
      lowPrice: input.lowPrice,
    }) ??
    calculateHistoryVolatility(input.priceHistory);

  if (computedVolatility === null) {
    return {
      priceStability: "Unknown",
      volatilityLevel: "Unknown",
      volatilityScore: 50,
      volatilitySource: "unavailable",
    };
  }

  if (computedVolatility <= 0.08) {
    return {
      priceStability: "High",
      volatilityLevel: "Low",
      volatilityScore: 18,
      volatilitySource: "provider statistics",
    };
  }

  if (computedVolatility <= 0.22) {
    return {
      priceStability: "Moderate",
      volatilityLevel: "Moderate",
      volatilityScore: 45,
      volatilitySource: "provider statistics",
    };
  }

  return {
    priceStability: "Low",
    volatilityLevel: "High",
    volatilityScore: 82,
    volatilitySource: "provider statistics",
  };
}

function calculateRangeVolatility(input: {
  highPrice: number | null;
  lowPrice: number | null;
}) {
  if (
    typeof input.highPrice !== "number" ||
    typeof input.lowPrice !== "number" ||
    input.highPrice <= 0
  ) {
    return null;
  }

  return (input.highPrice - input.lowPrice) / input.highPrice;
}

function calculateHistoryVolatility(prices: number[]) {
  if (prices.length < 2) {
    return null;
  }

  const average = prices.reduce((sum, value) => sum + value, 0) / prices.length;

  if (average <= 0) {
    return null;
  }

  const variance = prices.reduce(
    (sum, value) => sum + (value - average) ** 2,
    0,
  ) / prices.length;

  return Math.sqrt(variance) / average;
}
