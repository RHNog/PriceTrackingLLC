import type { Signal } from "@/lib/engines/cardIntelligence/models/Signal";
import type { Indicator } from "@/lib/intelligence/framework/Indicator";
import type { IndicatorMetadata } from "@/lib/intelligence/framework/IndicatorMetadata";

type IndicatorFactoryInput = {
  metadata: IndicatorMetadata;
  signals: Signal[];
};

function findSignal(input: IndicatorFactoryInput) {
  return input.metadata.signalName
    ? input.signals.find((signal) => signal.name === input.metadata.signalName)
    : undefined;
}

export function createIndicator(input: IndicatorFactoryInput): Indicator {
  const signal = findSignal(input);

  return {
    id: input.metadata.id,
    name: input.metadata.name,
    score: signal?.score ?? 0,
    confidence: signal?.confidence ?? 0,
    version: input.metadata.version,
    status: input.metadata.status,
    dataSources: input.metadata.dataSources,
    contributingFactors: signal?.contributingFactors ?? [],
    lastUpdated: signal?.generatedAt ?? new Date().toISOString(),
    explanation: signal?.explanation ?? input.metadata.explanation,
    futureDependencies: input.metadata.futureDependencies,
  };
}
