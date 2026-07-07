import type { PrintingMatchCandidate } from "@/types/printingResolution";

type PrintingResultsProps = {
  candidates: PrintingMatchCandidate[];
  selectedPrintingId: string;
  onSelectPrinting: (printingId: string) => void;
};

function formatList(values: string[]) {
  return values.length > 0 ? values.join(", ") : "None";
}

export default function PrintingResults({
  candidates,
  selectedPrintingId,
  onSelectPrinting,
}: PrintingResultsProps) {
  if (candidates.length === 0) {
    return null;
  }

  return (
    <section className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
      <div className="border-b border-zinc-800 px-4 py-3">
        <h3 className="text-sm font-semibold text-zinc-100">
          Printing Candidates
        </h3>
      </div>
      {candidates.map((candidate) => {
        const printing = candidate.printing;
        const isSelected = printing.id === selectedPrintingId;

        return (
          <button
            key={printing.id}
            type="button"
            onClick={() => onSelectPrinting(printing.id)}
            className={`block w-full border-b border-zinc-800 px-4 py-3 text-left last:border-b-0 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-400 ${
              isSelected
                ? "bg-cyan-400 text-zinc-950"
                : "bg-zinc-900 text-zinc-100 hover:bg-zinc-800"
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">
                  {printing.set} {printing.setCode ? `(${printing.setCode})` : ""}
                </p>
                <p className="mt-1 text-xs opacity-75">
                  #{printing.number} / {printing.language ?? "en"} /{" "}
                  {printing.finish}
                </p>
                <p className="mt-1 text-xs opacity-75">
                  Treatment: {printing.treatment || "Standard"} / Frame:{" "}
                  {printing.frame || "Default"} / Promo:{" "}
                  {formatList(printing.promoTypes ?? [])}
                </p>
                <p className="mt-1 text-xs opacity-75">
                  Product: {printing.productFamily || printing.set} / Released:{" "}
                  {printing.releaseYear ?? "Unknown"}
                </p>
              </div>
              <span className="text-xs font-semibold">
                Match {candidate.confidence}
              </span>
            </div>
            <div className="mt-2 grid gap-1 text-xs opacity-80 md:grid-cols-2">
              <p>
                Matched:{" "}
                {formatList(
                  candidate.matchedConstraints.map(
                    (match) =>
                      `${match.constraint.type} ${match.constraint.value}`,
                  ),
                )}
              </p>
              <p>
                Missing:{" "}
                {formatList(
                  candidate.unmatchedConstraints.map(
                    (match) =>
                      `${match.constraint.type} ${match.constraint.value}`,
                  ),
                )}
              </p>
            </div>
          </button>
        );
      })}
    </section>
  );
}
