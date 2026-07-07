import type { CanonicalCandidate } from "@/types/canonicalCandidate";

export interface CanonicalResolution {
  candidates: CanonicalCandidate[];
  chosenCandidate?: CanonicalCandidate;
  confidence: number;
  rejectedCandidates: CanonicalCandidate[];
  resolvedQuery: string;
  resolutionTimeMs: number;
  explanation: string[];
}
