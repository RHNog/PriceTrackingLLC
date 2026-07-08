import { constraintConfig } from "@/config/constraints";
import type { PrintingConstraint } from "@/types/printingConstraint";
import type { PrintingMatchCandidate } from "@/types/printingResolution";

function hasMandatoryFailures(
  candidate: PrintingMatchCandidate | undefined,
  constraints: PrintingConstraint[],
) {
  const hasMandatoryConstraints = constraints.some(
    (constraint) => constraint.priority === "mandatory",
  );

  if (!hasMandatoryConstraints) {
    return false;
  }

  return candidate?.unmatchedConstraints.some(
    (match) => match.constraint.priority === "mandatory",
  );
}

export function commitPrintingMatch(
  candidates: PrintingMatchCandidate[],
  constraints: PrintingConstraint[],
) {
  const topCandidate = candidates[0];
  const secondCandidate = candidates[1];

  if (!topCandidate || hasMandatoryFailures(topCandidate, constraints)) {
    return undefined;
  }

  const confidenceGap = secondCandidate
    ? topCandidate.confidence - secondCandidate.confidence
    : topCandidate.confidence;
  const selectionPriorityGap = secondCandidate
    ? (topCandidate.selectionPriority ?? 0) -
      (secondCandidate.selectionPriority ?? 0)
    : topCandidate.selectionPriority ?? 0;

  if (
    topCandidate.confidence >= constraintConfig.printingAutoCommitThreshold &&
    (confidenceGap >= constraintConfig.minimumConfidenceGap ||
      (confidenceGap === 0 && selectionPriorityGap > 0))
  ) {
    return topCandidate;
  }

  return undefined;
}
