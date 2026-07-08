import type { Signal } from "@/lib/engines/cardIntelligence/models/Signal";
import type { StrategyProfile } from "@/types/strategyProfile";

export function calculateSignalStrategyScore(
  strategyProfile: StrategyProfile,
  signals: Signal[],
) {
  const weightedSignals = signals
    .map((signal) => ({
      signal,
      weight: strategyProfile.signalWeights[signal.name] ?? 0,
    }))
    .filter((item) => item.weight > 0);

  if (weightedSignals.length === 0) {
    return 0;
  }

  const totalWeight = weightedSignals.reduce(
    (sum, item) => sum + item.weight,
    0,
  );
  const weightedScore = weightedSignals.reduce(
    (sum, item) => sum + item.signal.score * item.weight,
    0,
  );

  return Math.round(weightedScore / totalWeight);
}
