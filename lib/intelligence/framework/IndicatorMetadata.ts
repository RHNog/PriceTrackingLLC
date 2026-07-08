import type { SignalName } from "@/lib/engines/cardIntelligence/models/Signal";
import type { IndicatorStatus } from "@/lib/intelligence/framework/IndicatorStatus";

export interface IndicatorMetadata {
  id: string;
  name: string;
  signalName?: SignalName;
  version: string;
  status: IndicatorStatus;
  dataSources: string[];
  futureDependencies: string[];
  explanation: string;
}
