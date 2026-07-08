import { getIntelligenceGrade } from "@/components/intelligence/IntelligenceGrade";
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

function getTrend(cardProfile: CardProfile, model: IntelligenceModel) {
  return model.id === "playability-intelligence"
    ? cardProfile.playabilityProfile.overall.trend
    : "Unknown";
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-zinc-950/60 px-3 py-2">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-1 text-sm font-medium text-zinc-200">{value}</p>
    </div>
  );
}

function DetailList({ items, label }: { items: string[]; label: string }) {
  return (
    <div className="rounded-md bg-zinc-950/60 px-3 py-2">
      <p className="text-xs text-zinc-500">{label}</p>
      <ul className="mt-2 space-y-1 text-xs text-zinc-400">
        {items.length > 0 ? (
          items.map((item) => <li key={item}>{item}</li>)
        ) : (
          <li>None</li>
        )}
      </ul>
    </div>
  );
}

function PlayabilityFormats({ cardProfile }: { cardProfile: CardProfile }) {
  const formats = [
    "Commander",
    "Modern",
    "Legacy",
    "Vintage",
    "Pioneer",
    "Standard",
    "Pauper",
    "Explorer",
  ] as const;
  const playability = cardProfile.playabilityProfile;

  return (
    <div className="rounded-md bg-zinc-950/60 px-3 py-2">
      <p className="text-xs text-zinc-500">Format Indicators</p>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {formats.map((format) => {
          const indicator = playability.formats[format];

          return (
            <div
              key={format}
              className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2 rounded-md bg-zinc-900 px-2 py-1.5"
            >
              <span className="truncate text-xs text-zinc-400">{format}</span>
              <span className="text-xs font-semibold text-zinc-200">
                {getIntelligenceGrade(indicator.score)}
              </span>
              <span className="text-xs text-zinc-500">{indicator.status}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function IntelligenceDetail({
  cardProfile,
  model,
  score,
}: IntelligenceDetailProps) {
  const contributingFactors = unique(
    model.indicators.flatMap((indicator) => indicator.contributingFactors),
  );
  const supportingSources = unique([
    ...model.supportingSources,
    ...model.indicators.flatMap((indicator) => indicator.dataSources),
  ]);
  const futureDependencies = unique(
    model.indicators.flatMap((indicator) => indicator.futureDependencies),
  );
  const isPlayability = model.id === "playability-intelligence";

  return (
    <div className="rounded-md border border-zinc-800 bg-zinc-900 px-3 py-3">
      <div className="grid gap-2 sm:grid-cols-4">
        <DetailRow label="Score" value={`${score}`} />
        <DetailRow label="Grade" value={getIntelligenceGrade(score)} />
        <DetailRow label="Confidence" value={`${model.confidence}%`} />
        <DetailRow label="Version" value={model.version} />
      </div>

      <div className="mt-2 grid gap-2 sm:grid-cols-3">
        <DetailRow label="Status" value={model.status} />
        <DetailRow label="Trend" value={getTrend(cardProfile, model)} />
        <DetailRow label="Health" value={model.health} />
      </div>

      <div className="mt-2 rounded-md bg-zinc-950/60 px-3 py-2">
        <p className="text-xs text-zinc-500">Summary</p>
        <p className="mt-1 text-sm text-zinc-300">{model.explanation}</p>
      </div>

      {isPlayability ? (
        <div className="mt-2 grid gap-2">
          <PlayabilityFormats cardProfile={cardProfile} />
          <div className="grid gap-2 sm:grid-cols-3">
            <DetailRow
              label="Ban Status"
              value={cardProfile.playabilityProfile.overall.status}
            />
            <DetailRow
              label="Meta Stability"
              value={cardProfile.playabilityProfile.overall.metaStability}
            />
            <DetailRow
              label="Deck Penetration"
              value={cardProfile.playabilityProfile.overall.deckPenetration.status}
            />
          </div>
        </div>
      ) : null}

      <div className="mt-2 grid gap-2 lg:grid-cols-3">
        <DetailList label="Contributing Factors" items={contributingFactors} />
        <DetailList label="Supporting Data Sources" items={supportingSources} />
        <DetailList label="Future Dependencies" items={futureDependencies} />
      </div>

      <div className="mt-2 rounded-md bg-zinc-950/60 px-3 py-2">
        <p className="text-xs text-zinc-500">Explanation</p>
        <p className="mt-1 text-sm text-zinc-300">
          {joinValues(model.indicators.map((indicator) => indicator.explanation))}
        </p>
      </div>
    </div>
  );
}

