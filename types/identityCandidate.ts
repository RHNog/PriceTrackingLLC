import type { CardIdentity } from "@/types/cardIdentity";
import type { CandidateExplanation } from "@/types/candidateExplanation";
import type { IdentityRelationship } from "@/types/identityRelationship";

export interface IdentityCandidate {
  confidence: number;
  explanation: string[];
  explanationDetails?: CandidateExplanation[];
  identity: CardIdentity;
  normalizationBoost?: number;
  scoreAfterNormalizationBoost?: number;
  scoreBeforeNormalizationBoost?: number;
  relationship?: IdentityRelationship;
  rejectedReason?: string;
}
