import type { CertificationIndicator } from "@/lib/intelligence/certification/CertificationIndicator";
import type {
  CertificationProviderId,
  CertificationProviderSummary,
} from "@/lib/intelligence/certification/CertificationProvider";

export type CertificationTier = "Excellent" | "High" | "Medium" | "Low";

export interface FutureCertificationProviderStatus {
  providerId: CertificationProviderId;
  providerName: string;
  status: "Future Provider";
}

export interface CertificationProfile {
  modelId: "certification-intelligence";
  modelName: "Certification Intelligence";
  version: string;
  overallGrade: number;
  overallConfidence: number;
  tier: CertificationTier;
  providers: CertificationProviderSummary[];
  futureProviders: FutureCertificationProviderStatus[];
  indicators: Record<CertificationIndicator["name"], CertificationIndicator>;
  explanation: string;
  providerRoadmap: CertificationProviderId[];
  dependencyGraph: string[];
  generatedAt: string;
}
