import type { EvidenceCapability } from "@/lib/market/ontology/EvidenceCapability";
import type { EvidenceDomainId } from "@/lib/market/ontology/EvidenceDomain";

export type MarketProviderConnectionStatus =
  | "CONNECTED"
  | "PLANNED"
  | "NOT_CONNECTED";

export interface ProviderCapability {
  capabilities: EvidenceCapability[];
  connectionStatus: MarketProviderConnectionStatus;
  providerId: string;
  providerName: string;
}

export function getProviderCapabilityForDomain(
  provider: ProviderCapability,
  domainId: EvidenceDomainId,
): EvidenceCapability {
  return (
    provider.capabilities.find((capability) => capability.domainId === domainId) ?? {
      domainId,
      explanation: `${provider.providerName} has not declared whether it can supply this evidence domain.`,
      status: "UNKNOWN",
    }
  );
}
