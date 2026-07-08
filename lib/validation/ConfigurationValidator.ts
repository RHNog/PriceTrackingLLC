import type { BusinessProfile } from "@/lib/business/BusinessProfileEngine";
import type { ReadinessIssue } from "@/lib/validation/ReadinessReport";
import type { MarketPrice } from "@/types/marketPrice";
import type { StrategyProfile } from "@/types/strategyProfile";

function issue(
  component: string,
  message: string,
  type: ReadinessIssue["type"] = "Configuration Problem",
): ReadinessIssue {
  return { component, message, type };
}

export function validateBusinessProfileConfiguration(
  businessProfile?: BusinessProfile,
) {
  const issues: ReadinessIssue[] = [];

  if (!businessProfile) {
    return [
      issue("Business Profile", "Select a Business Profile before evaluating."),
    ];
  }

  if (!businessProfile.defaultMarketplace) {
    issues.push(issue("Business Profile", "Marketplace profile is missing."));
  }

  if (!businessProfile.costProfile) {
    issues.push(issue("Business Profile", "Cost Profile is missing."));
  }

  if (!Number.isFinite(businessProfile.targetROI)) {
    issues.push(issue("Business Profile", "Configure Target ROI."));
  }

  if (!Number.isFinite(businessProfile.targetMargin)) {
    issues.push(issue("Business Profile", "Configure Target Margin."));
  }

  if (!Number.isFinite(businessProfile.minimumProfit)) {
    issues.push(issue("Business Profile", "Configure Minimum Profit."));
  }

  return issues;
}

export function validateMarketConfiguration(marketPrice?: MarketPrice) {
  if (!marketPrice || !Number.isFinite(marketPrice.price) || marketPrice.price <= 0) {
    return [
      issue(
        "Market Snapshot",
        "Market estimate unavailable.",
        "Missing Data",
      ),
    ];
  }

  return [];
}

export function validateStrategyConfiguration(strategyProfile?: StrategyProfile) {
  const issues: ReadinessIssue[] = [];

  if (!strategyProfile) {
    return [issue("Strategy", "Select a buying strategy before evaluating.")];
  }

  if (!strategyProfile.constraints) {
    issues.push(issue("Strategy", "Required strategy settings are missing."));
  }

  if (Object.keys(strategyProfile.signalWeights).length === 0) {
    issues.push(issue("Strategy", "Strategy signal weights are missing."));
  }

  return issues;
}

