import {
  getConfidenceLabel,
  getEvidenceAwareGrade,
  getIntelligenceGrade,
} from "@/components/intelligence/IntelligenceGrade";
import type { CardProfile } from "@/lib/engines/cardIntelligence/models/CardProfile";
import type { IntelligenceModel } from "@/lib/intelligence/framework/IntelligenceModel";

type IntelligenceDetailProps = {
  cardProfile: CardProfile;
  model: IntelligenceModel;
  score: number;
};

function joinValues(values: string[]) {
  return values.length > 0 ? values.join(", ") : "None";
}

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-zinc-950/60 px-3 py-2">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-1 text-sm font-medium text-zinc-200">{value}</p>
    </div>
  );
}

function DetailList({
  emptyLabel = "More evidence will appear as connected data improves.",
  items,
  label,
}: {
  emptyLabel?: string;
  items: string[];
  label: string;
}) {
  return (
    <div className="rounded-md bg-zinc-950/60 px-3 py-2">
      <p className="text-xs text-zinc-500">{label}</p>
      <ul className="mt-2 space-y-1 text-xs text-zinc-400">
        {items.length > 0 ? (
          items.map((item) => <li key={item}>{item}</li>)
        ) : (
          <li>{emptyLabel}</li>
        )}
      </ul>
    </div>
  );
}

function getModelDisplayName(name: string) {
  return name.replace(/\s+Intelligence$/, "");
}

function getBusinessConclusion(
  cardProfile: CardProfile,
  model: IntelligenceModel,
  score: number,
) {
  if (model.id === "certification-intelligence") {
    if (model.evidenceReport.status === "INSUFFICIENT") {
      return [
        "The platform does not yet have sufficient evidence to evaluate certification reliably.",
        "Population, gem rate, and certified premium evidence are required before issuing a certification assessment.",
      ];
    }

    const tier = cardProfile.certificationProfile.tier.toLowerCase();

    return [
      `${cardProfile.printing.name} is a ${tier} certification candidate.`,
      "Collector interest appears strong when certification traits are considered.",
      "Population reporting will improve once certification providers are connected.",
    ];
  }

  if (model.id === "playability-intelligence") {
    if (model.evidenceReport.status === "INSUFFICIENT") {
      return [
        "Current provider data is insufficient to accurately determine player demand.",
        "Initial signals indicate format relevance, but dedicated playability providers are required before issuing a reliable playability assessment.",
      ];
    }

    return [cardProfile.playabilityProfile.businessConclusion];
  }

  if (score >= 75) {
    return [
      `${getModelDisplayName(model.name)} signals are favorable for this asset.`,
      "The current profile supports stronger buyer attention.",
    ];
  }

  if (score >= 50) {
    return [
      `${getModelDisplayName(model.name)} signals are mixed but usable.`,
      "The current profile should be interpreted with supporting evidence.",
    ];
  }

  return [
    `${getModelDisplayName(model.name)} signals are limited right now.`,
    "Additional connected data may improve this read later.",
  ];
}

function getKeySignals(model: IntelligenceModel) {
  return model.indicators
    .filter((indicator) => indicator.score > 0 || indicator.confidence > 0)
    .sort(
      (first, second) =>
        second.score * second.confidence - first.score * first.confidence,
    )
    .slice(0, 4)
    .map(
      (indicator) =>
        `${indicator.name}: ${getIntelligenceGrade(indicator.score)} / ${getConfidenceLabel(
          indicator.confidence,
        )}`,
    );
}

function getConfidenceReason(
  cardProfile: CardProfile,
  model: IntelligenceModel,
) {
  if (getConfidenceLabel(model.confidence) === "High") {
    return "";
  }

  if (getConfidenceLabel(model.confidence) === "Very High") {
    return "";
  }

  if (model.id === "certification-intelligence") {
    return "Official certification population providers have not yet been connected.";
  }

  if (model.id === "playability-intelligence") {
    return cardProfile.playabilityProfile.confidenceReason;
  }

  if (model.indicators.every((indicator) => indicator.confidence === 0)) {
    return "Connected data is not available for this intelligence model yet.";
  }

  if (model.evidenceReport.status === "INSUFFICIENT") {
    return model.evidenceReport.explanation;
  }

  return "Some supporting data is still waiting for provider connection.";
}

function formatNullableNumber(value: number | null) {
  return value === null
    ? "Population data will become available after certification provider integration."
    : `${value}`;
}

function formatNullablePercent(value: number | null) {
  return value === null
    ? "Additional grading signals will appear once PSA, BGS and CGC providers are connected."
    : `${value}%`;
}

function getSupportingEvidence(
  cardProfile: CardProfile,
  model: IntelligenceModel,
) {
  const collectorContext = unique(
    model.indicators.flatMap((indicator) => indicator.contributingFactors),
  )
    .slice(0, 4)
    .join(", ");

  if (model.id === "certification-intelligence") {
    const certification = cardProfile.certificationProfile;

    return [
      `Population: ${joinValues(
        certification.providers.map(
          (provider) =>
            `${provider.providerName}: ${formatNullableNumber(
              provider.population,
            )}`,
        ),
      )}`,
      `Gem Rate: ${joinValues(
        certification.providers.map(
          (provider) =>
            `${provider.providerName}: ${formatNullablePercent(
              provider.gemRate,
            )}`,
        ),
      )}`,
      `Premium: ${joinValues(
        certification.providers.map(
          (provider) =>
            `${provider.providerName}: ${formatNullablePercent(
              provider.estimatedPremium,
            )}`,
        ),
      )}`,
      `Trend: ${certification.indicators.populationTrend.trend}`,
      `Collector Context: ${collectorContext}`,
    ];
  }

  if (model.id === "playability-intelligence") {
    const strongestFormats = Object.values(cardProfile.playabilityProfile.formats)
      .filter((indicator) => indicator.format !== "Overall")
      .sort((first, second) => second.score - first.score)
      .slice(0, 4)
      .map(
        (indicator) =>
          `${indicator.format}: ${indicator.status}, ${indicator.demandLevel} demand, ${indicator.trend} trend, ${getConfidenceLabel(
            indicator.confidence,
          )} confidence`,
      );

    return [
      `Format Breakdown: ${joinValues(strongestFormats)}`,
      `Legality: ${cardProfile.playabilityProfile.overall.status}`,
      `Trend: ${cardProfile.playabilityProfile.overall.trend}`,
      `Confidence: ${getConfidenceLabel(cardProfile.playabilityProfile.overall.confidence)}`,
    ];
  }

  return [
    `Trend: Unknown`,
    `Collector Context: ${collectorContext}`,
    ...model.indicators
      .filter((indicator) => indicator.score > 0 || indicator.confidence > 0)
      .slice(0, 2)
      .map(
        (indicator) =>
          `${indicator.name}: ${getIntelligenceGrade(indicator.score)}`,
      ),
  ];
}

export default function IntelligenceDetail({
  cardProfile,
  model,
  score,
}: IntelligenceDetailProps) {
  const contributingFactors = unique(
    model.indicators.flatMap((indicator) => indicator.contributingFactors),
  );
  const businessConclusion = getBusinessConclusion(cardProfile, model, score);
  const keySignals =
    model.id === "playability-intelligence"
      ? cardProfile.playabilityProfile.keySignals
      : getKeySignals(model);
  const confidenceReason = getConfidenceReason(cardProfile, model);
  const supportingEvidence = getSupportingEvidence(cardProfile, model).filter(
    (item) => !item.endsWith(": "),
  );
  const modelDisplayName = getModelDisplayName(model.name);

  return (
    <div className="rounded-md border border-zinc-800 bg-zinc-900 px-3 py-3">
      <div className="grid gap-2 sm:grid-cols-2">
        <DetailRow
          label="Grade"
          value={getEvidenceAwareGrade(score, model.evidenceReport.status)}
        />
        <div className="rounded-md bg-zinc-950/60 px-3 py-2">
          <p className="text-xs text-zinc-500">
            {modelDisplayName} Confidence
          </p>
          <p className="mt-1 text-sm font-medium text-zinc-200">
            {getConfidenceLabel(model.confidence)}
          </p>
          {confidenceReason ? (
            <p className="mt-2 text-xs text-zinc-400">
              Reason: {confidenceReason}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-2 rounded-md bg-zinc-950/60 px-3 py-2">
        <p className="text-xs text-zinc-500">Business Conclusion</p>
        <ul className="mt-2 space-y-1 text-sm text-zinc-300">
          {businessConclusion.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="mt-2 grid gap-2 lg:grid-cols-2">
        <DetailList label="Key Signals" items={keySignals} />
        <DetailList
          label="Supporting Evidence"
          items={
            supportingEvidence.length > 0
              ? supportingEvidence
              : contributingFactors.slice(0, 4)
          }
        />
      </div>
    </div>
  );
}
