import { generateSignals } from "@/lib/engines/cardIntelligence/SignalEngine";
import type { CardProfile } from "@/lib/engines/cardIntelligence/models/CardProfile";
import { createAssetAssessment } from "@/lib/assessment/AssetAssessmentEngine";
import { createAssetIntelligenceModels } from "@/lib/intelligence/framework/AssetIntelligenceFramework";
import { createCertificationProfile } from "@/lib/intelligence/certification/CertificationEngine";
import { createPlayabilityProfile } from "@/lib/intelligence/playability/PlayabilityEngine";
import type { Card } from "@/types/card";
import type { ConditionProfile } from "@/types/conditionProfile";
import type { ConditionMarketSnapshot } from "@/types/conditionMarketSnapshot";
import type { MarketContext } from "@/types/MarketContext";
import type { PrintingVariant } from "@/types/printingVariant";

type CardIntelligenceInput = {
  printing: Card;
  variant: PrintingVariant;
  condition: ConditionProfile;
  marketContext: MarketContext;
  marketContextSnapshot: ConditionMarketSnapshot;
};

function calculateOverallConfidence(signals: { confidence: number }[]) {
  if (signals.length === 0) {
    return 0;
  }

  const total = signals.reduce((sum, signal) => sum + signal.confidence, 0);

  return Math.round(total / signals.length);
}

export function createCardProfile(input: CardIntelligenceInput): CardProfile {
  const playabilityProfile = createPlayabilityProfile(input.printing);
  const certificationProfile = createCertificationProfile(
    input.printing,
    input.variant,
  );
  const signals = generateSignals({
    ...input,
    certificationProfile,
    playabilityProfile,
  });
  const baseProfile = {
    identity: {
      id: input.printing.name.toLowerCase(),
      name: input.printing.name,
      game: input.printing.game,
    },
    printing: input.printing,
    variant: input.variant,
    condition: input.condition,
    marketContext: input.marketContext,
    marketContextSnapshot: input.marketContextSnapshot,
    signals,
    certificationProfile,
    playabilityProfile,
    intelligenceModels: [],
    overallConfidence: calculateOverallConfidence(signals),
    generatedAt: new Date().toISOString(),
  };
  const preliminaryModels = createAssetIntelligenceModels(baseProfile);
  const assetAssessment = createAssetAssessment({
    ...input,
    certificationProfile,
    intelligenceModels: preliminaryModels,
    playabilityProfile,
    signals,
  });
  const assessedProfile = {
    ...baseProfile,
    assetAssessment,
  };

  return {
    ...assessedProfile,
    intelligenceModels: createAssetIntelligenceModels(assessedProfile),
  };
}
