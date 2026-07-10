import type {
  CanonicalCollectibleIdentity,
  CanonicalEntityType,
  ProviderAlias,
} from "@/types/identityOntology";

export type IdentityMappingRecord = {
  canonicalEntityId: string;
  canonicalEntityType: CanonicalEntityType;
  confidence: number;
  evidence: string[];
  providerAlias: ProviderAlias;
  status: "Validated" | "Candidate" | "Rejected" | "Unresolved";
  validFrom: string;
  validUntil?: string;
};

function aliasKey(alias: ProviderAlias) {
  return [alias.providerId, alias.namespace, alias.entityType, alias.value].join("::");
}

export class IdentityMappingRepository {
  private readonly mappings = new Map<string, IdentityMappingRecord>();

  register(mapping: IdentityMappingRecord) {
    this.mappings.set(aliasKey(mapping.providerAlias), mapping);
    return mapping;
  }

  resolve(alias: ProviderAlias) {
    const mapping = this.mappings.get(aliasKey(alias));
    return mapping?.status === "Validated" ? mapping : undefined;
  }

  inspect(alias: ProviderAlias) {
    return this.mappings.get(aliasKey(alias));
  }

  registerCollectible(identity: CanonicalCollectibleIdentity) {
    const now = new Date().toISOString();
    identity.gameplayIdentity.aliases.forEach((alias) => this.register({
      canonicalEntityId: identity.gameplayIdentity.gameplayIdentityId,
      canonicalEntityType: "GameplayIdentity",
      confidence: alias.namespace === "oracle" ? 100 : 85,
      evidence: [`Provider supplied ${alias.namespace}.`],
      providerAlias: alias,
      status: "Validated",
      validFrom: now,
    }));
    identity.printingIdentities.forEach((printing) => {
      printing.aliases.forEach((alias) => this.register({
        canonicalEntityId: printing.printingIdentityId,
        canonicalEntityType: "PrintingIdentity",
        confidence: 100,
        evidence: ["Provider print record normalized with set and collector number."],
        providerAlias: alias,
        status: "Validated",
        validFrom: now,
      }));
      printing.physicalVariants.forEach((variant) => {
        variant.aliases.forEach((alias) => this.register({
          canonicalEntityId: variant.physicalVariantIdentityId,
          canonicalEntityType: "PhysicalVariantIdentity",
          confidence: variant.physicalFinish.evidence.confidence,
          evidence: [variant.physicalFinish.evidence.explanation],
          providerAlias: alias,
          status: variant.physicalFinish.evidence.state === "Explicit" ? "Validated" : "Candidate",
          validFrom: now,
        }));
        variant.marketIdentities.forEach((market) => {
          market.aliases.forEach((alias) => this.register({
            canonicalEntityId: market.marketIdentityId,
            canonicalEntityType: "MarketIdentity",
            confidence: market.confidence,
            evidence: market.mappingEvidence.map((evidence) => evidence.explanation),
            providerAlias: alias,
            status: market.mappingStatus,
            validFrom: now,
          }));
        });
      });
    });
  }

  list() {
    return [...this.mappings.values()];
  }
}

export const identityMappingRepository = new IdentityMappingRepository();
