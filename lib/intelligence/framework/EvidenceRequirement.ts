export type EvidenceRequirementType = "REQUIRED" | "OPTIONAL" | "FUTURE";

export interface EvidenceRequirement {
  id: string;
  label: string;
  type: EvidenceRequirementType;
  acceptedDataSources?: string[];
  indicatorIds?: string[];
  minimumConfidence?: number;
  minimumScore?: number;
  futureProviders?: string[];
}
