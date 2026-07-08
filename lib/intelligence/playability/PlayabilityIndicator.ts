import type { IndicatorStatus } from "@/lib/intelligence/framework/IndicatorStatus";
import type { PlayabilitySource } from "@/lib/intelligence/playability/PlayabilitySource";
import type { PlayabilityTrend } from "@/lib/intelligence/playability/PlayabilityTrend";

export type PlayabilityFormat =
  | "Overall"
  | "Commander"
  | "Modern"
  | "Legacy"
  | "Vintage"
  | "Pioneer"
  | "Standard"
  | "Pauper"
  | "Explorer"
  | "Canadian Highlander";

export type PlayabilityBanStatus =
  | "Not Legal"
  | "Legal"
  | "Restricted"
  | "Banned"
  | "Unknown";

export type PlayabilityMetaStability =
  | "Very Stable"
  | "Stable"
  | "Volatile"
  | "Unknown";

export type DeckPenetrationIndicator = {
  percentage: number | null;
  sampleSize: number | null;
  confidence: number;
  status: IndicatorStatus;
};

export type PlayabilityDemandLevel =
  | "Very High"
  | "High"
  | "Moderate"
  | "Low"
  | "Very Low"
  | "Unknown";

export type PlayabilityRelevanceLevel =
  | "Very High"
  | "High"
  | "Moderate"
  | "Low"
  | "Very Low";

export interface PlayabilityIndicator {
  format: PlayabilityFormat;
  score: number;
  confidence: number;
  importance: number;
  demandLevel: PlayabilityDemandLevel;
  competitiveRelevance: PlayabilityRelevanceLevel;
  casualRelevance: PlayabilityRelevanceLevel;
  trend: PlayabilityTrend;
  availability: IndicatorStatus;
  dataSource: PlayabilitySource;
  provider: string;
  status: PlayabilityBanStatus;
  lastUpdated: string;
  metaStability: PlayabilityMetaStability;
  deckPenetration: DeckPenetrationIndicator;
  explanation: string;
}
