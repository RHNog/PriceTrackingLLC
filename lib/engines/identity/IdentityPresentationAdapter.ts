import type { Card } from "@/types/card";
import type {
  IdentityPresentationInput,
  IdentityPresentationModel,
} from "@/lib/engines/identity/IdentityPresentationModel";
import {
  canonicalFacetValue,
  canonicalFinishValue,
  formatPresentationCondition,
  formatPresentationFinish,
  formatPresentationMarket,
  formatPresentationPrinting,
  formatPresentationTreatment,
  shouldShowPrinting,
  shouldShowTreatment,
} from "@/lib/engines/identity/IdentityPresentationFormatter";

export function adaptIdentityPresentation(
  input: IdentityPresentationInput,
): IdentityPresentationModel {
  const physicalFinishes = input.physicalFinishes ?? [];
  const finishResolution = input.physicalFinish?.evidence.state ??
    physicalFinishes[0]?.evidence.state;
  const treatmentValue = formatPresentationTreatment(input.printingDesignFacets);
  const finishValue = formatPresentationFinish(input.physicalFinish, physicalFinishes);
  return {
    artwork: input.artwork ?? {},
    cardName: {
      canonicalConcept: "GameplayIdentity.name",
      canonicalValue: input.cardName,
      label: "Card Name",
      presentationValue: input.cardName,
      visible: true,
      visibilityReason: "Primary collectible name.",
    },
    collectorNumber: {
      canonicalConcept: "PrintingIdentity.collectorNumber",
      canonicalValue: input.collectorNumber ?? "None",
      label: "Collector Number",
      presentationValue: input.collectorNumber ? `#${input.collectorNumber}` : "No Collector Number",
      visible: true,
      visibilityReason: "Collector number identifies the set printing.",
    },
    condition: {
      canonicalConcept: "InventoryInstance.condition",
      canonicalValue: input.condition ?? "None",
      label: "Condition",
      presentationValue: formatPresentationCondition(input.condition),
      visible: true,
      visibilityReason: "Condition is actionable copy information.",
    },
    finish: {
      canonicalConcept: "PhysicalFinish",
      canonicalValue: canonicalFinishValue(input.physicalFinish, physicalFinishes),
      label: "Printing",
      presentationValue: finishValue,
      resolutionState: finishResolution,
      visible: shouldShowPrinting(finishValue),
      visibilityReason: shouldShowPrinting(finishValue)
        ? "Printing distinguishes the physical collectible."
        : "Regular or provider-unavailable printing is hidden from collector UI.",
    },
    language: {
      canonicalConcept: "PrintingIdentity.language",
      canonicalValue: input.language ?? "None",
      label: "Language",
      presentationValue: input.language || "Language Not Identified",
      visible: true,
      visibilityReason: "Language distinguishes the printing.",
    },
    market: {
      canonicalConcept: "MarketObservation",
      canonicalValue: input.market ?? "None",
      label: "Market",
      presentationValue: formatPresentationMarket(input.market),
      visible: true,
      visibilityReason: "Market is workflow context.",
    },
    printing: {
      canonicalConcept: "PrintingIdentity",
      canonicalValue: formatPresentationPrinting(input.setName, input.collectorNumber),
      label: "Set",
      presentationValue: formatPresentationPrinting(input.setName, input.collectorNumber),
      visible: true,
      visibilityReason: "Set identifies the published printing identity.",
    },
    treatment: {
      canonicalConcept: "PrintingDesignFacet",
      canonicalValue: canonicalFacetValue(input.printingDesignFacets),
      label: "Treatment",
      presentationValue: treatmentValue,
      visible: shouldShowTreatment(treatmentValue),
      visibilityReason: shouldShowTreatment(treatmentValue)
        ? "Treatment distinguishes the published design."
        : "Standard treatment is hidden from collector UI.",
    },
  };
}

export function adaptCardPresentation(
  card: Card,
  options?: { condition?: string | null; market?: string | null },
) {
  return adaptIdentityPresentation({
    artwork: card.imageUrls ?? (card.imageUrl ? { normal: card.imageUrl } : {}),
    cardName: card.name,
    collectorNumber: card.number,
    condition: options?.condition,
    language: card.language,
    market: options?.market,
    physicalFinish: card.physicalFinish,
    physicalFinishes: card.physicalVariants?.map((variant) => variant.physicalFinish),
    printingDesignFacets: card.printingDesignFacets,
    setName: card.set,
  });
}
