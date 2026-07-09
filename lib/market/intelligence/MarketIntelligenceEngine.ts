import { createMarketConfidence, type MarketIntelligenceConfidence } from "@/lib/market/intelligence/MarketConfidence";
import { createMarketHealth, type MarketHealthRating } from "@/lib/market/intelligence/MarketHealth";
import { createBuyingOpportunity, type BuyingOpportunityRating } from "@/lib/market/intelligence/MarketOpportunity";
import { createMarketReasoning } from "@/lib/market/intelligence/MarketReasoning";
import { createMarketSignal } from "@/lib/market/intelligence/MarketSignalRegistry";
import type { MarketSignal } from "@/lib/market/intelligence/MarketSignal";
import { interpretMarketTrend, type MarketMomentum } from "@/lib/market/intelligence/MarketTrendInterpreter";
import { interpretMarketVolatility } from "@/lib/market/intelligence/MarketVolatilityInterpreter";
import type { MarketIntelligenceRepositorySnapshot } from "@/lib/market/MarketSnapshot";
import type { MarketSnapshotFreshness } from "@/lib/market/MarketSnapshotMetadata";
import type { JustTCGNormalizedResponse } from "@/lib/providers/justtcg/JustTCGNormalizer";
import type { MarketProviderRawObservation } from "@/types/marketSnapshot";

export interface MarketIntelligenceProfile {
  buyingOpportunity: BuyingOpportunityRating;
  confidence: MarketIntelligenceConfidence;
  generatedAt: string;
  liquidity: "High" | "Moderate" | "Low" | "Unknown";
  marketHealth: MarketHealthRating;
  momentum: MarketMomentum;
  observationSummary: {
    currentPrice: number | null;
    evidenceCount: number;
    historicalHigh: number | null;
    historicalLow: number | null;
    historicalPosition: number | null;
    providerNames: string[];
  };
  priceStability: "High" | "Moderate" | "Low" | "Unknown";
  reasoning: string[];
  signals: MarketSignal[];
  volatility: "Low" | "Moderate" | "High" | "Unknown";
}

type ProviderStatisticMap = Record<string, number>;

type MarketObservationModel = {
  currentPrice: number | null;
  evidenceConfidence: number;
  evidenceCoverage: number;
  evidenceFreshness: MarketSnapshotFreshness[];
  evidenceProviderNames: string[];
  liquidityScore: number | null;
  priceHistory: number[];
  rawObservations: MarketProviderRawObservation[];
  statistics: ProviderStatisticMap;
};

export class MarketIntelligenceEngine {
  analyzeRepositorySnapshot(
    snapshot: MarketIntelligenceRepositorySnapshot,
  ): MarketIntelligenceProfile {
    return this.analyzeObservationModel(createObservationModelFromRepository(snapshot));
  }

  analyzeJustTCGNormalizedResponse(
    normalized: JustTCGNormalizedResponse,
  ): MarketIntelligenceProfile {
    return this.analyzeObservationModel(createObservationModelFromJustTCG(normalized));
  }

  private analyzeObservationModel(model: MarketObservationModel): MarketIntelligenceProfile {
    const range = getHistoricalRange(model);
    const historicalPosition = getHistoricalPosition({
      currentPrice: model.currentPrice,
      highPrice: range.highPrice,
      lowPrice: range.lowPrice,
    });
    const trend = interpretMarketTrend({
      priceChange7d: getStatistic(model.statistics, "priceChange7d"),
      priceChange30d: getStatistic(model.statistics, "priceChange30d"),
      priceChange90d: getStatistic(model.statistics, "priceChange90d"),
      trendSlope7d: getStatistic(model.statistics, "trendSlope7d"),
      trendSlope30d: getStatistic(model.statistics, "trendSlope30d"),
      trendSlope90d: getStatistic(model.statistics, "trendSlope90d"),
    });
    const volatility = interpretMarketVolatility({
      coefficientOfVariation:
        getStatistic(model.statistics, "covPrice30d") ??
        getStatistic(model.statistics, "covPrice7d") ??
        getStatistic(model.statistics, "covPrice90d"),
      highPrice: range.highPrice,
      lowPrice: range.lowPrice,
      priceHistory: model.priceHistory,
    });
    const confidence = createMarketConfidence({
      evidenceCoverageScore: model.evidenceCoverage,
      freshnessScore: calculateFreshnessScore(model.evidenceFreshness),
      observationDensityScore: calculateObservationDensityScore(model),
      providerQualityScore: model.evidenceConfidence,
    });
    const signals = createSignals({
      confidenceScore: confidence.score,
      historicalPosition,
      model,
      range,
      trend,
      volatility,
    });
    const marketHealth = createMarketHealth({
      confidenceScore: confidence.score,
      historicalPositionScore: scoreHistoricalPosition(historicalPosition),
      momentumScore: trend.momentumScore,
      signals,
      stabilityScore: 100 - volatility.volatilityScore,
    });
    const buyingOpportunity = createBuyingOpportunity({
      confidenceScore: confidence.score,
      historicalPosition,
      momentum: trend.momentum,
      volatilityLevel: volatility.volatilityLevel,
    });
    const reasoning = createMarketReasoning({
      buyingOpportunity,
      confidenceLabel: confidence.label,
      currentPrice: model.currentPrice,
      health: marketHealth,
      historicalPosition,
      momentum: trend.momentum,
      signals,
      volatilityLevel: volatility.volatilityLevel,
    });

    return {
      buyingOpportunity,
      confidence,
      generatedAt: new Date().toISOString(),
      liquidity: interpretLiquidity(model.liquidityScore),
      marketHealth,
      momentum: trend.momentum,
      observationSummary: {
        currentPrice: model.currentPrice,
        evidenceCount: model.rawObservations.length,
        historicalHigh: range.highPrice,
        historicalLow: range.lowPrice,
        historicalPosition,
        providerNames: [...new Set(model.evidenceProviderNames)],
      },
      priceStability: volatility.priceStability,
      reasoning,
      signals,
      volatility: volatility.volatilityLevel,
    };
  }
}

function createObservationModelFromRepository(
  snapshot: MarketIntelligenceRepositorySnapshot,
): MarketObservationModel {
  const evidence = snapshot.evidence ?? [];
  const rawObservations = evidence.flatMap((item) => item.rawObservations ?? []);
  const confidenceValues = evidence.map((item) => item.confidence.confidence);
  const coverageValues = evidence.map((item) => item.confidence.coverage);

  return {
    currentPrice: snapshot.marketPrice,
    evidenceConfidence: average(confidenceValues, snapshot.marketConfidence ?? 0),
    evidenceCoverage: average(coverageValues, getCoverageFromSnapshot(snapshot)),
    evidenceFreshness: evidence.map((item) => item.confidence.freshness),
    evidenceProviderNames: evidence.map((item) => item.providerName),
    liquidityScore: snapshot.liquidity,
    priceHistory: extractPriceHistory(rawObservations),
    rawObservations,
    statistics: extractProviderStatistics(rawObservations),
  };
}

function createObservationModelFromJustTCG(
  normalized: JustTCGNormalizedResponse,
): MarketObservationModel {
  const variants = normalized.cards.flatMap((card) => card.variants);
  const variant = variants[0];
  const rawObservations = [
    ...normalized.providerMetadata.rawObservations,
    ...normalized.cards.flatMap((card) => [
      ...card.rawObservations,
      ...card.variants.flatMap((item) => item.rawObservations),
    ]),
  ];

  return {
    currentPrice: variant?.currentPriceUsd ?? null,
    evidenceConfidence: 85,
    evidenceCoverage: variants.length > 0 ? 75 : 20,
    evidenceFreshness: ["Fresh"],
    evidenceProviderNames: ["JustTCG"],
    liquidityScore: null,
    priceHistory: variant?.priceHistory.map((point) => point.priceUsd) ?? [],
    rawObservations,
    statistics: extractProviderStatistics(rawObservations),
  };
}

function extractProviderStatistics(observations: MarketProviderRawObservation[]) {
  return observations.reduce<ProviderStatisticMap>((statistics, observation) => {
    if (typeof observation.rawValue !== "number") {
      return statistics;
    }

    const key = observation.providerField.split(".").at(-1);

    if (key) {
      statistics[key] = observation.rawValue;
    }

    return statistics;
  }, {});
}

function extractPriceHistory(observations: MarketProviderRawObservation[]) {
  return observations
    .filter((observation) =>
      /priceHistory.*(\.p|\.price|\]p?$)/.test(observation.providerField) ||
      observation.providerField.endsWith("priceHistory.p"),
    )
    .map((observation) => observation.rawValue)
    .filter((value): value is number => typeof value === "number");
}

function getHistoricalRange(model: MarketObservationModel) {
  const lows = [
    getStatistic(model.statistics, "minPrice90d"),
    getStatistic(model.statistics, "minPrice30d"),
    getStatistic(model.statistics, "minPrice7d"),
    ...model.priceHistory,
  ].filter((value): value is number => typeof value === "number");
  const highs = [
    getStatistic(model.statistics, "maxPrice90d"),
    getStatistic(model.statistics, "maxPrice30d"),
    getStatistic(model.statistics, "maxPrice7d"),
    ...model.priceHistory,
  ].filter((value): value is number => typeof value === "number");

  return {
    highPrice: highs.length ? Math.max(...highs) : null,
    lowPrice: lows.length ? Math.min(...lows) : null,
  };
}

function getHistoricalPosition(input: {
  currentPrice: number | null;
  highPrice: number | null;
  lowPrice: number | null;
}) {
  if (
    typeof input.currentPrice !== "number" ||
    typeof input.highPrice !== "number" ||
    typeof input.lowPrice !== "number" ||
    input.highPrice <= input.lowPrice
  ) {
    return null;
  }

  return Math.max(
    0,
    Math.min(1, (input.currentPrice - input.lowPrice) / (input.highPrice - input.lowPrice)),
  );
}

function createSignals(input: {
  confidenceScore: number;
  historicalPosition: number | null;
  model: MarketObservationModel;
  range: { highPrice: number | null; lowPrice: number | null };
  trend: ReturnType<typeof interpretMarketTrend>;
  volatility: ReturnType<typeof interpretMarketVolatility>;
}) {
  const signals: MarketSignal[] = [];

  if (input.volatility.volatilityLevel === "Low") {
    signals.push(createMarketSignal({
      confidence: input.confidenceScore,
      contributingObservations: ["coefficient of variation", "historical range"],
      explanation: "Observed pricing varies within a narrow range.",
      id: "low-volatility",
      score: 82,
    }));
    signals.push(createMarketSignal({
      confidence: input.confidenceScore,
      contributingObservations: ["price history", "provider statistics"],
      explanation: "Recent observations do not show abrupt price movement.",
      id: "stable-price-history",
      score: 78,
    }));
  }

  if (input.volatility.volatilityLevel === "High") {
    signals.push(createMarketSignal({
      confidence: input.confidenceScore,
      contributingObservations: ["historical min/max range"],
      explanation: "Observed range is wide enough to make current valuation less stable.",
      id: "high-price-volatility",
      score: 82,
    }));
  }

  if (input.trend.momentum === "Positive" || input.trend.momentum === "Strong Positive") {
    signals.push(createMarketSignal({
      confidence: input.confidenceScore,
      contributingObservations: ["price change", "trend slope"],
      explanation: "Provider movement statistics indicate upward momentum.",
      id: input.trend.momentum === "Strong Positive" ? "strong-momentum" : "healthy-uptrend",
      score: input.trend.momentumScore,
    }));
  }

  if (input.trend.momentum === "Negative" || input.trend.momentum === "Strong Negative") {
    signals.push(createMarketSignal({
      confidence: input.confidenceScore,
      contributingObservations: ["price change", "trend slope"],
      explanation: "Provider movement statistics indicate cooling demand.",
      id: input.trend.momentum === "Strong Negative" ? "weak-momentum" : "cooling-demand",
      score: 100 - input.trend.momentumScore,
    }));
  }

  if (input.historicalPosition !== null && input.historicalPosition <= 0.3) {
    signals.push(createMarketSignal({
      confidence: input.confidenceScore,
      contributingObservations: ["current valuation", "historical low", "historical high"],
      explanation: "Current valuation sits near the lower portion of observed history.",
      id: "near-historical-low",
      score: 82,
    }));
  }

  if (input.historicalPosition !== null && input.historicalPosition >= 0.72) {
    signals.push(createMarketSignal({
      confidence: input.confidenceScore,
      contributingObservations: ["current valuation", "historical low", "historical high"],
      explanation: "Current valuation sits near the upper portion of observed history.",
      id: "near-historical-high",
      score: 78,
    }));
  }

  if (
    input.trend.momentum === "Positive" &&
    input.historicalPosition !== null &&
    input.historicalPosition < 0.55
  ) {
    signals.push(createMarketSignal({
      confidence: input.confidenceScore,
      contributingObservations: ["positive momentum", "range position"],
      explanation: "Price is improving before reaching the upper end of the observed range.",
      id: "recovering-market",
      score: 70,
    }));
  }

  if (input.volatility.volatilityLevel === "Moderate") {
    signals.push(createMarketSignal({
      confidence: input.confidenceScore,
      contributingObservations: ["historical min/max range"],
      explanation: "Observed values are neither compressed nor dislocated.",
      id: "market-consolidation",
      score: 55,
    }));
  }

  if (input.confidenceScore >= 70) {
    signals.push(createMarketSignal({
      confidence: input.confidenceScore,
      contributingObservations: ["provider confidence", "freshness", "coverage"],
      explanation: "Provider evidence is strong enough to support market interpretation.",
      id: "provider-confidence-high",
      score: input.confidenceScore,
    }));
  } else {
    signals.push(createMarketSignal({
      confidence: input.confidenceScore,
      contributingObservations: ["coverage", "freshness", "observation density"],
      explanation: "Evidence supports interpretation but leaves some market context incomplete.",
      id: "evidence-coverage-moderate",
      score: input.confidenceScore,
    }));
  }

  return signals;
}

function getStatistic(statistics: ProviderStatisticMap, field: string) {
  return typeof statistics[field] === "number" ? statistics[field] : null;
}

function calculateFreshnessScore(freshness: MarketSnapshotFreshness[]) {
  if (freshness.length === 0) {
    return 35;
  }

  const values = freshness.map((value) => {
    if (value === "Fresh") {
      return 100;
    }

    if (value === "Stale") {
      return 65;
    }

    if (value === "Expired") {
      return 25;
    }

    return 10;
  });

  return average(values, 0);
}

function calculateObservationDensityScore(model: MarketObservationModel) {
  const historyScore = Math.min(50, model.priceHistory.length * 12);
  const statisticScore = Math.min(35, Object.keys(model.statistics).length * 3);
  const evidenceScore = Math.min(15, model.rawObservations.length);

  return historyScore + statisticScore + evidenceScore;
}

function getCoverageFromSnapshot(snapshot: MarketIntelligenceRepositorySnapshot) {
  const values = Object.values(snapshot.evidenceCoverage ?? {}).flatMap((coverage) =>
    Object.values(coverage),
  );

  if (values.length === 0) {
    return 0;
  }

  return Math.round(
    (values.filter(Boolean).length / values.length) * 100,
  );
}

function scoreHistoricalPosition(position: number | null) {
  if (position === null) {
    return 45;
  }

  if (position <= 0.35) {
    return 82;
  }

  if (position <= 0.65) {
    return 62;
  }

  return 38;
}

function interpretLiquidity(score: number | null) {
  if (score === null) {
    return "Unknown" as const;
  }

  if (score >= 70) {
    return "High" as const;
  }

  if (score >= 40) {
    return "Moderate" as const;
  }

  return "Low" as const;
}

function average(values: number[], fallback: number) {
  if (values.length === 0) {
    return fallback;
  }

  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}
