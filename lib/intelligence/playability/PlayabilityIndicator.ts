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

export interface PlayabilityIndicator {
  format: PlayabilityFormat;
  score: number;
  confidence: number;
  trend: PlayabilityTrend;
  availability: IndicatorStatus;
  dataSource: PlayabilitySource;
  status: PlayabilityBanStatus;
  lastUpdated: string;
  metaStability: PlayabilityMetaStability;
  deckPenetration: DeckPenetrationIndicator;
  explanation: string;
}

