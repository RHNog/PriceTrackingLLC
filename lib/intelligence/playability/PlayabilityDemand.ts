import type {
  PlayabilityDemandLevel,
  PlayabilityFormat,
  PlayabilityRelevanceLevel,
} from "@/lib/intelligence/playability/PlayabilityIndicator";
import type { PlayabilityTrend } from "@/lib/intelligence/playability/PlayabilityTrend";

export interface PlayabilityDemandDimensions {
  banRisk: PlayabilityDemandLevel;
  casualDemand: PlayabilityDemandLevel;
  comboRelevance: PlayabilityDemandLevel;
  commanderDemand: PlayabilityDemandLevel;
  competitiveDemand: PlayabilityDemandLevel;
  demandResilience: PlayabilityDemandLevel;
  demandStability: PlayabilityDemandLevel;
  formatDiversity: PlayabilityDemandLevel;
  futureDemandReadiness: PlayabilityDemandLevel;
  metaDependency: PlayabilityDemandLevel;
  stapleStatus: PlayabilityDemandLevel;
}

export interface PlayabilityFormatAnalysis {
  casualWeight: number;
  competitiveWeight: number;
  confidence: number;
  demand: PlayabilityDemandLevel;
  evidenceSource: string;
  format: PlayabilityFormat;
  legality: string;
  providerStatus: string;
  trend: PlayabilityTrend;
}

export interface NormalizedPlayabilityProviderResponse {
  cardName: string;
  demandDimensions: PlayabilityDemandDimensions;
  formatAnalysis: Partial<Record<PlayabilityFormat, PlayabilityFormatAnalysis>>;
  keySignals: string[];
  providerStatus: "PLACEHOLDER" | "READY" | "WAITING_FOR_PROVIDER";
  roleSignals: {
    confidence: number;
    explanation: string;
    role: string;
  }[];
}

export function demandLevelToScore(level: PlayabilityDemandLevel) {
  return {
    High: 75,
    Low: 30,
    Moderate: 55,
    Unknown: 0,
    "Very High": 90,
    "Very Low": 10,
  }[level];
}

export function relevanceToDemandLevel(
  relevance: PlayabilityRelevanceLevel,
): PlayabilityDemandLevel {
  return relevance;
}
