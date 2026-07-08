import type { Card } from "@/types/card";
import type { ConstraintMatch } from "@/types/constraintMatch";
import type { PrintingConstraint } from "@/types/printingConstraint";
import type { PrintingMatchExplanation } from "@/types/printingMatchExplanation";
import type { PrintingVariant } from "@/types/printingVariant";

export interface PrintingMatchCandidate {
  availableFinishes: string[];
  finishVariants: PrintingVariant[];
  confidence: number;
  explanation: PrintingMatchExplanation[];
  matchedConstraints: ConstraintMatch[];
  printing: Card;
  relaxedConstraints: PrintingConstraint[];
  selectionPriority?: number;
  unmatchedConstraints: ConstraintMatch[];
}

export interface PrintingResolution {
  availableVariants: PrintingVariant[];
  explanation: string[];
  matchedConstraints: ConstraintMatch[];
  printingCandidates: PrintingMatchCandidate[];
  relaxedConstraints: PrintingConstraint[];
  selectedPrinting?: Card;
  selectedPrintingConfidence: number;
  selectedVariant?: PrintingVariant | null;
  selectedVariantReason?: string;
  selectedVariantReasonCode?: string;
  selectedVariantConfidence: number;
  shouldAutoCommit: boolean;
  shouldAutoCommitPrinting: boolean;
  shouldAutoCommitVariant: boolean;
  unmatchedConstraints: ConstraintMatch[];
  variantCandidates: PrintingVariant[];
}
