import { constraintConfig } from "@/config/constraints";
import { explainPrintingMatch } from "@/lib/engines/constraints/explainPrintingMatch";
import { scorePrintingAgainstConstraints } from "@/lib/engines/constraints/scorePrintingAgainstConstraints";
import type { Card } from "@/types/card";
import type { PrintingConstraint } from "@/types/printingConstraint";

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function getSelectionPriority(printing: Card) {
  const finishes =
    printing.availableFinishes ??
    printing.finishVariants?.map((variant) => variant.finish) ??
    [];

  if (finishes.some((finish) => normalize(finish) === "nonfoil")) {
    return 3;
  }

  if (finishes.some((finish) => normalize(finish) === "foil")) {
    return 2;
  }

  return finishes.length > 0 ? 1 : 0;
}

export function rankPrintingMatches(
  printings: Card[],
  constraints: PrintingConstraint[],
) {
  return printings
    .map((printing) => {
      const candidate = scorePrintingAgainstConstraints(printing, constraints);
      const finishVariants = printing.finishVariants ?? [];
      const availableFinishes =
        printing.availableFinishes ??
        finishVariants.map((variant) => variant.finish) ??
        (printing.finish ? [printing.finish] : []);

      return {
        ...candidate,
        availableFinishes,
        explanation: explainPrintingMatch(candidate),
        finishVariants,
        selectionPriority: getSelectionPriority(printing),
      };
    })
    .sort(
      (first, second) =>
        second.confidence - first.confidence ||
        (second.selectionPriority ?? 0) - (first.selectionPriority ?? 0),
    )
    .slice(0, constraintConfig.maximumPrintingCandidates);
}
