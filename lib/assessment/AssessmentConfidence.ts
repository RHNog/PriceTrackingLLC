export type AssessmentConfidenceLabel =
  | "Very High"
  | "High"
  | "Moderate"
  | "Low"
  | "Very Low";

export interface AssessmentConfidence {
  label: AssessmentConfidenceLabel;
  reason: string;
  score: number;
}

export function getAssessmentConfidence(score: number): AssessmentConfidenceLabel {
  if (score >= 85) {
    return "Very High";
  }

  if (score >= 70) {
    return "High";
  }

  if (score >= 50) {
    return "Moderate";
  }

  if (score >= 30) {
    return "Low";
  }

  return "Very Low";
}
