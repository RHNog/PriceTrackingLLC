import { evaluateEvidenceSufficiency } from "@/lib/intelligence/framework/EvidenceSufficiencyEngine";
import type { EvidenceReport } from "@/lib/intelligence/framework/EvidenceReport";
import type { Indicator } from "@/lib/intelligence/framework/Indicator";

export type MarketConfidenceLabel = "Very Low" | "Low" | "Moderate" | "High" | "Very High";

export interface MarketIntelligenceConfidence {
  label: MarketConfidenceLabel;
  reason: string;
  score: number;
  sufficiency: EvidenceReport;
}

export function createMarketConfidence(input: {
  evidenceCoverageScore: number;
  freshnessScore: number;
  observationDensityScore: number;
  providerQualityScore: number;
}) {
  const indicators: Indicator[] = [
    createConfidenceIndicator({
      id: "market-observation-coverage",
      name: "Observation Coverage",
      score: input.evidenceCoverageScore,
      source: "Market Repository",
    }),
    createConfidenceIndicator({
      id: "market-observation-freshness",
      name: "Observation Freshness",
      score: input.freshnessScore,
      source: "Market Repository",
    }),
    createConfidenceIndicator({
      id: "market-provider-quality",
      name: "Provider Quality",
      score: input.providerQualityScore,
      source: "Provider Evidence",
    }),
    createConfidenceIndicator({
      id: "market-observation-density",
      name: "Observation Density",
      score: input.observationDensityScore,
      source: "Provider Observations",
    }),
  ];
  const sufficiency = evaluateEvidenceSufficiency({
    indicators,
    requirements: [
      {
        id: "coverage",
        label: "Evidence coverage",
        type: "REQUIRED",
        indicatorIds: ["market-observation-coverage"],
        minimumScore: 35,
      },
      {
        id: "freshness",
        label: "Evidence freshness",
        type: "REQUIRED",
        indicatorIds: ["market-observation-freshness"],
        minimumScore: 35,
      },
      {
        id: "provider-quality",
        label: "Provider quality",
        type: "REQUIRED",
        indicatorIds: ["market-provider-quality"],
        minimumScore: 35,
      },
      {
        id: "observation-density",
        label: "Observation density",
        type: "OPTIONAL",
        indicatorIds: ["market-observation-density"],
        minimumScore: 30,
      },
    ],
  });
  const baseScore = Math.round(
    (
      input.evidenceCoverageScore * 0.3 +
      input.freshnessScore * 0.25 +
      input.providerQualityScore * 0.25 +
      input.observationDensityScore * 0.2
    ),
  );
  const score = clampScore(baseScore + sufficiency.confidenceAdjustment);

  return {
    label: getConfidenceLabel(score),
    reason:
      `Confidence reflects ${input.evidenceCoverageScore}% coverage, ` +
      `${input.freshnessScore}% freshness, ${input.providerQualityScore}% provider quality, ` +
      `and ${input.observationDensityScore}% observation density.`,
    score,
    sufficiency,
  } satisfies MarketIntelligenceConfidence;
}

function createConfidenceIndicator(input: {
  id: string;
  name: string;
  score: number;
  source: string;
}): Indicator {
  return {
    confidence: clampScore(input.score),
    contributingFactors: [`${input.name}: ${clampScore(input.score)}%`],
    dataSources: [input.source],
    explanation: `${input.name} contributes to market intelligence confidence.`,
    futureDependencies: [],
    id: input.id,
    lastUpdated: new Date().toISOString(),
    name: input.name,
    score: clampScore(input.score),
    status: "ESTIMATED",
    version: "1.0.0",
  };
}

function getConfidenceLabel(score: number): MarketConfidenceLabel {
  if (score >= 85) {
    return "Very High";
  }

  if (score >= 70) {
    return "High";
  }

  if (score >= 50) {
    return "Moderate";
  }

  if (score >= 30) {
    return "Low";
  }

  return "Very Low";
}

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}
