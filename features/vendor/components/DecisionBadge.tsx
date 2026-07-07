import type { Decision } from "@/types/decision";

type DecisionBadgeProps = {
  action: Decision["action"];
};

const badgeStyles: Record<Decision["action"], string> = {
  BUY: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  NEGOTIATE: "border-amber-400/30 bg-amber-400/10 text-amber-300",
  PASS: "border-red-400/30 bg-red-400/10 text-red-300",
};

export default function DecisionBadge({ action }: DecisionBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${badgeStyles[action]}`}
    >
      {action}
    </span>
  );
}
