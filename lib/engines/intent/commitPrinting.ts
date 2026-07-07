import { intentConfig } from "@/config/intent";
import type { PrintingCandidate } from "@/types/printingCandidate";

export function commitPrinting(candidates: PrintingCandidate[]) {
  const bestCandidate = candidates[0];

  if (
    bestCandidate &&
    bestCandidate.confidence >= intentConfig.printingAutoSelectThreshold
  ) {
    return bestCandidate.printing;
  }

  return undefined;
}
