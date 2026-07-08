import type { RankingWeights } from "@/lib/engines/ranking/RankingWeights";
import type { SignalName } from "@/lib/engines/cardIntelligence/models/Signal";
import type { StrategyConstraints } from "@/types/strategyConstraints";

export interface StrategySnapshot {
  constraints: StrategyConstraints;
  id: string;
  rankingWeights: RankingWeights;
  signalWeights: Partial<Record<SignalName, number>>;
}
