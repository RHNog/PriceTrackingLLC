import {
  conditionProfiles,
  type CardConditionCode,
} from "@/types/conditionProfile";
import type { ConditionMarketSnapshot } from "@/types/conditionMarketSnapshot";
import type { MarketPrice } from "@/types/marketPrice";
import type { MarketIntelligenceEvidence } from "@/types/marketSnapshot";

function roundCurrency(value: number) {
  return Math.round(value * 100) / 100;
}

function createConditionPrice(
  basePrice: MarketPrice,
  conditionCode: CardConditionCode,
): MarketPrice {
  const condition = conditionProfiles.find(
    (profile) => profile.code === conditionCode,
  ) ?? conditionProfiles[0];

  return {
    ...basePrice,
    id: `${basePrice.id}:${condition.code.toLowerCase()}`,
    price: roundCurrency(basePrice.price * condition.marketMultiplier),
    confidence: Math.max(
      0,
      Math.min(100, basePrice.confidence + condition.confidenceAdjustment),
    ),
  };
}

export function createConditionMarketSnapshot(
  basePrice: MarketPrice,
  selectedCondition: CardConditionCode,
  marketIntelligence?: MarketIntelligenceEvidence,
): ConditionMarketSnapshot {
  const pricesByCondition = conditionProfiles.reduce(
    (prices, condition) => ({
      ...prices,
      [condition.code]: createConditionPrice(basePrice, condition.code),
    }),
    {} as ConditionMarketSnapshot["pricesByCondition"],
  );

  return {
    marketIntelligence,
    selectedCondition,
    selectedPrice: pricesByCondition[selectedCondition],
    pricesByCondition,
  };
}
