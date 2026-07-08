import type { Signal } from "@/lib/engines/cardIntelligence/models/Signal";
import type { Indicator } from "@/lib/intelligence/framework/Indicator";
import type { AssetSnapshot } from "@/types/AssetSnapshot";
import type { Decision } from "@/types/decision";
import type { MarketSnapshotHistory } from "@/types/MarketSnapshotHistory";
import type { OfferLadderSnapshot } from "@/types/OfferLadderSnapshot";
import type { StrategySnapshot } from "@/types/StrategySnapshot";

export interface EvaluationSnapshot {
  asset: AssetSnapshot;
  cardIntelligenceIndicators: Array<Indicator | Signal>;
  confidence: number;
  decision: Decision;
  eventType: "Evaluation Completed";
  id: string;
  market: MarketSnapshotHistory;
  offerLadder: OfferLadderSnapshot;
  strategy: StrategySnapshot;
  timestamp: string;
}
