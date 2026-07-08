import type { Signal } from "@/lib/engines/cardIntelligence/models/Signal";
import type { SignalName } from "@/lib/engines/cardIntelligence/models/Signal";
import type { AssetAssessment } from "@/lib/assessment/AssetAssessment";
import type { StrategyProfile } from "@/types/strategyProfile";

const assessmentEvidenceBySignal: Partial<Record<SignalName, string[]>> = {
  CollectorAppeal: ["Collector", "Certification", "Knowledge Graph"],
  Demand: ["Playability", "Market"],
  InvestmentPotential: ["Investment"],
  Liquidity: ["Liquidity"],
  MarketConfidence: ["Market"],
  Playability: ["Playability"],
  ReprintRisk: ["Evidence Sufficiency", "Knowledge Graph"],
  Scarcity: ["Knowledge Graph", "Certification", "Collector"],
};

function getAssessmentScoreForSignal(
  assessment: AssetAssessment,
  signalName: SignalName,
) {
  const evidenceKinds = assessmentEvidenceBySignal[signalName] ?? [];
  const evidence = assessment.evidence.filter((item) =>
    evidenceKinds.includes(item.kind),
  );

  if (evidence.length === 0) {
    return assessment.overallScore;
  }

  const totalWeight = evidence.reduce((sum, item) => sum + item.weight, 0);

  return Math.round(
    evidence.reduce((sum, item) => sum + item.score * item.weight, 0) /
      Math.max(0.01, totalWeight),
  );
}

export function calculateAssessmentStrategyScore(
  strategyProfile: StrategyProfile,
  assessment: AssetAssessment,
) {
  const weightedSignals = Object.entries(strategyProfile.signalWeights)
    .map(([signalName, weight]) => ({
      score: getAssessmentScoreForSignal(assessment, signalName as SignalName),
      weight: weight ?? 0,
    }))
    .filter((item) => item.weight > 0);

  if (weightedSignals.length === 0) {
    return 0;
  }

  const totalWeight = weightedSignals.reduce(
    (sum, item) => sum + item.weight,
    0,
  );
  const weightedScore = weightedSignals.reduce(
    (sum, item) => sum + item.score * item.weight,
    0,
  );

  return Math.round(weightedScore / totalWeight);
}

export function calculateSignalStrategyScore(
  strategyProfile: StrategyProfile,
  signals: Signal[],
  assessment?: AssetAssessment,
) {
  if (assessment) {
    return calculateAssessmentStrategyScore(strategyProfile, assessment);
  }

  const weightedSignals = signals
    .map((signal) => ({
      signal,
      weight: strategyProfile.signalWeights[signal.name] ?? 0,
    }))
    .filter((item) => item.weight > 0);

  if (weightedSignals.length === 0) {
    return 0;
  }

  const totalWeight = weightedSignals.reduce(
    (sum, item) => sum + item.weight,
    0,
  );
  const weightedScore = weightedSignals.reduce(
    (sum, item) => sum + item.signal.score * item.weight,
    0,
  );

  return Math.round(weightedScore / totalWeight);
}
