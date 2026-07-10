import type { CardImageUrls } from "@/types/card";
import type { IdentityResolutionState } from "@/types/identityOntology";

export type IdentityPresentationField = {
  canonicalConcept: string;
  canonicalValue: string;
  label: string;
  presentationValue: string;
  resolutionState?: IdentityResolutionState;
  visible: boolean;
  visibilityReason: string;
};

export type IdentityPresentationModel = {
  artwork: CardImageUrls;
  cardName: IdentityPresentationField;
  collectorNumber: IdentityPresentationField;
  condition: IdentityPresentationField;
  finish: IdentityPresentationField;
  language: IdentityPresentationField;
  market: IdentityPresentationField;
  printing: IdentityPresentationField;
  treatment: IdentityPresentationField;
};

export type IdentityPresentationInput = {
  artwork?: CardImageUrls;
  cardName: string;
  collectorNumber?: string;
  condition?: string | null;
  language?: string;
  market?: string | null;
  physicalFinish?: import("@/types/identityOntology").PhysicalFinish;
  physicalFinishes?: import("@/types/identityOntology").PhysicalFinish[];
  printingDesignFacets?: import("@/types/identityOntology").PrintingDesignFacet[];
  setName?: string;
};
