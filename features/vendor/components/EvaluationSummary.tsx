import DecisionBadge from "@/features/vendor/components/DecisionBadge";
import type { PurchaseEvaluation } from "@/lib/engines/evaluation/evaluatePurchase";
import type { ReactNode } from "react";

type EvaluationSummaryProps = {
  askingPrice: number;
  evaluation: PurchaseEvaluation;
};

function formatCurrency(value: number) {
  const prefix = value > 0 ? "+" : value < 0 ? "-" : "";
  const absoluteValue = Math.abs(value);

  return `${prefix}$${absoluteValue.toLocaleString()}`;
}

const driverStyles = {
  negative: "text-red-300",
  positive: "text-emerald-300",
  warning: "text-amber-300",
};

const driverSymbols = {
  negative: "x",
  positive: "✓",
  warning: "!",
};

type Tone = "cyan" | "default" | "negative" | "positive" | "warning";

export default function EvaluationSummary({
  askingPrice,
  evaluation,
}: EvaluationSummaryProps) {
  const { decision, ranking } = evaluation;
  const ladder = evaluation.negotiationLadder;

  return (
    <section className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs text-zinc-500">Recommendation</p>
          <div className="mt-2">
            <DecisionBadge action={decision.action} />
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-zinc-500">Decision Confidence</p>
          <p className="mt-1 text-2xl font-semibold text-amber-300">
            {decision.confidence}
            <span className="text-base">%</span>
          </p>
          <p className="text-sm text-zinc-300">Grade {ranking.grade}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 rounded-md border border-zinc-800 bg-zinc-950/60 p-3">
        <div>
          <p className="text-xs text-zinc-500">Target Offer</p>
          <p className="mt-1 font-semibold text-white">
            ${ladder.targetOffer.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-zinc-500">Profit</p>
          <p className="mt-1 font-semibold text-emerald-400">
            {formatCurrency(evaluation.estimatedProfit)}
          </p>
        </div>
        <div>
          <p className="text-xs text-zinc-500">ROI</p>
          <p className="mt-1 font-semibold text-cyan-300">{evaluation.roi}%</p>
        </div>
      </div>

      <div className="mt-4 space-y-4 border-t border-zinc-800 pt-4">
        <MetricGroup title="Pricing">
          <Metric label="Market Estimate" value={`$${evaluation.marketEstimate.price.toLocaleString()}`} />
          <Metric label="Current Asking Price" value={`$${askingPrice.toLocaleString()}`} />
        </MetricGroup>

        <MetricGroup title="Profitability">
          <Metric label="Margin" value={formatCurrency(evaluation.estimatedMargin)} />
        </MetricGroup>

        <NegotiationLadderView askingPrice={askingPrice} evaluation={evaluation} />

        <MetricGroup title="Negotiation">
          <Metric label="Recommended Offer" value={`$${evaluation.recommendedOffer.toLocaleString()}`} tone="cyan" />
          <Metric
            label="Negotiation Margin"
            value={formatCurrency(decision.negotiationMargin)}
            tone={decision.negotiationMargin >= 0 ? "positive" : "warning"}
          />
        </MetricGroup>
      </div>

      <div className="mt-4 border-t border-zinc-800 pt-4">
        <p className="text-sm font-medium text-zinc-200">Decision Drivers</p>
        <ul className="mt-3 space-y-2 text-sm text-zinc-400">
          {evaluation.decisionDrivers.map((driver) => (
            <li key={driver.message} className="flex gap-2">
              <span className={driverStyles[driver.tone]}>
                {driverSymbols[driver.tone]}
              </span>
              <span>{driver.message}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function NegotiationLadderView({
  askingPrice,
  evaluation,
}: EvaluationSummaryProps) {
  const ladder = evaluation.negotiationLadder;
  const steps: { label: string; tone: Tone; value: number }[] = [
    {
      label: "Opening Offer",
      value: ladder.openingOffer,
      tone: "default" as const,
    },
    {
      label: "Target Offer",
      value: ladder.targetOffer,
      tone: "cyan" as const,
    },
    {
      label: "Maximum Buy Price",
      value: ladder.maximumBuyPrice,
      tone: "warning" as const,
    },
    {
      label: "Seller Asking Price",
      value: askingPrice,
      tone:
        askingPrice <= ladder.targetOffer
          ? "positive"
          : askingPrice <= ladder.maximumBuyPrice
            ? "warning"
            : "negative",
    },
  ];

  return (
    <div>
      <p className="text-xs font-medium uppercase text-zinc-500">
        Negotiation Ladder
      </p>
      <div className="mt-2 rounded-md border border-zinc-800 bg-zinc-950/60 p-3">
        <div className="space-y-2">
          {steps.map((step, index) => (
            <div key={step.label}>
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-zinc-500">{step.label}</span>
                <span
                  className={`text-sm font-semibold ${getToneClass(step.tone)}`}
                >
                  ${step.value.toLocaleString()}
                </span>
              </div>
              {index < steps.length - 1 ? (
                <div className="ml-2 h-3 border-l border-zinc-700" />
              ) : null}
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-md bg-zinc-900 px-3 py-2 text-center text-sm font-semibold text-white">
          {evaluation.decision.action}
        </div>
      </div>
    </div>
  );
}

function MetricGroup({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase text-zinc-500">{title}</p>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function Metric({
  label,
  tone = "default",
  value,
}: {
  label: string;
  tone?: "cyan" | "default" | "positive" | "warning";
  value: string;
}) {
  const toneClass = {
    cyan: "text-cyan-300",
    default: "text-white",
    negative: "text-red-300",
    positive: "text-emerald-400",
    warning: "text-amber-300",
  }[tone];

  return (
    <div className="rounded-md bg-zinc-950/60 p-3">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className={`mt-1 font-semibold ${toneClass}`}>{value}</p>
    </div>
  );
}

function getToneClass(
  tone: Tone,
) {
  return {
    cyan: "text-cyan-300",
    default: "text-white",
    negative: "text-red-300",
    positive: "text-emerald-400",
    warning: "text-amber-300",
  }[tone];
}
