import type { CardProfile } from "@/lib/engines/cardIntelligence/models/CardProfile";

type CardProfilePanelProps = {
  cardProfile: CardProfile;
};

const visibleSignals = [
  "playability",
  "investment-potential",
  "collector-appeal",
  "liquidity",
  "reprint-risk",
  "market-confidence",
];

export default function CardProfilePanel({
  cardProfile,
}: CardProfilePanelProps) {
  const indicators = cardProfile.intelligenceModels
    .flatMap((model) => model.indicators)
    .filter((indicator) => visibleSignals.includes(indicator.id));
  const uniqueIndicators = Array.from(
    new Map(indicators.map((indicator) => [indicator.id, indicator])).values(),
  );
  const playability = cardProfile.playabilityProfile;
  const playabilityFormats = [
    "Commander",
    "Modern",
    "Legacy",
    "Vintage",
    "Pioneer",
    "Standard",
    "Pauper",
  ] as const;

  return (
    <details className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
      <summary className="cursor-pointer text-sm font-medium text-zinc-200">
        Card Profile
      </summary>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {uniqueIndicators.map((indicator) => (
          <div key={indicator.id} className="rounded-md bg-zinc-950/60 p-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-zinc-500">{indicator.name}</p>
              <p className="text-sm font-semibold text-cyan-300">
                {indicator.score}
              </p>
            </div>
            <p className="mt-2 text-xs text-zinc-400">
              {indicator.explanation}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-md border border-zinc-800 bg-zinc-950/60 p-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-zinc-500">Playability</p>
            <p className="mt-1 text-sm font-semibold text-cyan-300">
              {playability.tier}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-zinc-500">Trend</p>
            <p className="mt-1 text-sm font-semibold text-zinc-300">
              {playability.overall.trend}
            </p>
          </div>
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {playabilityFormats.map((format) => {
            const indicator = playability.formats[format];

            return (
              <div key={format} className="rounded-md bg-zinc-900 px-3 py-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-zinc-500">{format}</span>
                  <span className="text-xs font-semibold text-zinc-200">
                    {indicator.status}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between gap-3 text-xs text-zinc-500">
                  <span>{indicator.availability}</span>
                  <span>{indicator.score}</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <p className="rounded-md bg-zinc-900 px-3 py-2 text-xs text-zinc-400">
            Ban Status: {playability.overall.status}
          </p>
          <p className="rounded-md bg-zinc-900 px-3 py-2 text-xs text-zinc-400">
            Deck Penetration:{" "}
            {playability.overall.deckPenetration.status}
          </p>
        </div>
      </div>

      <p className="mt-3 text-xs text-zinc-500">
        Confidence {cardProfile.overallConfidence}% /{" "}
        {cardProfile.condition.label}
      </p>
    </details>
  );
}
