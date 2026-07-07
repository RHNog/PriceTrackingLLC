import { commitCanonicalIdentity } from "@/lib/engines/canonical/commitCanonicalIdentity";
import { rankCanonicalCandidates } from "@/lib/engines/canonical/rankCanonicalCandidates";
import type { CanonicalResolution } from "@/types/canonicalResolution";
import type { ParsedQuery } from "@/types/parsedQuery";

export function resolveCanonicalTerms(
  parsedQuery: ParsedQuery,
): CanonicalResolution {
  const startedAt = Date.now();
  const candidates = rankCanonicalCandidates(parsedQuery);
  const chosenCandidate = commitCanonicalIdentity(candidates);
  const rejectedCandidates = candidates
    .filter((candidate) => candidate !== chosenCandidate)
    .map((candidate) => ({
      ...candidate,
      rejectedReason: chosenCandidate
        ? `Ranked below ${chosenCandidate.entry.canonicalIdentity}.`
        : "Below auto-commit threshold or too close to another candidate.",
    }));
  const resolvedQuery =
    chosenCandidate?.entry.canonicalIdentity ?? parsedQuery.cardName;

  return {
    candidates,
    chosenCandidate,
    confidence: chosenCandidate?.confidence ?? candidates[0]?.confidence ?? 0,
    explanation: chosenCandidate
      ? [
          `Canonical shorthand resolved to ${chosenCandidate.entry.canonicalIdentity}.`,
          ...chosenCandidate.explanation,
        ]
      : candidates.length > 0
        ? ["Canonical shorthand is ambiguous.", ...candidates[0].explanation]
        : ["No canonical shorthand match found."],
    rejectedCandidates,
    resolvedQuery,
    resolutionTimeMs: Date.now() - startedAt,
  };
}
