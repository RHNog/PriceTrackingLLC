import type {
  PlayabilityFormat,
  PlayabilityIndicator,
} from "@/lib/intelligence/playability/PlayabilityIndicator";
import type {
  PlayabilityDemandDimensions,
  PlayabilityFormatAnalysis,
} from "@/lib/intelligence/playability/PlayabilityDemand";
import type { PlayabilityRoleSignal } from "@/lib/intelligence/playability/PlayabilityRole";

export type PlayabilityTier = "Excellent" | "High" | "Medium" | "Low";

export interface PlayabilityProfile {
  modelId: "playability-intelligence";
  modelName: "Playability Intelligence";
  version: string;
  overall: PlayabilityIndicator;
  formats: Record<PlayabilityFormat, PlayabilityIndicator>;
  tier: PlayabilityTier;
  businessConclusion: string;
  confidenceReason: string;
  demandDimensions: PlayabilityDemandDimensions;
  formatAnalysis: Partial<Record<PlayabilityFormat, PlayabilityFormatAnalysis>>;
  keySignals: string[];
  knowledgeGraph: {
    archetypes: string[];
    edgeCount: number;
    formats: string[];
    nodeCount: number;
    roles: string[];
    themes: string[];
  };
  providerAdapter: string;
  roleSignals: PlayabilityRoleSignal[];
  formatWeights: Record<string, number>;
  indicators: {
    overallPlayability: PlayabilityIndicator;
    commanderStrength: PlayabilityIndicator;
    competitiveStrength: PlayabilityIndicator;
    casualStrength: PlayabilityIndicator;
    banRisk: PlayabilityIndicator;
    formatDiversity: PlayabilityIndicator;
    demandStability: PlayabilityIndicator;
    metaDependency: PlayabilityIndicator;
    futureDemandReadiness: PlayabilityIndicator;
    metaStability: PlayabilityIndicator;
    trend: PlayabilityIndicator;
  };
  explanation: string;
  providerRoadmap: string[];
  dependencyGraph: string[];
  generatedAt: string;
}
