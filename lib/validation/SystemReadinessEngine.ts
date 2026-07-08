import {
  validateBusinessProfileConfiguration,
  validateMarketConfiguration,
  validateStrategyConfiguration,
} from "@/lib/validation/ConfigurationValidator";
import type { EvaluationPrerequisites } from "@/lib/validation/EvaluationPrerequisites";
import {
  createReadinessReport,
  type ReadinessIssue,
  type ReadinessReport,
} from "@/lib/validation/ReadinessReport";
import type { ReadinessStatus } from "@/lib/validation/ReadinessStatus";
import { validateCardIntelligence } from "@/lib/validation/ReadinessValidator";

function getStatus(issues: ReadinessIssue[]): ReadinessStatus {
  if (issues.length === 0) {
    return "READY";
  }

  if (issues.some((issue) => issue.type === "Internal Error")) {
    return "ERROR";
  }

  if (issues.some((issue) => issue.type === "Calculation Failure")) {
    return "INVALID";
  }

  if (issues.some((issue) => issue.component === "Market Snapshot")) {
    return "WAITING_FOR_MARKET_DATA";
  }

  if (issues.some((issue) => issue.type === "Configuration Problem")) {
    return "WAITING_FOR_CONFIGURATION";
  }

  return "PARTIAL";
}

export function createSystemReadinessReport(
  prerequisites: EvaluationPrerequisites,
): ReadinessReport {
  const businessIssues = validateBusinessProfileConfiguration(
    prerequisites.businessProfile,
  );
  const marketIssues = validateMarketConfiguration(prerequisites.marketPrice);
  const strategyIssues = validateStrategyConfiguration(prerequisites.strategyProfile);
  const cardIntelligence = validateCardIntelligence(prerequisites.cardProfile);
  const blockingIssues = [
    ...businessIssues,
    ...marketIssues,
    ...cardIntelligence.issues,
    ...strategyIssues,
  ];
  const missingComponents = blockingIssues.map((issue) => issue.component);
  const readyComponents = [
    businessIssues.length === 0 ? "Business Profile" : "",
    marketIssues.length === 0 ? "Market Snapshot" : "",
    cardIntelligence.issues.length === 0 ? "Card Intelligence" : "",
    strategyIssues.length === 0 ? "Strategy" : "",
    blockingIssues.length === 0 ? "Offer Ladder" : "",
    blockingIssues.length === 0 ? "Decision" : "",
  ].filter(Boolean);

  return createReadinessReport({
    status: getStatus(blockingIssues),
    blockingIssues,
    warnings: cardIntelligence.warnings,
    readyComponents,
    missingComponents,
  });
}

export function isSystemReady(report: ReadinessReport) {
  return report.status === "READY" || report.status === "PARTIAL";
}

