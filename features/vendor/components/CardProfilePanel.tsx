import type { CardProfile } from "@/lib/engines/cardIntelligence/models/CardProfile";

type CardProfilePanelProps = {
  cardProfile: CardProfile;
};

const visibleSignals = [
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

      <p className="mt-3 text-xs text-zinc-500">
        Confidence {cardProfile.overallConfidence}% /{" "}
        {cardProfile.condition.label}
      </p>
    </details>
  );
}
