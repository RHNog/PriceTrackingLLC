export type ProviderEvidenceStatus =
  | "AVAILABLE"
  | "PARTIAL"
  | "WAITING_FOR_PROVIDER"
  | "UNAVAILABLE";

export interface ProviderEvidence {
  confidenceContribution: number;
  evidenceType: string;
  explanation: string;
  mappedIndicatorIds: string[];
  source: string;
  status: ProviderEvidenceStatus;
}

export function createWaitingEvidence(
  source: string,
  evidenceType: string,
  mappedIndicatorIds: string[],
): ProviderEvidence {
  return {
    confidenceContribution: 0,
    evidenceType,
    explanation: `${source} evidence will become available after provider integration.`,
    mappedIndicatorIds,
    source,
    status: "WAITING_FOR_PROVIDER",
  };
}
