import type { Card } from "@/types/card";
import type { LorcastCard } from "@/lib/providers/lorcast/LorcastTypes";
import type { IdentityTreatment } from "@/types/identityTreatment";
import { lorcastIdentityMappingAudit } from "@/lib/providers/lorcast/LorcastDiagnostics";
import type { PrintingDesignFacet } from "@/types/identityOntology";
import {
  createCanonicalId,
  createMarketIdentity,
  printingFacet,
  providerAlias,
  unavailablePhysicalFinish,
} from "@/lib/engines/identity/IdentityOntology";

const languageNames: Record<string, string> = {
  de: "German",
  en: "English",
  es: "Spanish",
  fr: "French",
  it: "Italian",
  ja: "Japanese",
};

function normalizeRarity(rarity?: string) {
  if (!rarity) return "Unknown";
  return rarity.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function deriveLorcastTreatment(rarity?: string): IdentityTreatment {
  if (!rarity) {
    return {
      confidence: 0,
      explanation: "Lorcast did not supply a printing design facet.",
      source: "none",
      state: "Unknown",
      value: "Unknown",
    };
  }

  const normalized = rarity.trim().toLowerCase().replaceAll("_", " ");
  const specialTreatments: Record<string, string> = {
    enchanted: "Enchanted",
    iconic: "Iconic",
    promo: "Promo",
  };
  const value = specialTreatments[normalized] ?? "Standard";

  return {
    confidence: specialTreatments[normalized] ? 100 : 90,
    explanation: specialTreatments[normalized]
      ? `${value} is a compatibility projection of the Lorcast printing rarity, not a physical finish.`
      : `Standard is a compatibility projection for a base Lorcast printing; it is not physical-finish evidence.`,
    source: "rarity",
    state: "Derived",
    value,
  };
}

export function deriveLorcastPrintingDesignFacets(rarity?: string): PrintingDesignFacet[] {
  if (!rarity) return [];
  const normalized = rarity.trim().toLowerCase().replaceAll("_", " ");
  const facets: Record<string, string> = {
    enchanted: "Enchanted",
    iconic: "Iconic",
    promo: "Promo",
  };
  const value = facets[normalized];
  return value ? [printingFacet(value, "lorcast", "rarity")] : [];
}

export function normalizeLorcastCard(raw: LorcastCard): Card | null {
  if (!raw.id || !raw.name || !raw.set?.name || !raw.collector_number) return null;

  const imageUrls = {
    large: raw.image_uris?.digital?.large,
    normal: raw.image_uris?.digital?.normal,
    small: raw.image_uris?.digital?.small,
  };
  const cardTypes = [...(raw.type ?? []), ...(raw.classifications ?? [])];
  const gameplayIdentityId = createCanonicalId(
    "gameplay",
    "lorcana",
    raw.name,
    raw.version,
    raw.text,
    raw.cost,
    raw.ink ?? undefined,
  );
  const canonicalIdentity = gameplayIdentityId;
  const treatmentDetails = deriveLorcastTreatment(raw.rarity);
  const printingDesignFacets = deriveLorcastPrintingDesignFacets(raw.rarity);
  const printingIdentityId = createCanonicalId("printing", "lorcast", raw.id);
  const physicalFinish = unavailablePhysicalFinish("lorcast");
  const physicalVariantIdentityId = createCanonicalId(
    "physical",
    printingIdentityId,
    physicalFinish.value,
  );
  const marketIdentities = raw.tcgplayer_id === undefined ? [] : [createMarketIdentity({
    physicalVariantIdentityId,
    providerId: "tcgplayer",
    providerProductId: raw.tcgplayer_id,
  })];
  const physicalVariants = [{
    aliases: [],
    marketIdentities,
    physicalFinish,
    physicalVariantIdentityId,
    printingIdentityId,
  }];

  return {
    availableFinishes: ["Unknown"],
    canonicalIdentity,
    cardTypes,
    classifications: raw.classifications ?? [],
    finish: "Unknown",
    game: "Lorcana",
    id: raw.id,
    imageFace: "single",
    imageSource: imageUrls.normal ? "card" : "fallback",
    imageUrl: imageUrls.normal ?? imageUrls.small ?? imageUrls.large ?? "",
    imageUrls,
    identityMappingAudit: {
      ...lorcastIdentityMappingAudit,
      treatmentSource: treatmentDetails.source,
    },
    ink: raw.ink ?? undefined,
    gameplayAttributes: {
      cost: raw.cost ?? null,
      ink: raw.ink ?? null,
      inkwell: raw.inkwell ?? false,
      lore: raw.lore ?? null,
      moveCost: raw.move_cost ?? null,
      strength: raw.strength ?? null,
      willpower: raw.willpower ?? null,
    },
    gameplayIdentity: {
      aliases: [
        ...providerAlias("lorcast", "gameplay-fingerprint", gameplayIdentityId, "GameplayIdentity"),
      ],
      gameId: "Lorcana",
      gameplayAttributes: {
        cost: raw.cost ?? null,
        ink: raw.ink ?? null,
        inkwell: raw.inkwell ?? false,
        lore: raw.lore ?? null,
        moveCost: raw.move_cost ?? null,
        strength: raw.strength ?? null,
        willpower: raw.willpower ?? null,
      },
      gameplayIdentityId,
      layout: raw.layout,
      name: raw.name,
      rulesText: raw.text,
      subtitleOrVersion: raw.version,
      subtypesOrClassifications: raw.classifications ?? [],
      types: raw.type ?? [],
    },
    gameplayIdentityId,
    language: languageNames[raw.lang ?? ""] ?? raw.lang ?? "Unknown",
    layout: raw.layout,
    legalities: raw.legalities,
    rulesText: raw.text,
    name: raw.name,
    number: raw.collector_number,
    productFamily: raw.set.name,
    providerConfidence: 95,
    providerIdentity: {
      providerId: "lorcast",
      providerRecordId: raw.id,
    },
    providerSetId: raw.set.id,
    illustrators: raw.illustrators ?? [],
    publicationDate: raw.released_at,
    printingDesignFacets,
    physicalFinish,
    physicalVariants,
    marketIdentities,
    rarity: normalizeRarity(raw.rarity),
    releaseYear: raw.released_at?.slice(0, 4),
    set: raw.set.name,
    setCode: raw.set.code,
    sourceGames: ["paper"],
    tcgplayerId: raw.tcgplayer_id,
    treatment: treatmentDetails.value,
    treatmentDetails,
    typeLine: cardTypes.join(" — "),
    version: raw.version,
    subtitle: raw.version,
  };
}

export function normalizeLorcastCards(cards: LorcastCard[]) {
  return cards.map(normalizeLorcastCard).filter((card): card is Card => Boolean(card));
}
