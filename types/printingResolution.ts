import type { Card } from "@/types/card";
import type { ConstraintMatch } from "@/types/constraintMatch";
import type { PrintingConstraint } from "@/types/printingConstraint";
import type { PrintingMatchExplanation } from "@/types/printingMatchExplanation";

export interface PrintingMatchCandidate {
  confidence: number;
  explanation: PrintingMatchExplanation[];
  matchedConstraints: ConstraintMatch[];
  printing: Card;
  relaxedConstraints: PrintingConstraint[];
  unmatchedConstraints: ConstraintMatch[];
}

export interface PrintingResolution {
  explanation: string[];
  matchedConstraints: ConstraintMatch[];
  printingCandidates: PrintingMatchCandidate[];
  relaxedConstraints: PrintingConstraint[];
  selectedPrinting?: Card;
  selectedPrintingConfidence: number;
  shouldAutoCommit: boolean;
  unmatchedConstraints: ConstraintMatch[];
}
