import type { IndicatorStatus } from "@/lib/intelligence/framework/IndicatorStatus";
import type { CertificationSource } from "@/lib/intelligence/certification/CertificationSource";
import type { CertificationTrend } from "@/lib/intelligence/certification/CertificationTrend";

export type CertificationIndicatorName =
  | "certificationGrade"
  | "populationScarcity"
  | "gemRate"
  | "certificationPremium"
  | "populationTrend"
  | "collectorCompetition"
  | "submissionSaturation";

export interface CertificationIndicator {
  name: CertificationIndicatorName;
  label: string;
  score: number;
  confidence: number;
  status: IndicatorStatus;
  source: CertificationSource;
  trend: CertificationTrend;
  lastUpdated: string;
  explanation: string;
}
