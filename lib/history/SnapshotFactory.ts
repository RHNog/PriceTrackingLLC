import { createMarketSnapshotId } from "@/lib/workflow/AssetContextValidator";
import type { ReadyPurchaseEvaluation } from "@/lib/engines/evaluation/evaluatePurchase";
import type { AssetContext } from "@/types/AssetContext";
import type { EvaluationSnapshot } from "@/types/EvaluationSnapshot";
import type { MarketSnapshot } from "@/types/marketSnapshot";
import type { StrategyProfile } from "@/types/strategyProfile";

export type CreateEvaluationSnapshotInput = {
  assetContext: AssetContext;
  evaluation: ReadyPurchaseEvaluation;
  marketSnapshot: MarketSnapshot;
  strategyProfile: StrategyProfile;
  timestamp?: string;
};

export function createEvaluationSnapshot(
  input: CreateEvaluationSnapshotInput,
): EvaluationSnapshot {
  const timestamp = input.timestamp ?? new Date().toISOString();
  const marketSnapshotId = createMarketSnapshotId({
    printingId: input.marketSnapshot.printingId,
    providerId: input.marketSnapshot.providerId,
    updatedAt: input.marketSnapshot.updatedAt,
    variantId: input.marketSnapshot.variantId,
  });

  return {
    id: [
      "evaluation",
      input.assetContext.id,
      input.evaluation.askingPrice,
      timestamp,
    ].join(":"),
    timestamp,
    eventType: "Evaluation Completed",
    asset: {
      assetContextId: input.assetContext.id,
      assetContextGeneration: input.assetContext.generation,
      condition: input.assetContext.condition,
      identity: input.evaluation.cardProfile.identity,
      marketContext: input.evaluation.cardProfile.marketContext,
      printing: {
        finish: input.evaluation.selectedPrinting.finish,
        id: input.evaluation.selectedPrinting.id,
        imageUrl: input.evaluation.selectedPrinting.imageUrl,
        name: input.evaluation.selectedPrinting.name,
        number: input.evaluation.selectedPrinting.number,
        rarity: input.evaluation.selectedPrinting.rarity,
        set: input.evaluation.selectedPrinting.set,
      },
      variant: input.evaluation.selectedVariant,
    },
    cardIntelligenceIndicators: [
      ...input.evaluation.cardProfile.signals,
      ...input.evaluation.cardProfile.intelligenceModels.flatMap(
        (model) => model.indicators,
      ),
    ],
    confidence: input.evaluation.confidence,
    decision: input.evaluation.decision,
    market: {
      confidence: input.evaluation.marketEstimate.confidence,
      currency: input.evaluation.marketEstimate.currency,
      marketSnapshotId,
      price: input.evaluation.marketEstimate.price,
      priceType: input.evaluation.marketEstimate.priceType,
      providerId: input.evaluation.marketEstimate.providerId,
      source: input.evaluation.marketEstimate.source,
      updatedAt: input.evaluation.marketEstimate.updatedAt,
    },
    offerLadder: {
      explanation: input.evaluation.offerLadder.explanation,
      maximumBuyPrice: input.evaluation.offerLadder.maximumBuyPrice,
      offerLadderId: input.assetContext.offerLadderId,
      openingOffer: input.evaluation.offerLadder.openingOffer,
      targetOffer: input.evaluation.offerLadder.targetOffer,
      validationStatus: "READY",
      walkAwayPrice: input.evaluation.offerLadder.walkAwayPrice,
    },
    strategy: {
      constraints: input.strategyProfile.constraints,
      id: input.strategyProfile.id,
      rankingWeights: input.strategyProfile.rankingWeights,
      signalWeights: input.strategyProfile.signalWeights,
    },
  };
}
