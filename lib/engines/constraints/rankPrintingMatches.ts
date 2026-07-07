import { constraintConfig } from "@/config/constraints";
import { explainPrintingMatch } from "@/lib/engines/constraints/explainPrintingMatch";
import { scorePrintingAgainstConstraints } from "@/lib/engines/constraints/scorePrintingAgainstConstraints";
import type { Card } from "@/types/card";
import type { PrintingConstraint } from "@/types/printingConstraint";

export function rankPrintingMatches(
  printings: Card[],
  constraints: PrintingConstraint[],
) {
  return printings
    .map((printing) => {
      const candidate = scorePrintingAgainstConstraints(printing, constraints);

      return {
        ...candidate,
        explanation: explainPrintingMatch(candidate),
      };
    })
    .sort((first, second) => second.confidence - first.confidence)
    .slice(0, constraintConfig.maximumPrintingCandidates);
}
