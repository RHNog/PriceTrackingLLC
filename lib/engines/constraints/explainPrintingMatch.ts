import type { PrintingMatchCandidate } from "@/types/printingResolution";

export function explainPrintingMatch(candidate: PrintingMatchCandidate) {
  return [
    {
      label: "Printing",
      passed: true,
      value: `${candidate.printing.set} #${candidate.printing.number}`,
    },
    {
      label: "Matched constraints",
      passed: candidate.matchedConstraints.length > 0,
      value: String(candidate.matchedConstraints.length),
    },
    {
      label: "Missing constraints",
      passed: candidate.unmatchedConstraints.length === 0,
      value: String(candidate.unmatchedConstraints.length),
    },
    {
      label: "Match score",
      passed: candidate.confidence >= 75,
      value: `${candidate.confidence}%`,
    },
  ];
}
