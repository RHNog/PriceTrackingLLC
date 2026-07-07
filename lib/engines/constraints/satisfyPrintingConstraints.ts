import { commitPrintingMatch } from "@/lib/engines/constraints/commitPrintingMatch";
import { rankPrintingMatches } from "@/lib/engines/constraints/rankPrintingMatches";
import type { Card } from "@/types/card";
import type { CardIdentity } from "@/types/cardIdentity";
import type { Constraint } from "@/types/constraint";
import type {
  PrintingConstraint,
  PrintingConstraintPriority,
  PrintingConstraintType,
} from "@/types/printingConstraint";
import type { PrintingResolution } from "@/types/printingResolution";

const mandatoryTypes: PrintingConstraintType[] = [
  "collectorNumber",
  "game",
  "product",
  "promo",
  "set",
  "setCode",
];
const informationalTypes: PrintingConstraintType[] = ["condition", "grading"];

function getPriority(type: PrintingConstraintType): PrintingConstraintPriority {
  if (mandatoryTypes.includes(type)) {
    return "mandatory";
  }

  if (informationalTypes.includes(type)) {
    return "informational";
  }

  return "preferred";
}

function toPrintingConstraint(constraint: Constraint): PrintingConstraint | null {
  const type = constraint.field as PrintingConstraintType;
  const supportedTypes: PrintingConstraintType[] = [
    "collectorNumber",
    "condition",
    "finish",
    "frame",
    "game",
    "grading",
    "language",
    "product",
    "promo",
    "set",
    "setCode",
    "treatment",
    "variant",
  ];

  if (!supportedTypes.includes(type)) {
    return null;
  }

  return {
    confidence: constraint.confidence ?? 90,
    priority: getPriority(type),
    sourceToken: constraint.sourceToken ?? constraint.value,
    type,
    value: constraint.value,
  };
}

export function toPrintingConstraints(constraints: Constraint[]) {
  return constraints
    .map(toPrintingConstraint)
    .filter((constraint): constraint is PrintingConstraint => Boolean(constraint));
}

export function satisfyPrintingConstraints(
  identity: CardIdentity,
  printings: Card[],
  constraints: Constraint[],
): PrintingResolution {
  // TODO: Marketplace-specific printing availability.
  // TODO: Condition-based pricing and graded card evaluation.
  // TODO: Seller inventory matching.
  // TODO: User preference weighting and personal vocabulary.
  // TODO: Community vocabulary, Knowledge Feedback Engine, and Vendor Intelligence Engine.
  const printingConstraints = toPrintingConstraints(constraints);
  const printingCandidates = rankPrintingMatches(printings, printingConstraints);
  const selectedCandidate = commitPrintingMatch(
    printingCandidates,
    printingConstraints,
  );
  const bestCandidate = selectedCandidate ?? printingCandidates[0];
  const fallbackExplanation =
    bestCandidate && bestCandidate.confidence > 0
      ? [
          `Best alternative is ${bestCandidate.printing.set} #${bestCandidate.printing.number}.`,
          "Printing was not auto-committed because constraints were missing or confidence was too close.",
        ]
      : [
          `No printing matched ${identity.name} for the requested constraints.`,
          "The selection was left empty to avoid a default print match.",
        ];

  return {
    explanation: selectedCandidate
      ? [
          `Selected ${selectedCandidate.printing.set} #${selectedCandidate.printing.number}.`,
          "All mandatory printing constraints were satisfied.",
        ]
      : fallbackExplanation,
    matchedConstraints: bestCandidate?.matchedConstraints ?? [],
    printingCandidates,
    relaxedConstraints: printingConstraints.filter(
      (constraint) => constraint.priority === "informational",
    ),
    selectedPrinting: selectedCandidate?.printing,
    selectedPrintingConfidence: selectedCandidate?.confidence ?? 0,
    shouldAutoCommit: Boolean(selectedCandidate),
    unmatchedConstraints: bestCandidate?.unmatchedConstraints ?? [],
  };
}
