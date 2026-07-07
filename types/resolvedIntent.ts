import type { Constraint } from "@/types/constraint";
import type { IdentityCandidate } from "@/types/identityCandidate";
import type { IntentConfidence } from "@/types/intentConfidence";
import type { CardIdentity } from "@/types/cardIdentity";
import type { Card } from "@/types/card";
import type { ParsedQuery } from "@/types/parsedQuery";
import type { PrintingCandidate } from "@/types/printingCandidate";
import type { PrintingResolution } from "@/types/printingResolution";

export interface ResolvedIntent {
  confidence: IntentConfidence;
  identityCandidates: IdentityCandidate[];
  parsedQuery: ParsedQuery;
  printingCandidates: PrintingCandidate[];
  printingResolution?: PrintingResolution;
  relationshipResolutionTimeMs?: number;
  rejectedIdentityCandidates: IdentityCandidate[];
  rejectedPrintingCandidates: PrintingCandidate[];
  remainingTokens: string[];
  resolutionExplanation: string[];
  resolvedConstraints: Constraint[];
  selectedIdentity?: CardIdentity;
  selectedPrinting?: Card;
}
