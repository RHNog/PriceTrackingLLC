export type AssessmentEvidenceKind =
  | "Business Context"
  | "Certification"
  | "Collector"
  | "Evidence Sufficiency"
  | "Investment"
  | "Knowledge Graph"
  | "Liquidity"
  | "Market"
  | "Playability";

export interface AssessmentEvidence {
  confidence: number;
  driver: string;
  explanation: string;
  kind: AssessmentEvidenceKind;
  score: number;
  source: string;
  status: "Available" | "Unknown";
  weight: number;
}
