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
import type { PrintingVariant } from "@/types/printingVariant";

const mandatoryTypes: PrintingConstraintType[] = [
  "collectorNumber",
  "finish",
  "game",
  "product",
  "promo",
  "set",
  "setCode",
];
const informationalTypes: PrintingConstraintType[] = ["condition", "grading"];

function normalize(value?: string) {
  return value?.toLowerCase().replace(/[^a-z0-9]+/g, "") ?? "";
}

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

function getFinishVariants(printing: Card): PrintingVariant[] {
  if (printing.finishVariants?.length) {
    return printing.finishVariants;
  }

  if (printing.finish && printing.finish !== "Unknown" && printing.finish !== "Multiple") {
    return [
      {
        id: `${printing.id}:${normalize(printing.finish)}`,
        printingId: printing.id,
        finish: printing.finish,
        imageUrls: printing.imageUrls,
        isAvailable: true,
        source: "Normalized Card",
      },
    ];
  }

  return [];
}

function findVariantForFinish(
  variants: PrintingVariant[],
  finishConstraint: PrintingConstraint | undefined,
) {
  if (!finishConstraint) {
    return undefined;
  }

  return variants.find(
    (variant) => normalize(variant.finish) === normalize(finishConstraint.value),
  );
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
  const finishConstraint = printingConstraints.find(
    (constraint) => constraint.type === "finish",
  );
  const availableVariants = selectedCandidate
    ? getFinishVariants(selectedCandidate.printing)
    : [];
  const selectedVariant = finishConstraint
    ? findVariantForFinish(availableVariants, finishConstraint) ?? null
    : availableVariants.length === 1
      ? availableVariants[0]
      : null;
  const shouldAutoCommitVariant = Boolean(
    selectedVariant &&
      (finishConstraint || availableVariants.length === 1),
  );
  const variantExplanation = selectedCandidate
    ? finishConstraint
      ? selectedVariant
        ? [`Selected finish variant ${selectedVariant.finish}.`]
        : [
            `Finish ${finishConstraint.value} is not available for the selected printing.`,
            "Variant was left unresolved to avoid choosing a different finish.",
          ]
      : availableVariants.length > 1
        ? [
            "Finish required: this printing has multiple available finishes.",
            "Choose a finish before purchase evaluation.",
          ]
        : selectedVariant
          ? [`Only ${selectedVariant.finish} is available, so the finish was selected.`]
          : ["No finish variant data is available for this printing."]
    : [];
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
    availableVariants,
    explanation: selectedCandidate
      ? [
          `Selected ${selectedCandidate.printing.set} #${selectedCandidate.printing.number}.`,
          "All mandatory printing constraints were satisfied.",
          ...variantExplanation,
        ]
      : fallbackExplanation,
    matchedConstraints: bestCandidate?.matchedConstraints ?? [],
    printingCandidates,
    relaxedConstraints: printingConstraints.filter(
      (constraint) => constraint.priority === "informational",
    ),
    selectedPrinting: selectedCandidate?.printing,
    selectedPrintingConfidence: selectedCandidate?.confidence ?? 0,
    selectedVariant,
    selectedVariantConfidence: selectedVariant ? selectedCandidate?.confidence ?? 0 : 0,
    shouldAutoCommit: Boolean(selectedCandidate),
    shouldAutoCommitPrinting: Boolean(selectedCandidate),
    shouldAutoCommitVariant,
    unmatchedConstraints: bestCandidate?.unmatchedConstraints ?? [],
    variantCandidates: availableVariants,
  };
}
