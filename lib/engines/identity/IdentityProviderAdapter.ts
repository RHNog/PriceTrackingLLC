import type { Card } from "@/types/card";
import type { CardIdentity } from "@/types/cardIdentity";
import type { CardConditionCode } from "@/types/conditionProfile";

export type CanonicalIdentityModel = CardIdentity & {
  artwork: Card["imageUrls"];
  canonicalIdentity: string;
  conditionAvailability: CardConditionCode[];
  normalizationSource: string;
  providerConfidence: number;
  providerIdentity: {
    providerId: string;
    providerRecordIds: string[];
  };
};

export interface IdentityProviderAdapter {
  readonly normalizationSource: string;
  normalizeIdentity(identity: CardIdentity, confidence: number): CanonicalIdentityModel;
}

export class CanonicalCardIdentityAdapter implements IdentityProviderAdapter {
  constructor(
    readonly normalizationSource: string,
    private readonly providerId: string,
  ) {}

  normalizeIdentity(identity: CardIdentity, confidence: number): CanonicalIdentityModel {
    const first = identity.printings[0];

    return {
      ...identity,
      artwork: first?.imageUrls ?? (first?.imageUrl ? { normal: first.imageUrl } : undefined),
      canonicalIdentity:
        first?.canonicalIdentity ?? `${identity.game}:${identity.name}`.toLowerCase(),
      conditionAvailability: ["NM", "LP", "MP", "HP", "DMG"],
      normalizationSource: this.normalizationSource,
      providerConfidence: first?.providerConfidence ?? confidence,
      providerIdentity: {
        providerId: first?.providerIdentity?.providerId ?? this.providerId,
        providerRecordIds: identity.printings.map((printing) => printing.id),
      },
    };
  }
}
