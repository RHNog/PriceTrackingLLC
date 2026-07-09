import type { EvidenceDomainId } from "@/lib/market/ontology/EvidenceDomain";

export type EvidenceCapabilityStatus =
  | "SUPPORTED"
  | "UNSUPPORTED"
  | "UNKNOWN"
  | "PARTIAL";

export interface EvidenceCapability {
  domainId: EvidenceDomainId;
  explanation: string;
  status: EvidenceCapabilityStatus;
}

export function createEvidenceCapability(input: EvidenceCapability) {
  return input;
}
