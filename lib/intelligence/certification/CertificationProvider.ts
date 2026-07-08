import type { Card } from "@/types/card";
import type { PrintingVariant } from "@/types/printingVariant";
import type { IndicatorStatus } from "@/lib/intelligence/framework/IndicatorStatus";
import type { CertificationSource } from "@/lib/intelligence/certification/CertificationSource";
import type { CertificationTrend } from "@/lib/intelligence/certification/CertificationTrend";

export type CertificationProviderId = "PSA" | "BGS" | "CGC" | "TAG" | "SGC" | "ARS";

export type CertificationProviderContext = {
  printing: Card;
  variant: PrintingVariant;
};

export interface CertificationProviderSummary {
  providerId: CertificationProviderId;
  providerName: string;
  grade: number;
  confidence: number;
  population: number | null;
  gemPopulation: number | null;
  gemRate: number | null;
  estimatedPremium: number | null;
  trend: CertificationTrend;
  status: IndicatorStatus;
  source: CertificationSource;
  lastUpdated: string;
  explanation: string;
}

export interface CertificationProvider {
  id: string;
  name: string;
  supportedProviders: CertificationProviderId[];
  getCertificationSummary(
    context: CertificationProviderContext,
    providerId: CertificationProviderId,
  ): CertificationProviderSummary | null;
}
