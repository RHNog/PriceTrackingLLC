import type { CardProfile } from "@/lib/engines/cardIntelligence/models/CardProfile";

type CardProfilePanelProps = {
  cardProfile: CardProfile;
};

const visibleSignals = [
  "InvestmentPotential",
  "CollectorAppeal",
  "Liquidity",
  "ReprintRisk",
  "MarketConfidence",
];

export default function CardProfilePanel({
  cardProfile,
}: CardProfilePanelProps) {
  const signals = cardProfile.signals.filter((signal) =>
    visibleSignals.includes(signal.name),
  );

  return (
    <details className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
      <summary className="cursor-pointer text-sm font-medium text-zinc-200">
        Card Profile
      </summary>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {signals.map((signal) => (
          <div key={signal.name} className="rounded-md bg-zinc-950/60 p-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-zinc-500">{signal.label}</p>
              <p className="text-sm font-semibold text-cyan-300">
                {signal.score}
              </p>
            </div>
            <p className="mt-2 text-xs text-zinc-400">
              {signal.explanation}
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
