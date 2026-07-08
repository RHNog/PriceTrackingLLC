export type IntelligenceGrade =
  | "A+"
  | "A"
  | "A-"
  | "B+"
  | "B"
  | "B-"
  | "C+"
  | "C"
  | "C-"
  | "D"
  | "F";

export function getIntelligenceGrade(score: number): IntelligenceGrade {
  if (score >= 95) {
    return "A+";
  }

  if (score >= 90) {
    return "A";
  }

  if (score >= 85) {
    return "A-";
  }

  if (score >= 80) {
    return "B+";
  }

  if (score >= 75) {
    return "B";
  }

  if (score >= 70) {
    return "B-";
  }

  if (score >= 65) {
    return "C+";
  }

  if (score >= 60) {
    return "C";
  }

  if (score >= 55) {
    return "C-";
  }

  if (score >= 50) {
    return "D";
  }

  return "F";
}

export type IntelligenceConfidenceLabel =
  | "Very Low"
  | "Low"
  | "Moderate"
  | "High"
  | "Very High";

export function getConfidenceLabel(
  confidence: number,
): IntelligenceConfidenceLabel {
  if (confidence >= 85) {
    return "Very High";
  }

  if (confidence >= 70) {
    return "High";
  }

  if (confidence >= 50) {
    return "Moderate";
  }

  if (confidence >= 30) {
    return "Low";
  }

  return "Very Low";
}

export default function IntelligenceGradeBadge({ score }: { score: number }) {
  return (
    <span className="inline-flex h-7 min-w-9 items-center justify-center rounded-md border border-cyan-400/30 bg-cyan-400/10 px-2 text-sm font-semibold text-cyan-200">
      {getIntelligenceGrade(score)}
    </span>
  );
}
