import { intentConfig } from "@/config/intent";
import { calculatePrintingConfidence } from "@/lib/engines/intent/calculatePrintingConfidence";
import type { Card } from "@/types/card";
import type { Constraint } from "@/types/constraint";
import type { PrintingCandidate } from "@/types/printingCandidate";

export function rankPrintingCandidates(
  printings: Card[],
  constraints: Constraint[],
): PrintingCandidate[] {
  return printings
    .map((printing) => {
      const confidence = calculatePrintingConfidence(printing, constraints);

      return {
        confidence,
        explanation: [`Printing confidence is ${confidence}.`],
        printing,
      };
    })
    .sort((first, second) => second.confidence - first.confidence)
    .slice(0, intentConfig.maximumPrintingResults);
}
