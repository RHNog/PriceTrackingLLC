import type { BusinessProfile } from "@/lib/business/BusinessProfileEngine";
import type { CardProfile } from "@/lib/engines/cardIntelligence/models/CardProfile";
import type { MarketPrice } from "@/types/marketPrice";
import type { StrategyProfile } from "@/types/strategyProfile";

export interface EvaluationPrerequisites {
  businessProfile?: BusinessProfile;
  cardProfile?: CardProfile;
  marketPrice?: MarketPrice;
  strategyProfile?: StrategyProfile;
}

