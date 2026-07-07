import { canonicalConfig } from "@/config/canonical";
import type { CanonicalCandidate } from "@/types/canonicalCandidate";

export function commitCanonicalIdentity(candidates: CanonicalCandidate[]) {
  const topCandidate = candidates[0];

  if (!topCandidate) {
    return undefined;
  }

  const secondCandidate = candidates[1];
  const isAmbiguous =
    secondCandidate && topCandidate.confidence - secondCandidate.confidence < 6;

  if (
    topCandidate.confidence >= canonicalConfig.autoCommitThreshold &&
    !isAmbiguous
  ) {
    return topCandidate;
  }

  return undefined;
}
