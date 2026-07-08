import {
  calculateBusinessCosts,
  createOfferPolicy,
  type BusinessProfile,
} from "@/lib/business/BusinessProfileEngine";
import type { CardProfile } from "@/lib/engines/cardIntelligence/models/CardProfile";
import { createNegotiationLadder } from "@/lib/engines/negotiation/NegotiationLadderEngine";
import { validateOfferLadder } from "@/lib/engines/negotiation/OfferLadderValidator";
import type { PipelineReport } from "@/lib/pipeline/PipelineReport";
import type { PipelineStage, PipelineStageName } from "@/lib/pipeline/PipelineStage";
import {
  statusFromMissingFields,
  validateRequiredNumber,
  validateRequiredString,
} from "@/lib/pipeline/PipelineValidation";
import type { MarketPrice } from "@/types/marketPrice";
import type { PrintingVariant } from "@/types/printingVariant";
import type { StrategyProfile } from "@/types/strategyProfile";

type PipelineInspectorInput = {
  askingPrice: number;
  businessProfile?: BusinessProfile;
  cardProfile?: CardProfile;
  marketPrice?: MarketPrice;
  selectedVariant?: PrintingVariant;
  strategyProfile?: StrategyProfile;
};

function createStage(input: {
  calculatedOutputs?: Record<string, unknown>;
  executionStartedAt: number;
  fallbacksUsed?: string[];
  missingFields?: string[];
  name: PipelineStageName;
  reason?: string;
  receivedInputs: Record<string, unknown>;
  validationStatus?: PipelineStage["validationStatus"];
}): PipelineStage {
  const missingFields = input.missingFields ?? [];

  return {
    name: input.name,
    receivedInputs: input.receivedInputs,
    calculatedOutputs: input.calculatedOutputs ?? {},
    validationStatus:
      input.validationStatus ?? statusFromMissingFields(missingFields),
    fallbacksUsed: input.fallbacksUsed ?? [],
    missingFields,
    executionTimeMs: Date.now() - input.executionStartedAt,
    reason: input.reason,
  };
}

function firstInvalidStage(stages: PipelineStage[]) {
  return stages.find((stage) => stage.validationStatus !== "READY");
}

function terminatePipeline(stages: PipelineStage[]): PipelineReport {
  const firstInvalid = firstInvalidStage(stages);

  return {
    status: firstInvalid?.validationStatus ?? "INVALID",
    firstInvalidStage: firstInvalid,
    stages,
  };
}

export function inspectEvaluationPipeline(
  input: PipelineInspectorInput,
): PipelineReport {
  const stages: PipelineStage[] = [];
  const assetStartedAt = Date.now();

  stages.push(
    createStage({
      executionStartedAt: assetStartedAt,
      missingFields: [
        !input.cardProfile ? "cardProfile" : "",
        !input.selectedVariant ? "selectedVariant" : "",
      ].filter(Boolean),
      name: "Asset",
      receivedInputs: {
        cardProfileId: input.cardProfile?.identity.id,
        variantId: input.selectedVariant?.id,
      },
    }),
  );

  if (firstInvalidStage(stages)) {
    return terminatePipeline(stages);
  }

  const marketStartedAt = Date.now();
  const marketPrice = input.marketPrice?.price;
  const validMarketPrice: number | null =
    typeof marketPrice === "number" && Number.isFinite(marketPrice) && marketPrice > 0
      ? marketPrice
      : null;
  const hasValidMarketPrice = validMarketPrice !== null;

  stages.push(
    createStage({
      executionStartedAt: marketStartedAt,
      missingFields: hasValidMarketPrice ? [] : ["marketPrice"],
      name: "Market",
      receivedInputs: { marketPrice },
      calculatedOutputs: { marketPrice },
      validationStatus:
        hasValidMarketPrice ? "READY" : "UNAVAILABLE",
      reason: hasValidMarketPrice ? undefined : "Market estimate unavailable.",
    }),
  );

  if (firstInvalidStage(stages)) {
    return terminatePipeline(stages);
  }

  const businessStartedAt = Date.now();
  const businessProfile = input.businessProfile;

  stages.push(
    createStage({
      executionStartedAt: businessStartedAt,
      missingFields: [
        !businessProfile ? "businessProfile" : "",
        !businessProfile?.defaultMarketplace ? "defaultMarketplace" : "",
      ].filter(Boolean),
      name: "Business",
      receivedInputs: { businessProfileId: businessProfile?.id },
      calculatedOutputs: {
        businessProfileName: businessProfile?.name,
        marketplace: businessProfile?.defaultMarketplace,
      },
    }),
  );

  if (firstInvalidStage(stages)) {
    return terminatePipeline(stages);
  }

  const costsStartedAt = Date.now();
  const costs =
    businessProfile && validMarketPrice !== null
      ? calculateBusinessCosts(businessProfile, validMarketPrice)
      : null;

  stages.push(
    createStage({
      executionStartedAt: costsStartedAt,
      missingFields: costs ? [] : ["costProfile"],
      name: "Cost Profile",
      receivedInputs: {
        costProfile: businessProfile?.costProfile,
        marketPrice,
      },
      calculatedOutputs: costs ? { ...costs } : {},
    }),
  );

  if (firstInvalidStage(stages)) {
    return terminatePipeline(stages);
  }

  const policyStartedAt = Date.now();
  const offerPolicy = businessProfile ? createOfferPolicy(businessProfile) : null;
  const policyMissingFields = [
    !validateRequiredNumber(offerPolicy?.minimumProfit) ? "minimumProfit" : "",
    !validateRequiredNumber(offerPolicy?.minimumROI) ? "minimumROI" : "",
    !validateRequiredNumber(offerPolicy?.desiredMargin) ? "desiredMargin" : "",
    !validateRequiredString(offerPolicy?.negotiationAggressiveness)
      ? "negotiationAggressiveness"
      : "",
    !validateRequiredNumber(offerPolicy?.maximumCapitalExposure)
      ? "maximumCapitalExposure"
      : "",
  ].filter(Boolean);

  stages.push(
    createStage({
      executionStartedAt: policyStartedAt,
      missingFields: policyMissingFields,
      name: "Offer Policy",
      receivedInputs: { businessProfileId: businessProfile?.id },
      calculatedOutputs: offerPolicy ? { ...offerPolicy } : {},
    }),
  );

  if (firstInvalidStage(stages)) {
    return terminatePipeline(stages);
  }

  const strategyStartedAt = Date.now();

  stages.push(
    createStage({
      executionStartedAt: strategyStartedAt,
      missingFields: [
        !input.strategyProfile ? "strategyProfile" : "",
        !validateRequiredNumber(input.strategyProfile?.constraints.minimumProfit)
          ? "minimumProfit"
          : "",
        !validateRequiredNumber(input.strategyProfile?.constraints.minimumROI)
          ? "minimumROI"
          : "",
      ].filter(Boolean),
      name: "Strategy",
      receivedInputs: {
        strategyProfileId: input.strategyProfile?.id,
        offerPolicy,
        marketPrice,
        costProfile: businessProfile?.costProfile,
      },
      calculatedOutputs: {
        minimumProfit: input.strategyProfile?.constraints.minimumProfit,
        minimumROI: input.strategyProfile?.constraints.minimumROI,
      },
    }),
  );

  if (firstInvalidStage(stages)) {
    return terminatePipeline(stages);
  }

  const ladderStartedAt = Date.now();
  const ladder =
    input.cardProfile && businessProfile && input.strategyProfile
      ? createNegotiationLadder({
          businessProfile,
          cardProfile: input.cardProfile,
          minimumProfit:
            offerPolicy?.minimumProfit ??
            input.strategyProfile.constraints.minimumProfit,
          offerPolicy,
          strategyProfile: input.strategyProfile,
        })
      : null;
  const recommendedOffer =
    ladder && ladder.maximumBuyPrice > 0
      ? Math.min(ladder.targetOffer, ladder.maximumBuyPrice)
      : null;
  const ladderValidation = validateOfferLadder({
    ladder,
    negotiationMargin:
      ladder && recommendedOffer !== null ? ladder.maximumBuyPrice - input.askingPrice : null,
    recommendedOffer,
  });
  const zeroOfferValue = [
    ["Opening Offer", ladder?.openingOffer],
    ["Target Offer", ladder?.targetOffer],
    ["Maximum Buy Price", ladder?.maximumBuyPrice],
    ["Recommended Offer", recommendedOffer],
  ].find(([, value]) => value === 0);

  stages.push(
    createStage({
      executionStartedAt: ladderStartedAt,
      missingFields: ladder ? [] : ["offerLadder"],
      name: "Offer Ladder",
      receivedInputs: {
        askingPrice: input.askingPrice,
        offerPolicy,
      },
      calculatedOutputs: {
        maximumBuyPrice: ladder?.maximumBuyPrice,
        openingOffer: ladder?.openingOffer,
        recommendedOffer,
        targetOffer: ladder?.targetOffer,
      },
      validationStatus:
        ladderValidation.status === "READY" && !zeroOfferValue
          ? "READY"
          : "INVALID",
      reason:
        ladderValidation.errors[0] ??
        (zeroOfferValue
          ? `${zeroOfferValue[0]} resolved to zero.`
          : undefined),
    }),
  );

  if (firstInvalidStage(stages)) {
    return terminatePipeline(stages);
  }

  const decisionStartedAt = Date.now();

  stages.push(
    createStage({
      executionStartedAt: decisionStartedAt,
      name: "Decision",
      receivedInputs: {
        askingPrice: input.askingPrice,
        maximumBuyPrice: ladder?.maximumBuyPrice,
      },
      calculatedOutputs: {
        decisionReady: true,
      },
    }),
  );

  return { status: "READY", stages };
}
