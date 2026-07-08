import type {
  PlayabilityFormat,
  PlayabilityIndicator,
} from "@/lib/intelligence/playability/PlayabilityIndicator";

export type PlayabilityTier = "Excellent" | "High" | "Medium" | "Low";

export interface PlayabilityProfile {
  modelId: "playability-intelligence";
  modelName: "Playability Intelligence";
  version: string;
  overall: PlayabilityIndicator;
  formats: Record<PlayabilityFormat, PlayabilityIndicator>;
  tier: PlayabilityTier;
  indicators: {
    overallPlayability: PlayabilityIndicator;
    commanderStrength: PlayabilityIndicator;
    competitiveStrength: PlayabilityIndicator;
    casualStrength: PlayabilityIndicator;
    banRisk: PlayabilityIndicator;
    formatDiversity: PlayabilityIndicator;
    metaStability: PlayabilityIndicator;
    trend: PlayabilityIndicator;
  };
  explanation: string;
  providerRoadmap: string[];
  dependencyGraph: string[];
  generatedAt: string;
}

