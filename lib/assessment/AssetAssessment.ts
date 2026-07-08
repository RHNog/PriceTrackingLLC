import type { AssessmentConfidence } from "@/lib/assessment/AssessmentConfidence";
import type { AssessmentEvidence } from "@/lib/assessment/AssessmentEvidence";
import type { AssessmentReasoning } from "@/lib/assessment/AssessmentReasoning";
import type { AssessmentSummary } from "@/lib/assessment/AssessmentSummary";

export interface AssetAssessment {
  modelId: "asset-assessment";
  modelName: "Asset Assessment";
  version: string;
  overallScore: number;
  overallAssessment: string;
  confidence: AssessmentConfidence;
  evidence: AssessmentEvidence[];
  evidenceCoverage: number;
  primaryDrivers: string[];
  supportingDrivers: string[];
  riskFactors: string[];
  opportunityFactors: string[];
  businessSummary: string;
  reasoning: AssessmentReasoning;
  summary: AssessmentSummary;
  dependencyGraph: string[];
  generatedAt: string;
}
