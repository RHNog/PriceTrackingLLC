import type { Signal } from "@/lib/engines/cardIntelligence/models/Signal";
import type { Indicator } from "@/lib/intelligence/framework/Indicator";
import type { IndicatorMetadata } from "@/lib/intelligence/framework/IndicatorMetadata";
import type { PlayabilityProfile } from "@/lib/intelligence/playability/PlayabilityProfile";

type IndicatorFactoryInput = {
  metadata: IndicatorMetadata;
  playabilityProfile?: PlayabilityProfile;
  signals: Signal[];
};

function findSignal(input: IndicatorFactoryInput) {
  return input.metadata.signalName
    ? input.signals.find((signal) => signal.name === input.metadata.signalName)
    : undefined;
}

export function createIndicator(input: IndicatorFactoryInput): Indicator {
  const signal = findSignal(input);
  const playabilityIndicator = input.metadata.playabilityIndicatorName
    ? input.playabilityProfile?.indicators[input.metadata.playabilityIndicatorName]
    : undefined;

  return {
    id: input.metadata.id,
    name: input.metadata.name,
    score: playabilityIndicator?.score ?? signal?.score ?? 0,
    confidence: playabilityIndicator?.confidence ?? signal?.confidence ?? 0,
    version: input.metadata.version,
    status: playabilityIndicator?.availability ?? input.metadata.status,
    dataSources: playabilityIndicator
      ? [playabilityIndicator.dataSource]
      : input.metadata.dataSources,
    contributingFactors: signal?.contributingFactors ?? [
      playabilityIndicator?.status ?? "Unknown",
      playabilityIndicator?.trend ?? "Unknown",
    ],
    lastUpdated:
      playabilityIndicator?.lastUpdated ??
      signal?.generatedAt ??
      new Date().toISOString(),
    explanation:
      playabilityIndicator?.explanation ??
      signal?.explanation ??
      input.metadata.explanation,
    futureDependencies: input.metadata.futureDependencies,
  };
}
