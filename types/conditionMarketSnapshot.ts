import type { CardConditionCode } from "@/types/conditionProfile";
import type { MarketPrice } from "@/types/marketPrice";

export interface ConditionMarketSnapshot {
  selectedCondition: CardConditionCode;
  selectedPrice: MarketPrice;
  pricesByCondition: Record<CardConditionCode, MarketPrice>;
}
