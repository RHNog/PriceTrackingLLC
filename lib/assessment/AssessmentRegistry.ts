import type { AssessmentEvidenceKind } from "@/lib/assessment/AssessmentEvidence";

export interface AssessmentEvidenceSource {
  kind: AssessmentEvidenceKind;
  label: string;
  weight: number;
}

export const assessmentRegistry: AssessmentEvidenceSource[] = [
  { kind: "Knowledge Graph", label: "Knowledge Graph", weight: 0.14 },
  { kind: "Playability", label: "Playability Intelligence", weight: 0.18 },
  { kind: "Certification", label: "Certification Intelligence", weight: 0.14 },
  { kind: "Collector", label: "Collector Intelligence", weight: 0.14 },
  { kind: "Investment", label: "Investment Intelligence", weight: 0.12 },
  { kind: "Market", label: "Market Intelligence", weight: 0.12 },
  { kind: "Liquidity", label: "Liquidity Intelligence", weight: 0.08 },
  { kind: "Business Context", label: "Business Context", weight: 0.04 },
  { kind: "Evidence Sufficiency", label: "Evidence Sufficiency", weight: 0.04 },
];
