import type { EvidenceRequirement } from "@/lib/intelligence/framework/EvidenceRequirement";
import type { EvidenceScore } from "@/lib/intelligence/framework/EvidenceScore";
import type { EvidenceStatus } from "@/lib/intelligence/framework/EvidenceStatus";

export interface EvidenceReport extends EvidenceScore {
  explanation: string;
  futureEvidence: EvidenceRequirement[];
  missingEvidence: EvidenceRequirement[];
  optionalEvidence: EvidenceRequirement[];
  presentEvidence: EvidenceRequirement[];
  requiredEvidence: EvidenceRequirement[];
  status: EvidenceStatus;
}
