import type { IdentityCandidate } from "@/types/identityCandidate";
import type { PrintingCandidate } from "@/types/printingCandidate";

export interface IntentCandidate {
  identityCandidate: IdentityCandidate;
  printingCandidates: PrintingCandidate[];
}
