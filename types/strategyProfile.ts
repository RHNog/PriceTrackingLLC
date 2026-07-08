import type { RankingWeights } from "@/lib/engines/ranking/RankingWeights";
import type { SignalName } from "@/lib/engines/cardIntelligence/models/Signal";
import type { StrategyConstraints } from "@/types/strategyConstraints";

export interface StrategyProfile {
  id: string;
  rankingWeights: RankingWeights;
  signalWeights: Partial<Record<SignalName, number>>;
  constraints: StrategyConstraints;
}
