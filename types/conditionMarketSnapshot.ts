import type { CardConditionCode } from "@/types/conditionProfile";
import type { MarketPrice } from "@/types/marketPrice";
import type { MarketIntelligenceEvidence } from "@/types/marketSnapshot";

export interface ConditionMarketSnapshot {
  marketIntelligence?: MarketIntelligenceEvidence;
  selectedCondition: CardConditionCode;
  selectedPrice: MarketPrice;
  pricesByCondition: Record<CardConditionCode, MarketPrice>;
}
