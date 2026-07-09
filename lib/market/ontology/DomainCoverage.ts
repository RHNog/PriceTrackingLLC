import { capabilityRegistry, type CapabilityRegistry } from "@/lib/market/ontology/CapabilityRegistry";
import type { EvidenceDomainId } from "@/lib/market/ontology/EvidenceDomain";

export interface DomainCoverage {
  connectedProviders: string[];
  domainId: EvidenceDomainId;
  domainName: string;
  partialProviders: string[];
  plannedProviders: string[];
  unsupportedProviders: string[];
}

export function calculateDomainCoverage(
  registry: CapabilityRegistry = capabilityRegistry,
): DomainCoverage[] {
  return registry.getDomains().map((domain) => {
    const providers = registry.getProvidersForDomain(domain.id);

    return {
      connectedProviders: providers
        .filter(
          ({ capability, provider }) =>
            provider.connectionStatus === "CONNECTED" &&
            capability.status === "SUPPORTED",
        )
        .map(({ provider }) => provider.providerName),
      domainId: domain.id,
      domainName: domain.name,
      partialProviders: providers
        .filter(
          ({ capability, provider }) =>
            provider.connectionStatus === "CONNECTED" &&
            capability.status === "PARTIAL",
        )
        .map(({ provider }) => provider.providerName),
      plannedProviders: providers
        .filter(
          ({ capability, provider }) =>
            provider.connectionStatus !== "CONNECTED" &&
            capability.status === "SUPPORTED",
        )
        .map(({ provider }) => provider.providerName),
      unsupportedProviders: providers
        .filter(({ capability }) => capability.status === "UNSUPPORTED")
        .map(({ provider }) => provider.providerName),
    };
  });
}
