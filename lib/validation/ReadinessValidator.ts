import type { CardProfile } from "@/lib/engines/cardIntelligence/models/CardProfile";
import type { ReadinessIssue } from "@/lib/validation/ReadinessReport";

export function validateCardIntelligence(cardProfile?: CardProfile) {
  const issues: ReadinessIssue[] = [];
  const warnings: ReadinessIssue[] = [];

  if (!cardProfile) {
    issues.push({
      component: "Card Intelligence",
      message: "Card Intelligence is waiting for card, condition, and market data.",
      type: "Missing Data",
    });
    return { issues, warnings };
  }

  if (cardProfile.signals.length === 0) {
    issues.push({
      component: "Card Intelligence",
      message: "Required card intelligence indicators are unavailable.",
      type: "Missing Data",
    });
  }

  const playability = cardProfile.playabilityProfile;

  if (playability.overall.availability !== "LIVE") {
    warnings.push({
      component: "Playability",
      message: "Playability data pending.",
      type: "Missing Data",
    });
  }

  return { issues, warnings };
}

