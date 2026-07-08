import IntelligenceGradeBadge, {
  getConfidenceLabel,
  getEvidenceAwareGrade,
} from "@/components/intelligence/IntelligenceGrade";
import type { IntelligenceModel } from "@/lib/intelligence/framework/IntelligenceModel";

type IntelligenceTileProps = {
  isExpanded: boolean;
  model: IntelligenceModel;
  score: number;
  onToggle: () => void;
};

function getDisplayName(name: string) {
  return name.replace(/\s+Intelligence$/, "");
}

export default function IntelligenceTile({
  isExpanded,
  model,
  onToggle,
  score,
}: IntelligenceTileProps) {
  return (
    <button
      type="button"
      aria-expanded={isExpanded}
      onClick={onToggle}
      className="grid w-full grid-cols-[minmax(0,1fr)_auto_auto_auto] items-center gap-3 rounded-md border border-zinc-800 bg-zinc-950/70 px-3 py-2 text-left transition hover:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
    >
      <span className="truncate text-sm font-medium text-zinc-200">
        {getDisplayName(model.name)}
      </span>
      {model.evidenceReport.status === "INSUFFICIENT" ? (
        <span className="inline-flex h-7 min-w-16 items-center justify-center rounded-md border border-zinc-600 bg-zinc-800 px-2 text-sm font-semibold text-zinc-200">
          {getEvidenceAwareGrade(score, model.evidenceReport.status)}
        </span>
      ) : (
        <IntelligenceGradeBadge score={score} />
      )}
      <span className="min-w-12 text-right text-sm font-semibold text-zinc-300">
        {getConfidenceLabel(model.confidence)}
      </span>
      <span
        aria-hidden="true"
        className="text-xs font-semibold text-zinc-500"
      >
        {isExpanded ? "▼" : "▶"}
      </span>
    </button>
  );
}
