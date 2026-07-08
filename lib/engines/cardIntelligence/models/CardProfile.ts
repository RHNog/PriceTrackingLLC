import type { Signal } from "@/lib/engines/cardIntelligence/models/Signal";
import type { IntelligenceModel } from "@/lib/intelligence/framework/IntelligenceModel";
import type { Card } from "@/types/card";
import type { ConditionProfile } from "@/types/conditionProfile";
import type { ConditionMarketSnapshot } from "@/types/conditionMarketSnapshot";
import type { MarketContext } from "@/types/MarketContext";
import type { PrintingVariant } from "@/types/printingVariant";

export interface CardProfile {
  identity: {
    id: string;
    name: string;
    game: Card["game"];
  };
  printing: Card;
  variant: PrintingVariant;
  condition: ConditionProfile;
  marketContext: MarketContext;
  marketContextSnapshot: ConditionMarketSnapshot;
  signals: Signal[];
  intelligenceModels: IntelligenceModel[];
  overallConfidence: number;
  generatedAt: string;
}
