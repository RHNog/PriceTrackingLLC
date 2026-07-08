import type { Card } from "@/types/card";
import type { PlayabilityDemandLevel } from "@/lib/intelligence/playability/PlayabilityIndicator";
import type {
  NormalizedPlayabilityProviderResponse,
  PlayabilityDemandDimensions,
  PlayabilityFormatAnalysis,
} from "@/lib/intelligence/playability/PlayabilityDemand";
import { relevanceToDemandLevel } from "@/lib/intelligence/playability/PlayabilityDemand";
import type { PlayabilityRoleSignal } from "@/lib/intelligence/playability/PlayabilityRole";
import type { PlayabilityIndicator } from "@/lib/intelligence/playability/PlayabilityIndicator";

type AdapterInput = {
  card: Card;
  formatIndicators: PlayabilityIndicator[];
  keySignals: string[];
  roles: PlayabilityRoleSignal[];
};

function maxDemand(values: PlayabilityDemandLevel[]): PlayabilityDemandLevel {
  const rank: Record<PlayabilityDemandLevel, number> = {
    High: 4,
    Low: 2,
    Moderate: 3,
    Unknown: 0,
    "Very High": 5,
    "Very Low": 1,
  };

  return values.reduce(
    (highest, value) => (rank[value] > rank[highest] ? value : highest),
    "Unknown",
  );
}

function hasRole(roles: PlayabilityRoleSignal[], role: string) {
  return roles.some((item) => item.role === role);
}

function hasAnyRole(roles: PlayabilityRoleSignal[], values: string[]) {
  return values.some((role) => hasRole(roles, role));
}

function createFormatAnalysis(
  indicator: PlayabilityIndicator,
): PlayabilityFormatAnalysis {
  return {
    casualWeight: indicator.importance,
    competitiveWeight:
      indicator.competitiveRelevance === "Very High"
        ? 100
        : indicator.competitiveRelevance === "High"
          ? 75
          : indicator.competitiveRelevance === "Moderate"
            ? 55
            : indicator.competitiveRelevance === "Low"
              ? 30
              : 10,
    confidence: indicator.confidence,
    demand: indicator.demandLevel,
    evidenceSource: indicator.dataSource,
    format: indicator.format,
    legality: indicator.status,
    providerStatus: indicator.availability,
    trend: indicator.trend,
  };
}

function createDemandDimensions(
  formatIndicators: PlayabilityIndicator[],
  roles: PlayabilityRoleSignal[],
): PlayabilityDemandDimensions {
  const commander = formatIndicators.find(
    (indicator) => indicator.format === "Commander",
  );
  const competitiveDemand = maxDemand(
    formatIndicators
      .filter((indicator) => indicator.format !== "Commander")
      .map((indicator) => relevanceToDemandLevel(indicator.competitiveRelevance)),
  );
  const casualDemand = maxDemand(
    formatIndicators.map((indicator) =>
      relevanceToDemandLevel(indicator.casualRelevance),
    ),
  );
  const legalFormatCount = formatIndicators.filter(
    (indicator) =>
      indicator.status === "Legal" || indicator.status === "Restricted",
  ).length;
  const comboRelevance = hasRole(roles, "Combo Piece")
    ? "High"
    : hasRole(roles, "Engine")
      ? "Moderate"
      : "Low";
  const stapleStatus =
    hasAnyRole(roles, ["Commander Staple", "Competitive Staple", "Fast Mana"])
      ? "Very High"
      : hasAnyRole(roles, ["Removal", "Counterspell", "Artifact Synergy"])
        ? "High"
        : "Moderate";

  return {
    banRisk: formatIndicators.some((indicator) => indicator.status === "Banned")
      ? "Moderate"
      : "Low",
    casualDemand,
    comboRelevance,
    commanderDemand: commander?.demandLevel ?? "Unknown",
    competitiveDemand,
    demandResilience: legalFormatCount >= 4 ? "High" : "Moderate",
    demandStability: formatIndicators.some(
      (indicator) => indicator.trend === "Declining",
    )
      ? "Low"
      : "High",
    formatDiversity:
      legalFormatCount >= 5
        ? "Very High"
        : legalFormatCount >= 3
          ? "High"
          : legalFormatCount >= 1
            ? "Moderate"
            : "Very Low",
    futureDemandReadiness: "Moderate",
    metaDependency:
      competitiveDemand === "Very High" || competitiveDemand === "High"
        ? "High"
        : "Low",
    stapleStatus,
  };
}

export class PlaceholderPlayabilityProviderAdapter {
  readonly id = "placeholder-playability-provider-adapter";
  readonly name = "Placeholder Playability Provider Adapter";

  normalize(input: AdapterInput): NormalizedPlayabilityProviderResponse {
    return {
      cardName: input.card.name,
      demandDimensions: createDemandDimensions(
        input.formatIndicators,
        input.roles,
      ),
      formatAnalysis: Object.fromEntries(
        input.formatIndicators.map((indicator) => [
          indicator.format,
          createFormatAnalysis(indicator),
        ]),
      ),
      keySignals: input.keySignals,
      providerStatus: "PLACEHOLDER",
      roleSignals: input.roles.map((role) => ({
        confidence: role.confidence,
        explanation: role.explanation,
        role: role.role,
      })),
    };
  }
}
