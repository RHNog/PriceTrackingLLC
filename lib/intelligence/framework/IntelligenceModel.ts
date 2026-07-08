import type { Indicator } from "@/lib/intelligence/framework/Indicator";
import type { IndicatorStatus } from "@/lib/intelligence/framework/IndicatorStatus";

export type IntelligenceModelHealth =
  | "Healthy"
  | "Partial"
  | "Missing Data"
  | "Unavailable"
  | "Deprecated"
  | "Experimental";

export interface IntelligenceModel {
  id: string;
  name: string;
  version: string;
  status: IndicatorStatus;
  confidence: number;
  lastUpdated: string;
  inputs: string[];
  outputs: string[];
  indicators: Indicator[];
  supportingSources: string[];
  health: IntelligenceModelHealth;
  explanation: string;
  dependencyGraph: string[];
}
