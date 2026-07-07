import type { RankingWeights } from "@/lib/engines/ranking/RankingWeights";
import type { StrategyConstraints } from "@/types/strategyConstraints";

export interface StrategyProfile {
  id: string;
  rankingWeights: RankingWeights;
  constraints: StrategyConstraints;
}
