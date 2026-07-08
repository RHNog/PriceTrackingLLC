import { createSignals } from "@/lib/engines/cardIntelligence/SignalFactory";
import type { CertificationProfile } from "@/lib/intelligence/certification/CertificationProfile";
import type { PlayabilityProfile } from "@/lib/intelligence/playability/PlayabilityProfile";
import type { Card } from "@/types/card";
import type { ConditionProfile } from "@/types/conditionProfile";
import type { ConditionMarketSnapshot } from "@/types/conditionMarketSnapshot";
import type { MarketContext } from "@/types/MarketContext";
import type { PrintingVariant } from "@/types/printingVariant";

type SignalEngineInput = {
  printing: Card;
  variant: PrintingVariant;
  condition: ConditionProfile;
  marketContext: MarketContext;
  marketContextSnapshot: ConditionMarketSnapshot;
  certificationProfile?: CertificationProfile;
  playabilityProfile?: PlayabilityProfile;
};

export function generateSignals(input: SignalEngineInput) {
  return createSignals(input);
}
