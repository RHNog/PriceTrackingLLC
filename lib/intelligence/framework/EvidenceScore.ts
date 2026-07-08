import type { EvidenceStatus } from "@/lib/intelligence/framework/EvidenceStatus";

export interface EvidenceScore {
  confidenceAdjustment: number;
  score: number;
  status: EvidenceStatus;
}
