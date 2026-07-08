import type { Indicator } from "@/lib/intelligence/framework/Indicator";
import type { EvidenceReport } from "@/lib/intelligence/framework/EvidenceReport";
import type { EvidenceRequirement } from "@/lib/intelligence/framework/EvidenceRequirement";
import type { EvidenceStatus } from "@/lib/intelligence/framework/EvidenceStatus";

type EvidenceSufficiencyInput = {
  indicators: Indicator[];
  requirements: EvidenceRequirement[];
};

function hasAcceptedSource(
  indicator: Indicator,
  requirement: EvidenceRequirement,
) {
  if (!requirement.acceptedDataSources?.length) {
    return true;
  }

  return indicator.dataSources.some((source) =>
    requirement.acceptedDataSources?.includes(source),
  );
}

function indicatorSatisfiesRequirement(
  indicator: Indicator,
  requirement: EvidenceRequirement,
) {
  if (
    requirement.indicatorIds?.length &&
    !requirement.indicatorIds.includes(indicator.id)
  ) {
    return false;
  }

  if (!hasAcceptedSource(indicator, requirement)) {
    return false;
  }

  if (
    requirement.minimumConfidence !== undefined &&
    indicator.confidence < requirement.minimumConfidence
  ) {
    return false;
  }

  if (
    requirement.minimumScore !== undefined &&
    indicator.score < requirement.minimumScore
  ) {
    return false;
  }

  return indicator.status !== "WAITING_FOR_PROVIDER";
}

function requirementIsPresent(
  requirement: EvidenceRequirement,
  indicators: Indicator[],
) {
  if (requirement.type === "FUTURE") {
    return false;
  }

  return indicators.some((indicator) =>
    indicatorSatisfiesRequirement(indicator, requirement),
  );
}

function getStatus(
  requiredEvidence: EvidenceRequirement[],
  missingRequiredEvidence: EvidenceRequirement[],
  optionalEvidence: EvidenceRequirement[],
  missingOptionalEvidence: EvidenceRequirement[],
): EvidenceStatus {
  if (requiredEvidence.length === 0) {
    return "UNKNOWN";
  }

  if (missingRequiredEvidence.length > 0) {
    return "INSUFFICIENT";
  }

  if (
    optionalEvidence.length > 0 &&
    missingOptionalEvidence.length === optionalEvidence.length
  ) {
    return "PARTIAL";
  }

  return "SUFFICIENT";
}

function getConfidenceAdjustment(status: EvidenceStatus) {
  if (status === "SUFFICIENT") {
    return 0;
  }

  if (status === "PARTIAL") {
    return -20;
  }

  if (status === "INSUFFICIENT") {
    return -45;
  }

  return -30;
}

function getExplanation(
  status: EvidenceStatus,
  missingEvidence: EvidenceRequirement[],
) {
  if (status === "SUFFICIENT") {
    return "Evidence is sufficient to produce a reliable intelligence grade.";
  }

  if (status === "PARTIAL") {
    return `Evidence is partial. Missing evidence: ${missingEvidence
      .map((requirement) => requirement.label)
      .join(", ")}.`;
  }

  if (status === "INSUFFICIENT") {
    return `The platform does not yet have sufficient evidence to evaluate this intelligence reliably. Missing evidence: ${missingEvidence
      .map((requirement) => requirement.label)
      .join(", ")}.`;
  }

  return "Evidence state is unknown.";
}

export function evaluateEvidenceSufficiency({
  indicators,
  requirements,
}: EvidenceSufficiencyInput): EvidenceReport {
  const requiredEvidence = requirements.filter(
    (requirement) => requirement.type === "REQUIRED",
  );
  const optionalEvidence = requirements.filter(
    (requirement) => requirement.type === "OPTIONAL",
  );
  const futureEvidence = requirements.filter(
    (requirement) => requirement.type === "FUTURE",
  );
  const missingRequiredEvidence = requiredEvidence.filter(
    (requirement) => !requirementIsPresent(requirement, indicators),
  );
  const missingOptionalEvidence = optionalEvidence.filter(
    (requirement) => !requirementIsPresent(requirement, indicators),
  );
  const presentEvidence = [...requiredEvidence, ...optionalEvidence].filter(
    (requirement) => requirementIsPresent(requirement, indicators),
  );
  const status = getStatus(
    requiredEvidence,
    missingRequiredEvidence,
    optionalEvidence,
    missingOptionalEvidence,
  );
  const missingEvidence = [
    ...missingRequiredEvidence,
    ...missingOptionalEvidence,
  ];
  const score =
    requirements.length === 0
      ? 0
      : Math.round((presentEvidence.length / requirements.length) * 100);

  return {
    confidenceAdjustment: getConfidenceAdjustment(status),
    explanation: getExplanation(status, missingEvidence),
    futureEvidence,
    missingEvidence,
    optionalEvidence,
    presentEvidence,
    requiredEvidence,
    score,
    status,
  };
}
