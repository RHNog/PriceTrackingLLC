import type { SignalName } from "@/lib/engines/cardIntelligence/models/Signal";
import type { IndicatorStatus } from "@/lib/intelligence/framework/IndicatorStatus";
import type { PlayabilityProfile } from "@/lib/intelligence/playability/PlayabilityProfile";

export interface IndicatorMetadata {
  id: string;
  name: string;
  signalName?: SignalName;
  playabilityIndicatorName?: keyof PlayabilityProfile["indicators"];
  version: string;
  status: IndicatorStatus;
  dataSources: string[];
  futureDependencies: string[];
  explanation: string;
}
