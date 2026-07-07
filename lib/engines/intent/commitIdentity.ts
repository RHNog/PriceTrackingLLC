import { intentConfig } from "@/config/intent";
import type { IdentityCandidate } from "@/types/identityCandidate";

const ambiguousNames = ["ajani", "angel", "dragon", "force", "jace", "lotus"];

export function commitIdentity(candidates: IdentityCandidate[]) {
  const bestCandidate = candidates[0];

  if (!bestCandidate) {
    return undefined;
  }

  const isAmbiguous = ambiguousNames.includes(bestCandidate.identity.name.toLowerCase());

  if (
    !isAmbiguous &&
    bestCandidate.confidence >= intentConfig.identityAutoSelectThreshold
  ) {
    return bestCandidate.identity;
  }

  return undefined;
}
