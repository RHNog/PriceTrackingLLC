import type { ReadyPurchaseEvaluation } from "@/lib/engines/evaluation/evaluatePurchase";
import {
  evaluationHistoryRepository,
  type HistoryRepository,
} from "@/lib/history/HistoryRepository";
import { createEvaluationSnapshot } from "@/lib/history/SnapshotFactory";
import { validateEvaluationSnapshot } from "@/lib/history/SnapshotValidator";
import type { AssetContext } from "@/types/AssetContext";
import type { MarketSnapshot } from "@/types/marketSnapshot";
import type { StrategyProfile } from "@/types/strategyProfile";

export type HistoryEventType =
  | "Evaluation Completed"
  | "Condition Changed"
  | "Strategy Changed"
  | "Printing Changed";

export type RecordCompletedEvaluationInput = {
  assetContext: AssetContext;
  evaluation: ReadyPurchaseEvaluation;
  marketSnapshot: MarketSnapshot;
  strategyProfile: StrategyProfile;
  timestamp?: string;
};

export type EvaluationHistoryResult = {
  errors: string[];
  recorded: boolean;
  snapshotId?: string;
};

export class EvaluationHistoryEngine {
  constructor(private readonly repository: HistoryRepository) {}

  recordCompletedEvaluation(
    input: RecordCompletedEvaluationInput,
  ): EvaluationHistoryResult {
    const snapshot = createEvaluationSnapshot(input);
    const validation = validateEvaluationSnapshot(snapshot);

    if (!validation.valid) {
      return {
        errors: validation.errors,
        recorded: false,
      };
    }

    this.repository.append(snapshot);

    return {
      errors: [],
      recorded: true,
      snapshotId: snapshot.id,
    };
  }

  recordHistoryEvent(eventType: Exclude<HistoryEventType, "Evaluation Completed">) {
    void eventType;
    // TODO: Backtesting.
    // TODO: Strategy Replay.
    // TODO: Market Replay.
    // TODO: Signal Validation.
    // TODO: Simulation Platform.
    // TODO: Personal Buying History.
    // TODO: Portfolio Tracking.
  }
}

export const evaluationHistoryEngine = new EvaluationHistoryEngine(
  evaluationHistoryRepository,
);
