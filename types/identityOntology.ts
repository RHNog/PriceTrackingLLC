import type { CardImageUrls } from "@/types/card";

export type CanonicalEntityType =
  | "GameplayIdentity"
  | "PrintingIdentity"
  | "PhysicalVariantIdentity"
  | "MarketIdentity";

export type IdentityResolutionState =
  | "Explicit"
  | "Derived"
  | "Provider Does Not Supply"
  | "Pending Support"
  | "Unresolved";

export type ProviderAlias = {
  entityType: CanonicalEntityType;
  namespace: string;
  providerId: string;
  value: string;
};

export type IdentityEvidence = {
  confidence: number;
  explanation: string;
  providerField: string;
  providerId: string;
  state: IdentityResolutionState;
};

export type PrintingDesignFacet = {
  evidence: IdentityEvidence;
  value: string;
};

export type PhysicalFinish = {
  evidence: IdentityEvidence;
  value: string;
};

export type GameplayIdentity = {
  aliases: ProviderAlias[];
  gameId: string;
  gameplayAttributes: Record<string, boolean | number | string | null | string[]>;
  gameplayIdentityId: string;
  layout?: string;
  name: string;
  rulesText?: string;
  subtitleOrVersion?: string;
  subtypesOrClassifications: string[];
  types: string[];
};

export type MarketIdentity = {
  aliases: ProviderAlias[];
  confidence: number;
  mappingEvidence: IdentityEvidence[];
  mappingStatus: "Validated" | "Candidate" | "Unresolved";
  marketIdentityId: string;
  marketProviderId: string;
  physicalVariantIdentityId: string;
  providerProductId?: string;
  providerSegmentation?: Record<string, string>;
  providerSkuId?: string;
};

export type PhysicalVariantIdentity = {
  aliases: ProviderAlias[];
  marketIdentities: MarketIdentity[];
  manufacturingProcess?: string;
  physicalFinish: PhysicalFinish;
  physicalVariantIdentityId: string;
  printingIdentityId: string;
};

export type PrintingIdentity = {
  aliases: ProviderAlias[];
  artwork: CardImageUrls;
  artworkIdentityId?: string;
  collectorNumber: string;
  gameplayIdentityId: string;
  illustrators: string[];
  language: string;
  physicalVariants: PhysicalVariantIdentity[];
  printingDesignFacets: PrintingDesignFacet[];
  printingIdentityId: string;
  publicationDate?: string;
  rarity?: string;
  setCode?: string;
  setIdentityId?: string;
  setName: string;
};

export type CanonicalCollectibleIdentity = {
  gameplayIdentity: GameplayIdentity;
  ontologyVersion: "PHR-ARCH-007";
  printingIdentities: PrintingIdentity[];
};

export type MarketObservation = {
  currency: string;
  evidence: Record<string, boolean | number | string | null>;
  liquidity?: number;
  listingCount?: number;
  marketIdentityId: string;
  marketObservationId: string;
  observedAt: string;
  price: number | null;
  salesCount?: number;
};

export type InventoryInstance = {
  acquisition?: Record<string, number | string>;
  alteration?: string;
  certification?: string;
  condition?: string;
  grading?: string;
  inventoryInstanceId: string;
  location?: string;
  personalMetadata?: Record<string, string>;
  physicalVariantIdentityId: string;
  signature?: string;
};

export type OwnershipRelationship = {
  inventoryInstanceId: string;
  ownerId: string;
  ownershipRelationshipId: string;
  startedAt: string;
  status: "Owned" | "Consigned" | "Sold" | "Transferred";
};

export type IdentityOntologyCompleteness = {
  gameplayIdentity: number;
  marketIdentity: number;
  overall: number;
  physicalVariantIdentity: number;
  printingIdentity: number;
};
