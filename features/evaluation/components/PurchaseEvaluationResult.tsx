import DecisionBadge from "@/features/evaluation/components/DecisionBadge";
import type { PurchaseEvaluation } from "@/lib/engines/evaluation/evaluatePurchase";

type PurchaseEvaluationResultProps = {
  evaluation: PurchaseEvaluation;
};

function formatCurrency(value: number) {
  return `$${value.toLocaleString()}`;
}

export default function PurchaseEvaluationResult({
  evaluation,
}: PurchaseEvaluationResultProps) {
  const { decision, ranking } = evaluation;

  return (
    <section className="rounded-lg border border-zinc-800 bg-zinc-900 p-6 shadow-lg shadow-black/10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-400">Purchasing Decision</p>
          <div className="mt-2">
            <DecisionBadge action={decision.action} />
          </div>
        </div>

        <div className="rounded-md border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-right">
          <p className="text-xs text-amber-200">Opportunity Score</p>
          <p className="mt-1 text-2xl font-semibold text-amber-300">
            {decision.confidence}
          </p>
          <p className="text-sm text-zinc-300">Grade {ranking.grade}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 border-t border-zinc-800 pt-6 sm:grid-cols-3">
        <div className="rounded-md bg-zinc-950/60 p-4">
          <p className="text-xs text-zinc-500">Maximum Purchase Price</p>
          <p className="mt-1 text-lg font-semibold text-white">
            {formatCurrency(decision.maximumPurchasePrice)}
          </p>
        </div>
        <div className="rounded-md bg-zinc-950/60 p-4">
          <p className="text-xs text-zinc-500">Expected Profit</p>
          <p className="mt-1 text-lg font-semibold text-emerald-400">
            {formatCurrency(decision.expectedProfit)}
          </p>
        </div>
        <div className="rounded-md bg-zinc-950/60 p-4">
          <p className="text-xs text-zinc-500">ROI</p>
          <p className="mt-1 text-lg font-semibold text-cyan-300">
            {decision.roi}%
          </p>
        </div>
      </div>

      <div className="mt-6 border-t border-zinc-800 pt-6">
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
