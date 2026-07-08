import type { IndicatorStatus } from "@/lib/intelligence/framework/IndicatorStatus";

export interface Indicator {
  id: string;
  name: string;
  score: number;
  confidence: number;
  version: string;
  status: IndicatorStatus;
  dataSources: string[];
  contributingFactors: string[];
  lastUpdated: string;
  explanation: string;
  futureDependencies: string[];
}
