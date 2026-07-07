import DecisionBadge from "@/features/vendor/components/DecisionBadge";
import type { PurchaseEvaluation } from "@/lib/engines/evaluation/evaluatePurchase";

type EvaluationSummaryProps = {
  askingPrice: number;
  evaluation: PurchaseEvaluation;
};

function formatCurrency(value: number) {
  const prefix = value > 0 ? "+" : value < 0 ? "-" : "";
  const absoluteValue = Math.abs(value);

  return `${prefix}$${absoluteValue.toLocaleString()}`;
}

export default function EvaluationSummary({
  askingPrice,
  evaluation,
}: EvaluationSummaryProps) {
  const { decision, ranking } = evaluation;

  return (
    <section className="rounded-lg border border-zinc-800 bg-zinc-900 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs text-zinc-500">Decision</p>
          <div className="mt-2">
            <DecisionBadge action={decision.action} />
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-zinc-500">Opportunity Score</p>
          <p className="mt-1 text-2xl font-semibold text-amber-300">
            {decision.confidence}
          </p>
          <p className="text-sm text-zinc-300">Grade {ranking.grade}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 border-t border-zinc-800 pt-5 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-md bg-zinc-950/60 p-3">
          <p className="text-xs text-zinc-500">Maximum Recommended Price</p>
          <p className="mt-1 font-semibold text-white">
            ${decision.maximumPurchasePrice.toLocaleString()}
          </p>
        </div>
        <div className="rounded-md bg-zinc-950/60 p-3">
          <p className="text-xs text-zinc-500">Current Asking Price</p>
          <p className="mt-1 font-semibold text-white">
            ${askingPrice.toLocaleString()}
          </p>
        </div>
        <div className="rounded-md bg-zinc-950/60 p-3">
          <p className="text-xs text-zinc-500">Negotiation Margin</p>
          <p
            className={`mt-1 font-semibold ${
              decision.negotiationMargin >= 0
                ? "text-emerald-400"
                : "text-amber-300"
            }`}
          >
            {formatCurrency(decision.negotiationMargin)}
          </p>
        </div>
        <div className="rounded-md bg-zinc-950/60 p-3">
          <p className="text-xs text-zinc-500">Expected Profit</p>
          <p className="mt-1 font-semibold text-emerald-400">
            ${decision.expectedProfit.toLocaleString()}
          </p>
        </div>
        <div className="rounded-md bg-zinc-950/60 p-3">
          <p className="text-xs text-zinc-500">ROI</p>
          <p className="mt-1 font-semibold text-cyan-300">{decision.roi}%</p>
        </div>
      </div>

      <div className="mt-5 border-t border-zinc-800 pt-5">
        <p className="text-sm font-medium text-zinc-200">Explanation</p>
        <ul className="mt-3 space-y-2 text-sm text-zinc-400">
          {decision.explanation.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
