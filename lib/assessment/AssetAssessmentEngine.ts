import type { Signal } from "@/lib/engines/cardIntelligence/models/Signal";
import type { CertificationProfile } from "@/lib/intelligence/certification/CertificationProfile";
import type { IntelligenceModel } from "@/lib/intelligence/framework/IntelligenceModel";
import type { PlayabilityProfile } from "@/lib/intelligence/playability/PlayabilityProfile";
import { knowledgeGraphRegistry } from "@/lib/knowledge/KnowledgeGraphRegistry";
import type { AssetAssessment } from "@/lib/assessment/AssetAssessment";
import {
  getAssessmentConfidence,
  type AssessmentConfidence,
} from "@/lib/assessment/AssessmentConfidence";
import type { AssessmentEvidence } from "@/lib/assessment/AssessmentEvidence";
import { assessmentRegistry } from "@/lib/assessment/AssessmentRegistry";
import type { Card } from "@/types/card";
import type { ConditionProfile } from "@/types/conditionProfile";
import type { ConditionMarketSnapshot } from "@/types/conditionMarketSnapshot";
import type { MarketContext } from "@/types/MarketContext";
import type { PrintingVariant } from "@/types/printingVariant";

export interface AssetAssessmentInput {
  certificationProfile: CertificationProfile;
  condition: ConditionProfile;
  intelligenceModels: IntelligenceModel[];
  marketContext: MarketContext;
  marketContextSnapshot: ConditionMarketSnapshot;
  playabilityProfile: PlayabilityProfile;
  printing: Card;
  signals: Signal[];
  variant: PrintingVariant;
}

function clampScore(score: number) {
  return Math.min(100, Math.max(0, Math.round(score)));
}

function findSignal(input: AssetAssessmentInput, name: string) {
  return input.signals.find((signal) => signal.name === name);
}

function findModel(input: AssetAssessmentInput, modelId: string) {
  return input.intelligenceModels.find((model) => model.id === modelId);
}

function evidenceStatus(confidence: number) {
  return confidence > 0 ? "Available" as const : "Unknown" as const;
}

function createEvidence(input: AssetAssessmentInput): AssessmentEvidence[] {
  const graph = knowledgeGraphRegistry.resolve(input.printing);
  const knowledgeRoles = graph.labelsByKind("Role");
  const premiumPrintings = graph.labelsByKind("Premium Printing");
  const reservedList = graph.labelsByKind("Reserved List").length > 0;
  const collectorSignal = findSignal(input, "CollectorAppeal");
  const investmentSignal = findSignal(input, "InvestmentPotential");
  const liquiditySignal = findSignal(input, "Liquidity");
  const marketSignal = findSignal(input, "MarketConfidence");
  const playabilityModel = findModel(input, "playability-intelligence");
  const certificationModel = findModel(input, "certification-intelligence");
  const insufficientModels = input.intelligenceModels.filter(
    (model) => model.evidenceReport.status === "INSUFFICIENT",
  );
  const totalModels = Math.max(1, input.intelligenceModels.length);
  const evidenceCoverage = clampScore(
    ((totalModels - insufficientModels.length) / totalModels) * 100,
  );

  return assessmentRegistry.map((source) => {
    if (source.kind === "Knowledge Graph") {
      const graphScore = clampScore(
        50 +
          Math.min(25, knowledgeRoles.length * 4) +
          (reservedList ? 12 : 0) +
          Math.min(12, premiumPrintings.length * 6),
      );

      return {
        confidence: graph.edges.length > 0 ? 82 : 20,
        driver: [
          reservedList ? "Reserved List" : "",
          ...knowledgeRoles.slice(0, 3),
          ...premiumPrintings.slice(0, 1),
        ].filter(Boolean).join(", ") || "Semantic relationships",
        explanation: "Knowledge Graph relationships identify semantic demand and collector context.",
        kind: source.kind,
        score: graphScore,
        source: source.label,
        status: evidenceStatus(graph.edges.length > 0 ? 82 : 0),
        weight: source.weight,
      };
    }

    if (source.kind === "Playability") {
      const confidence = playabilityModel?.confidence ?? input.playabilityProfile.overall.confidence;

      return {
        confidence,
        driver: input.playabilityProfile.keySignals[0] ?? "Playability Unknown",
        explanation: input.playabilityProfile.businessConclusion,
        kind: source.kind,
        score: input.playabilityProfile.overall.score,
        source: source.label,
        status: evidenceStatus(confidence),
        weight: source.weight,
      };
    }

    if (source.kind === "Certification") {
      const confidence = certificationModel?.confidence ?? input.certificationProfile.overallConfidence;

      return {
        confidence,
        driver:
          confidence > 0
            ? `Certification ${input.certificationProfile.tier}`
            : "Certification Unknown",
        explanation: input.certificationProfile.explanation,
        kind: source.kind,
        score: input.certificationProfile.overallGrade,
        source: source.label,
        status: evidenceStatus(confidence),
        weight: source.weight,
      };
    }

    if (source.kind === "Collector") {
      return {
        confidence: collectorSignal?.confidence ?? 0,
        driver: "Collector Premium",
        explanation: collectorSignal?.explanation ?? "Collector evidence is not available.",
        kind: source.kind,
        score: collectorSignal?.score ?? 0,
        source: source.label,
        status: evidenceStatus(collectorSignal?.confidence ?? 0),
        weight: source.weight,
      };
    }

    if (source.kind === "Investment") {
      return {
        confidence: investmentSignal?.confidence ?? 0,
        driver: "Long-Term Potential",
        explanation: investmentSignal?.explanation ?? "Investment evidence is not available.",
        kind: source.kind,
        score: investmentSignal?.score ?? 0,
        source: source.label,
        status: evidenceStatus(investmentSignal?.confidence ?? 0),
        weight: source.weight,
      };
    }

    if (source.kind === "Market") {
      return {
        confidence: marketSignal?.confidence ?? input.marketContextSnapshot.selectedPrice.confidence,
        driver: "Market Confidence",
        explanation: marketSignal?.explanation ?? "Market evidence comes from the normalized market estimate.",
        kind: source.kind,
        score: marketSignal?.score ?? input.marketContextSnapshot.selectedPrice.confidence,
        source: source.label,
        status: evidenceStatus(marketSignal?.confidence ?? input.marketContextSnapshot.selectedPrice.confidence),
        weight: source.weight,
      };
    }

    if (source.kind === "Liquidity") {
      return {
        confidence: liquiditySignal?.confidence ?? 0,
        driver:
          (liquiditySignal?.score ?? 0) >= 70
            ? "Strong Market Liquidity"
            : "Low Liquidity",
        explanation: liquiditySignal?.explanation ?? "Liquidity evidence is not available.",
        kind: source.kind,
        score: liquiditySignal?.score ?? 0,
        source: source.label,
        status: evidenceStatus(liquiditySignal?.confidence ?? 0),
        weight: source.weight,
      };
    }

    if (source.kind === "Business Context") {
      const contextScore = input.condition.code === "NM" ? 85 : input.condition.code === "LP" ? 70 : 45;

      return {
        confidence: 80,
        driver: `${input.condition.label} ${input.variant.finish}`,
        explanation: `${input.marketContext.marketplace} context with ${input.condition.label} condition and ${input.variant.finish} finish.`,
        kind: source.kind,
        score: contextScore,
        source: source.label,
        status: "Available",
        weight: source.weight,
      };
    }

    return {
      confidence: evidenceCoverage,
      driver: `${evidenceCoverage}% Evidence Coverage`,
      explanation:
        insufficientModels.length > 0
          ? "Some intelligence models have insufficient required evidence."
          : "Registered intelligence evidence is sufficient for current assessment.",
      kind: source.kind,
      score: evidenceCoverage,
      source: source.label,
      status: "Available",
      weight: source.weight,
    };
  });
}

function calculateOverallScore(evidence: AssessmentEvidence[]) {
  const available = evidence.filter((item) => item.status === "Available");
  const totalWeight = available.reduce((sum, item) => sum + item.weight, 0);

  if (totalWeight === 0) {
    return 0;
  }

  return clampScore(
    available.reduce((sum, item) => sum + item.score * item.weight, 0) /
      totalWeight,
  );
}

function calculateConfidence(evidence: AssessmentEvidence[]): AssessmentConfidence {
  const totalWeight = evidence.reduce((sum, item) => sum + item.weight, 0);
  const weightedConfidence = evidence.reduce(
    (sum, item) => sum + item.confidence * item.weight,
    0,
  );
  const score = clampScore(weightedConfidence / Math.max(0.01, totalWeight));
  const unknownCount = evidence.filter((item) => item.status === "Unknown").length;
  const adjustedScore = clampScore(score - unknownCount * 5);
  const label = getAssessmentConfidence(adjustedScore);

  return {
    label,
    reason:
      unknownCount > 0
        ? "Unknown evidence reduces confidence but does not reduce the asset quality assessment."
        : "Confidence is based on currently available evidence quality.",
    score: adjustedScore,
  };
}

function getOverallAssessment(score: number) {
  if (score >= 80) {
    return "Excellent";
  }

  if (score >= 65) {
    return "Strong";
  }

  if (score >= 45) {
    return "Mixed";
  }

  if (score > 0) {
    return "Limited";
  }

  return "Unknown";
}

function getPrimaryDrivers(evidence: AssessmentEvidence[]) {
  return evidence
    .filter((item) => item.status === "Available")
    .sort(
      (first, second) =>
        second.score * second.confidence * second.weight -
        first.score * first.confidence * first.weight,
    )
    .map((item) => item.driver)
    .filter(Boolean)
    .slice(0, 4);
}

function getRiskFactors(input: AssetAssessmentInput, evidence: AssessmentEvidence[]) {
  const riskFactors = new Set<string>();
  const reprintRisk = findSignal(input, "ReprintRisk")?.score ?? 0;
  const volatility = findSignal(input, "Volatility")?.score ?? 0;
  const liquidity = findSignal(input, "Liquidity")?.score ?? 0;

  if (reprintRisk >= 65) {
    riskFactors.add("High Reprint Risk");
  }

  if (volatility >= 65) {
    riskFactors.add("Market Volatility");
  }

  if (liquidity > 0 && liquidity < 60) {
    riskFactors.add("Low Liquidity");
  }

  if (evidence.some((item) => item.status === "Unknown")) {
    riskFactors.add("Weak Evidence");
  }

  if ((findModel(input, "certification-intelligence")?.evidenceReport.status) === "INSUFFICIENT") {
    riskFactors.add("Certification Unknown");
  }

  if ((findModel(input, "playability-intelligence")?.evidenceReport.status) === "INSUFFICIENT") {
    riskFactors.add("Playability Unknown");
  }

  return Array.from(riskFactors).slice(0, 6);
}

function getBusinessSummary(input: AssetAssessmentInput, primaryDrivers: string[], riskFactors: string[]) {
  const driverText =
    primaryDrivers.length > 0
      ? primaryDrivers.slice(0, 2).join(" and ")
      : "available asset evidence";
  const riskText =
    riskFactors.length > 0
      ? ` Current risks include ${riskFactors.slice(0, 2).join(" and ").toLowerCase()}.`
      : "";

  return `${input.printing.name} derives its value primarily from ${driverText}.${riskText}`;
}

export function createAssetAssessment(input: AssetAssessmentInput): AssetAssessment {
  const evidence = createEvidence(input);
  const overallScore = calculateOverallScore(evidence);
  const confidence = calculateConfidence(evidence);
  const primaryDrivers = getPrimaryDrivers(evidence);
  const supportingDrivers = evidence
    .filter((item) => !primaryDrivers.includes(item.driver))
    .map((item) => item.driver)
    .filter(Boolean)
    .slice(0, 4);
  const riskFactors = getRiskFactors(input, evidence);
  const opportunityFactors = evidence
    .filter((item) => item.status === "Available" && item.score >= 70)
    .map((item) => item.driver)
    .filter(Boolean)
    .slice(0, 5);
  const evidenceCoverage = clampScore(
    (evidence.filter((item) => item.status === "Available").length /
      Math.max(1, evidence.length)) *
      100,
  );
  const overallAssessment = getOverallAssessment(overallScore);
  const businessSummary = getBusinessSummary(input, primaryDrivers, riskFactors);

  return {
    modelId: "asset-assessment",
    modelName: "Asset Assessment",
    version: "1.0.0",
    overallScore,
    overallAssessment,
    confidence,
    evidence,
    evidenceCoverage,
    primaryDrivers,
    supportingDrivers,
    riskFactors,
    opportunityFactors,
    businessSummary,
    reasoning: {
      evidenceCoverage,
      opportunityFactors,
      primaryDrivers,
      riskFactors,
      supportingDrivers,
    },
    summary: {
      businessSummary,
      overallAssessment,
    },
    dependencyGraph: [
      "Intelligence Models",
      "Evidence Sufficiency",
      "Asset Knowledge Graph",
      "Asset Assessment Engine",
      "Business Profile",
      "Strategy",
      "Negotiation Ladder",
      "Decision Resolver",
    ],
    generatedAt: new Date().toISOString(),
  };
}
