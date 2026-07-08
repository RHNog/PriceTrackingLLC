import type { Signal } from "@/lib/engines/cardIntelligence/models/Signal";
import type { CertificationProfile } from "@/lib/intelligence/certification/CertificationProfile";
import type { Indicator } from "@/lib/intelligence/framework/Indicator";
import type { IndicatorMetadata } from "@/lib/intelligence/framework/IndicatorMetadata";
import type { PlayabilityProfile } from "@/lib/intelligence/playability/PlayabilityProfile";

type IndicatorFactoryInput = {
  metadata: IndicatorMetadata;
  certificationProfile?: CertificationProfile;
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
  const certificationIndicator = input.metadata.certificationIndicatorName
    ? input.certificationProfile?.indicators[
        input.metadata.certificationIndicatorName
      ]
    : undefined;
  const playabilityIndicator = input.metadata.playabilityIndicatorName
    ? input.playabilityProfile?.indicators[input.metadata.playabilityIndicatorName]
    : undefined;

  return {
    id: input.metadata.id,
    name: input.metadata.name,
    score:
      certificationIndicator?.score ??
      playabilityIndicator?.score ??
      signal?.score ??
      0,
    confidence:
      certificationIndicator?.confidence ??
      playabilityIndicator?.confidence ??
      signal?.confidence ??
      0,
    version: input.metadata.version,
    status:
      certificationIndicator?.status ??
      playabilityIndicator?.availability ??
      input.metadata.status,
    dataSources: certificationIndicator
      ? [certificationIndicator.source]
      : playabilityIndicator
      ? [playabilityIndicator.dataSource]
      : input.metadata.dataSources,
    contributingFactors: signal?.contributingFactors ?? [
      certificationIndicator?.trend ?? "Unknown",
      playabilityIndicator?.status ?? "Unknown",
      playabilityIndicator?.trend ?? "Unknown",
    ],
    lastUpdated:
      certificationIndicator?.lastUpdated ??
      playabilityIndicator?.lastUpdated ??
      signal?.generatedAt ??
      new Date().toISOString(),
    explanation:
      certificationIndicator?.explanation ??
      playabilityIndicator?.explanation ??
      signal?.explanation ??
      input.metadata.explanation,
    futureDependencies: input.metadata.futureDependencies,
  };
}
