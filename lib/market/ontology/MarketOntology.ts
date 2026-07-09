import {
  capabilityRegistry,
  type CapabilityRegistry,
} from "@/lib/market/ontology/CapabilityRegistry";
import { calculateDomainCoverage } from "@/lib/market/ontology/DomainCoverage";
import { EvidenceResolver } from "@/lib/market/ontology/EvidenceResolver";

export class MarketOntology {
  readonly resolver: EvidenceResolver;

  constructor(private readonly registry: CapabilityRegistry = capabilityRegistry) {
    this.resolver = new EvidenceResolver(registry);
  }

  getDomains() {
    return this.registry.getDomains();
  }

  getProviderCapabilityMatrix() {
    return this.registry.getProviders();
  }

  getDomainCoverage() {
    return calculateDomainCoverage(this.registry);
  }

  resolveField(field: Parameters<EvidenceResolver["resolveField"]>[0]) {
    return this.resolver.resolveField(field);
  }
}

export const marketOntology = new MarketOntology();
