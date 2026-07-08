import CardImage from "@/components/ui/CardImage";
import type { PrintingMatchCandidate } from "@/types/printingResolution";

type PrintingResultsProps = {
  candidates: PrintingMatchCandidate[];
  highlightedPrintingId?: string;
  selectedPrintingId: string;
  onSelectPrinting: (printingId: string) => void;
};

function formatList(values: string[]) {
  return values.length > 0 ? values.join(", ") : "None";
}

function getPrintingStyle(candidate: PrintingMatchCandidate) {
  const printing = candidate.printing;
  const usefulStyles = [
    printing.treatment,
    ...(printing.frameEffects ?? []),
    ...(printing.promoTypes ?? []),
  ].filter((value): value is string => Boolean(value));

  return usefulStyles.length > 0 ? formatList(usefulStyles) : "Regular artwork";
}

function getFinishStatus(candidate: PrintingMatchCandidate) {
  const finishMatch = candidate.matchedConstraints.find(
    (match) => match.constraint.type === "finish",
  );

  if (finishMatch) {
    return `✓ Finish: ${finishMatch.constraint.value}`;
  }

  if (candidate.finishVariants.length > 1) {
    return "Finish required";
  }

  return candidate.finishVariants[0]
    ? `Only ${candidate.finishVariants[0].finish}`
    : "Finish unavailable";
}

export default function PrintingResults({
  candidates,
  highlightedPrintingId,
  selectedPrintingId,
  onSelectPrinting,
}: PrintingResultsProps) {
  if (candidates.length === 0) {
    return null;
  }

  return (
    <section className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
      <div className="border-b border-zinc-800 px-3 py-2">
        <h3 className="text-sm font-semibold text-zinc-100">
          Available Printings
        </h3>
      </div>
      {candidates.map((candidate) => {
        const printing = candidate.printing;
        const isSelected = printing.id === selectedPrintingId;
        const isHighlighted = printing.id === highlightedPrintingId;

        return (
          <button
            key={printing.id}
            type="button"
            onClick={() => onSelectPrinting(printing.id)}
            className={`block w-full border-b border-zinc-800 px-3 py-2 text-left last:border-b-0 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-400 ${
              isSelected
                ? "bg-cyan-400 text-zinc-950"
                : isHighlighted
                  ? "bg-zinc-800 text-zinc-100"
                : "bg-zinc-900 text-zinc-100 hover:bg-zinc-800"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex min-w-0 gap-2">
                <CardImage
                  card={printing}
                  detail={`${printing.set} ${printing.finish}`}
                  size="printing"
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold">
                    {printing.set}{" "}
                    {printing.setCode ? `(${printing.setCode})` : ""}
                  </p>
                  <p className="mt-1 text-xs opacity-75">
                    #{printing.number} / {printing.language ?? "English"} /{" "}
                    {formatList(candidate.availableFinishes)}
                  </p>
                  <p className="mt-1 text-xs opacity-75">
                    {getPrintingStyle(candidate)} / {printing.releaseYear ?? "Unknown"}
                  </p>
                </div>
              </div>
              <span className="text-right text-xs font-semibold">
                <span className="block">{getFinishStatus(candidate)}</span>
                <span className="opacity-70">Match {candidate.confidence}</span>
              </span>
            </div>
          </button>
        );
      })}
    </section>
  );
}
