import type { Card } from "@/types/card";
import type { CardIdentity } from "@/types/cardIdentity";
import type { CardConditionCode } from "@/types/conditionProfile";
import type { IdentityCompleteness, IdentityMappingAudit } from "@/types/identityCompleteness";
import type { IdentityTreatment } from "@/types/identityTreatment";
import { calculateIdentityCompleteness } from "@/lib/engines/identity/IdentityCompleteness";
import { resolveCanonicalTreatment } from "@/lib/engines/identity/IdentityTreatmentResolver";
import type {
  CanonicalCollectibleIdentity,
  IdentityOntologyCompleteness,
  MarketIdentity,
  PhysicalFinish,
  PhysicalVariantIdentity,
  PrintingDesignFacet,
  PrintingIdentity,
} from "@/types/identityOntology";
import {
  buildCanonicalCollectible,
  calculateOntologyCompleteness,
} from "@/lib/engines/identity/IdentityOntology";

export type CanonicalIdentityModel = CardIdentity & CanonicalCollectibleIdentity & {
  artwork: Card["imageUrls"];
  canonicalIdentity: string;
  cardType: string[];
  collectorNumber?: string;
  completeness: IdentityCompleteness;
  conditionAvailability: CardConditionCode[];
  normalizationSource: string;
  language?: string;
  mappingAudit: IdentityMappingAudit;
  marketIdentities: MarketIdentity[];
  ontologyCompleteness: IdentityOntologyCompleteness;
  physicalFinish: PhysicalFinish;
  physicalVariants: PhysicalVariantIdentity[];
  printingDesignFacets: PrintingDesignFacet[];
  printingIdentity: PrintingIdentity;
  printing?: string;
  providerConfidence: number;
  providerIdentity: {
    providerId: string;
    providerRecordIds: string[];
  };
  rarity?: string;
  set?: string;
  setCode?: string;
  subtitle?: string;
  tcgplayerId?: number;
  treatment: IdentityTreatment;
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
    const ontology = buildCanonicalCollectible(identity.printings);
    const printingIdentity = ontology.printingIdentities[0];
    const physicalVariants = ontology.printingIdentities.flatMap(
      (printing) => printing.physicalVariants,
    );
    const marketIdentities = physicalVariants.flatMap(
      (variant) => variant.marketIdentities,
    );
    const physicalFinish = printingIdentity?.physicalVariants[0]?.physicalFinish ?? {
      evidence: {
        confidence: 0,
        explanation: "No physical variant is available.",
        providerField: "none",
        providerId: this.providerId,
        state: "Pending Support" as const,
      },
      value: "Pending Support",
    };
    const compatibilityPrintings = identity.printings.map((card, index) => {
      const canonicalPrinting = ontology.printingIdentities[index];
      return {
        ...card,
        gameplayIdentity: ontology.gameplayIdentity,
        gameplayIdentityId: ontology.gameplayIdentity.gameplayIdentityId,
        marketIdentities: canonicalPrinting?.physicalVariants.flatMap(
          (variant) => variant.marketIdentities,
        ) ?? [],
        physicalFinish: canonicalPrinting?.physicalVariants[0]?.physicalFinish,
        physicalVariants: canonicalPrinting?.physicalVariants ?? [],
        printingDesignFacets: canonicalPrinting?.printingDesignFacets ?? [],
        printingIdentity: canonicalPrinting,
      };
    });
    const treatment = resolveCanonicalTreatment(first);
    const completeness = calculateIdentityCompleteness(
      identity.printings.map((printing) => ({
        ...printing,
        treatmentDetails: printing.treatmentDetails ?? resolveCanonicalTreatment(printing),
      })),
    );
    const mappingAudit = first?.identityMappingAudit ?? {
      canonicalFields: [
        "game", "name", "subtitle", "printing", "collectorNumber", "set",
        "setCode", "language", "artwork", "rarity", "treatment", "cardType",
        "providerIdentity", "canonicalIdentity", "providerConfidence", "tcgplayerId",
      ],
      derivedFields: ["canonicalIdentity", "treatment", "completeness"],
      ignoredFields: [],
      mappedFields: ["name", "printing", "collectorNumber", "artwork"],
      treatmentSource: treatment.source,
    };

    return {
      ...identity,
      ...ontology,
      printings: compatibilityPrintings,
      artwork: first?.imageUrls ?? (first?.imageUrl ? { normal: first.imageUrl } : undefined),
      canonicalIdentity: ontology.gameplayIdentity.gameplayIdentityId,
      cardType: first?.cardTypes ?? [],
      collectorNumber: first?.number,
      completeness,
      conditionAvailability: ["NM", "LP", "MP", "HP", "DMG"],
      normalizationSource: this.normalizationSource,
      language: first?.language,
      mappingAudit,
      marketIdentities,
      ontologyCompleteness: calculateOntologyCompleteness(ontology),
      physicalFinish,
      physicalVariants,
      printing: first?.set,
      printingDesignFacets: printingIdentity?.printingDesignFacets ?? [],
      printingIdentity,
      providerConfidence: first?.providerConfidence ?? confidence,
      providerIdentity: {
        providerId: first?.providerIdentity?.providerId ?? this.providerId,
        providerRecordIds: identity.printings.map((printing) => printing.id),
      },
      rarity: first?.rarity,
      set: first?.set,
      setCode: first?.setCode,
      subtitle: first?.subtitle ?? first?.version,
      tcgplayerId: first?.tcgplayerId,
      treatment,
    };
  }
}
