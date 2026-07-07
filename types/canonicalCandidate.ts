import type { CanonicalEntry } from "@/types/canonicalEntry";

export interface CanonicalCandidate {
  confidence: number;
  entry: CanonicalEntry;
  explanation: string[];
  matchedTerm: string;
  matchType: "alias" | "nickname" | "abbreviation" | "canonical";
  rejectedReason?: string;
}
