import type { Card } from "@/types/card";
import type { IdentityTreatment } from "@/types/identityTreatment";
import type { PrintingVariant } from "@/types/printingVariant";

function normalizeFinishTreatment(value: string) {
  const normalized = value.trim().toLowerCase();
  if (normalized === "nonfoil" || normalized === "normal") return "Normal";
  return value;
}

export function treatmentFromFinish(finish: string): IdentityTreatment {
  return {
    confidence: 95,
    explanation: "Treatment is represented by explicit provider finish availability.",
    source: "finish availability",
    state: "Explicit",
    value: normalizeFinishTreatment(finish),
  };
}

export function resolveCanonicalTreatment(card?: Card): IdentityTreatment {
  if (card?.treatmentDetails) return card.treatmentDetails;
  if (card?.treatment) {
    return {
      confidence: 95,
      explanation: "Provider normalization supplied a collectible treatment.",
      source: "normalized treatment",
      state: "Explicit",
      value: card.treatment,
    };
  }
  const finishes = (card?.availableFinishes ?? [card?.finish ?? ""])
    .filter((finish) => finish && finish.toLowerCase() !== "unknown")
    .map(normalizeFinishTreatment);
  if (finishes.length > 0) {
    return {
      confidence: 95,
      explanation: "Treatment is represented by explicit provider finish availability.",
      source: "finish availability",
      state: "Explicit",
      value: [...new Set(finishes)].join(" / "),
    };
  }
  return {
    confidence: 0,
    explanation: "No reliable treatment evidence is available.",
    source: "none",
    state: "Unknown",
    value: "Unknown",
  };
}

export function resolveTreatmentDisplay(card: Card) {
  return resolvePrintingDesignDisplay(card);
}

export function resolvePrintingDesignDisplay(card: Card) {
  const facets = card.printingDesignFacets?.map((facet) => facet.value) ?? [];
  if (facets.length > 0) return facets.join(" / ");
  return card.treatment || "Standard";
}

export function resolvePhysicalFinishDisplay(card: Card) {
  if (card.physicalFinish) return card.physicalFinish.value;
  const variants = card.physicalVariants ?? [];
  if (variants.length > 0) {
    return [...new Set(variants.map((variant) => variant.physicalFinish.value))].join(" / ");
  }
  return resolveCanonicalTreatment(card).value;
}

export function resolveVariantPhysicalFinish(variant: PrintingVariant) {
  return variant.physicalFinish?.value ?? variant.finish;
}
