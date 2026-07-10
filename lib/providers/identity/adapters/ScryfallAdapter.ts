import { normalizeCard } from "@/lib/providers/identity/normalizers/CardNormalizer";
import { classifyRelationship } from "@/lib/engines/entity/classifyRelationship";
import type { Card, CardImageUrls } from "@/types/card";
import type { PrintingVariant } from "@/types/printingVariant";
import type { PhysicalVariantIdentity, PrintingDesignFacet } from "@/types/identityOntology";
import {
  createCanonicalId,
  createMarketIdentity,
  explicitEvidence,
  printingFacet,
  providerAlias,
} from "@/lib/engines/identity/IdentityOntology";

type ScryfallImageUris = {
  art_crop?: string;
  large?: string;
  normal?: string;
  small?: string;
};

type ScryfallCardFace = {
  image_uris?: ScryfallImageUris;
  name?: string;
  oracle_text?: string;
  type_line?: string;
};

export type ScryfallCardResponse = {
  id?: string;
  oracle_id?: string;
  name?: string;
  lang?: string;
  set_name?: string;
  set_id?: string;
  collector_number?: string;
  rarity?: string;
  foil?: boolean;
  nonfoil?: boolean;
  finishes?: string[];
  frame?: string;
  frame_effects?: string[];
  games?: string[];
  layout?: string;
  component?: string;
  legalities?: Record<string, string>;
  promo_types?: string[];
  artist?: string;
  illustration_id?: string;
  oracle_text?: string;
  mana_cost?: string;
  colors?: string[];
  color_identity?: string[];
  full_art?: boolean;
  border_color?: string;
  tcgplayer_id?: number;
  tcgplayer_etched_id?: number;
  prices?: ScryfallPriceResponse;
  released_at?: string;
  set?: string;
  type_line?: string;
  image_uris?: ScryfallImageUris;
  card_faces?: ScryfallCardFace[];
};

export type ScryfallPriceResponse = {
  eur?: string | null;
  eur_etched?: string | null;
  eur_foil?: string | null;
  tix?: string | null;
  usd?: string | null;
  usd_etched?: string | null;
  usd_foil?: string | null;
};

function formatFinish(finish: string) {
  const normalized = finish.toLowerCase().replace(/[^a-z0-9]+/g, "");

  if (normalized === "nonfoil") {
    return "Nonfoil";
  }

  if (normalized === "foil") {
    return "Foil";
  }

  if (normalized === "etched") {
    return "Etched";
  }

  return finish.replace(/\b\w/g, (character) => character.toUpperCase());
}

function getAvailableFinishes(card: ScryfallCardResponse) {
  const finishes = card.finishes?.length
    ? card.finishes
    : [
        card.nonfoil ? "nonfoil" : undefined,
        card.foil ? "foil" : undefined,
      ];

  const normalized = Array.from(
    new Set(
      finishes
        .filter((finish): finish is string => Boolean(finish))
        .map(formatFinish),
    ),
  );
  const manufacturingFinishes: Record<string, string> = {
    confettifoil: "Confetti Foil",
    galaxyfoil: "Galaxy Foil",
    halofoil: "Halo Foil",
    rainbowfoil: "Rainbow Foil",
    surgefoil: "Surge Foil",
  };
  const explicitManufacturingFinish = card.promo_types
    ?.map((value) => manufacturingFinishes[value])
    .find(Boolean);
  return explicitManufacturingFinish
    ? normalized.map((finish) => finish === "Foil" ? explicitManufacturingFinish : finish)
    : normalized;
}

function getFinish(card: ScryfallCardResponse) {
  const finishes = getAvailableFinishes(card);

  if (finishes.length === 1) {
    return finishes[0];
  }

  if (finishes.length > 1) {
    return "Multiple";
  }

  return "Unknown";
}

function getImageUrls(imageUris?: ScryfallImageUris): CardImageUrls {
  return {
    artCrop: imageUris?.art_crop,
    large: imageUris?.large,
    normal: imageUris?.normal,
    small: imageUris?.small,
  };
}

function getPrimaryImageUrls(card: ScryfallCardResponse) {
  return card.image_uris
    ? getImageUrls(card.image_uris)
    : getImageUrls(card.card_faces?.[0]?.image_uris);
}

function getImageUrl(card: ScryfallCardResponse) {
  const imageUrls = getPrimaryImageUrls(card);

  return imageUrls.normal ?? imageUrls.small ?? imageUrls.large ?? "";
}

function createFinishVariants(card: ScryfallCardResponse): PrintingVariant[] {
  const finishes = getAvailableFinishes(card);
  const imageUrls = getPrimaryImageUrls(card);

  return finishes.map((finish) => ({
    id: `${card.id}:${finish.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    printingId: card.id ?? "",
    finish,
    imageUrls,
    isAvailable: true,
    source: "Scryfall",
    physicalFinish: {
      evidence: explicitEvidence(
        "scryfall",
        "finishes",
        "Scryfall explicitly lists this manufactured finish for the printing.",
      ),
      value: finish === "Nonfoil" ? "Normal" : finish,
    },
    physicalVariantIdentityId: createCanonicalId(
      "physical",
      createCanonicalId("printing", "scryfall", card.id),
      finish === "Nonfoil" ? "Normal" : finish,
    ),
    metadata: {
      rawFinishes: card.finishes?.join(", "),
      // TODO: Marketplace-specific finish images when providers expose them.
    },
  }));
}

function getCardFaces(card: ScryfallCardResponse) {
  // TODO: front/back image display.
  // TODO: multi-face image carousel.
  // TODO: image fallback handling for missing provider images.
  return card.card_faces?.map((face) => ({
    imageUrls: getImageUrls(face.image_uris),
    name: face.name,
  }));
}

function getPrintingDesignFacets(card: ScryfallCardResponse): PrintingDesignFacet[] {
  const facets = new Map<string, PrintingDesignFacet>();
  const add = (value: string, field: string) =>
    facets.set(value, printingFacet(value, "scryfall", field));
  const frameEffects: Record<string, string> = {
    colorshifted: "Colorshifted",
    extendedart: "Extended Art",
    inverted: "Inverted",
    nyxtouched: "Nyx-Touched",
    shatteredglass: "Shattered Glass",
    showcase: "Showcase",
    textless: "Textless",
    tombstone: "Tombstone",
  };
  const finishOnlyPromoTypes = new Set([
    "confettifoil", "galaxyfoil", "halofoil", "rainbowfoil", "surgefoil",
  ]);

  if (card.border_color === "borderless") add("Borderless", "border_color");
  if (card.full_art) add("Full Art", "full_art");
  (card.frame_effects ?? []).forEach((value) => {
    if (value === "oldframe" || value === "retro") add("Retro", "frame_effects");
    else if (frameEffects[value]) add(frameEffects[value], "frame_effects");
  });
  (card.promo_types ?? []).forEach((value) => {
    if (finishOnlyPromoTypes.has(value)) return;
    if (value === "textless") add("Textless", "promo_types");
    else if (value === "storechampionship") add("Store Championship", "promo_types");
    else add(value.replace(/\b\w/g, (character) => character.toUpperCase()), "promo_types");
  });
  const setText = card.set_name?.toLowerCase() ?? "";
  if (setText.includes("invocation")) add("Invocation", "set_name");
  if (setText.includes("masterpiece") || setText.includes("invention")) add("Masterpiece", "set_name");
  return [...facets.values()];
}

function getLanguageName(language: string) {
  const languageNames: Record<string, string> = {
    de: "German",
    en: "English",
    es: "Spanish",
    fr: "French",
    it: "Italian",
    ja: "Japanese",
    ko: "Korean",
    pt: "Portuguese",
    ru: "Russian",
    zhs: "Simplified Chinese",
    zht: "Traditional Chinese",
  };

  return languageNames[language] ?? language;
}

export function adaptScryfallCard(card: ScryfallCardResponse): Card | null {
  if (!card.id || !card.name) {
    return null;
  }

  const normalized = normalizeCard({
    collectorNumber: card.collector_number,
    finish: getFinish(card),
    frameEffects: card.frame_effects,
    language: card.lang,
    name: card.name,
    setName: card.set_name,
    typeLine: card.type_line,
  });
  const availableFinishes = getAvailableFinishes(card);
  const finishVariants = createFinishVariants(card);
  const gameplayIdentityId = card.oracle_id
    ? createCanonicalId("gameplay", "scryfall", card.oracle_id)
    : createCanonicalId("gameplay", "magic", card.name, card.oracle_text);
  const printingIdentityId = createCanonicalId("printing", "scryfall", card.id);
  const printingDesignFacets = getPrintingDesignFacets(card);
  const physicalVariants: PhysicalVariantIdentity[] = finishVariants.map((variant) => {
    const physicalVariantIdentityId = createCanonicalId(
      "physical",
      printingIdentityId,
      variant.physicalFinish?.value,
    );
    const marketProductId = variant.physicalFinish?.value === "Etched"
      ? card.tcgplayer_etched_id
      : card.tcgplayer_id;
    return {
      aliases: providerAlias(
        "scryfall",
        "finish-variant",
        `${card.id}:${variant.physicalFinish?.value}`,
        "PhysicalVariantIdentity",
      ),
      marketIdentities: marketProductId === undefined ? [] : [createMarketIdentity({
        physicalVariantIdentityId,
        providerId: "tcgplayer",
        providerProductId: marketProductId,
      })],
      physicalFinish: variant.physicalFinish!,
      physicalVariantIdentityId,
      printingIdentityId,
    };
  });
  const primaryFacet = printingDesignFacets[0]?.value ?? "";
  const [primaryType = "", subtypeText = ""] = (card.type_line ?? "").split(/\s+[—-]\s+/, 2);
  const printingIdentity = {
    aliases: providerAlias("scryfall", "print", card.id, "PrintingIdentity"),
    artwork: getPrimaryImageUrls(card),
    artworkIdentityId: card.illustration_id
      ? createCanonicalId("artwork", "scryfall", card.illustration_id)
      : undefined,
    collectorNumber: normalized.collectorNumber,
    gameplayIdentityId,
    illustrators: card.artist ? [card.artist] : [],
    language: getLanguageName(normalized.language),
    physicalVariants,
    printingDesignFacets,
    printingIdentityId,
    publicationDate: card.released_at,
    rarity: card.rarity,
    setCode: card.set?.toUpperCase(),
    setIdentityId: card.set_id,
    setName: normalized.setName,
  };

  return {
    id: card.id,
    name: normalized.name,
    game: "Magic",
    set: normalized.setName,
    setCode: card.set?.toUpperCase(),
    number: normalized.collectorNumber,
    rarity: card.rarity ?? "Unknown",
    finish: normalized.finish,
    availableFinishes,
    frame: card.frame,
    frameEffects: normalized.frameEffects,
    cardFaces: getCardFaces(card),
    classifications: [],
    hasCardFaces: Boolean(card.card_faces?.length),
    imageFace: card.card_faces?.length ? "front" : "single",
    imageUrl: getImageUrl(card),
    imageSource: card.image_uris
      ? "card"
      : card.card_faces?.[0]?.image_uris
        ? "card_faces"
        : "fallback",
    imageUrls: getPrimaryImageUrls(card),
    identityRelationship: classifyRelationship({
      component: card.component,
      layout: card.layout,
      name: card.name,
    }),
    language: getLanguageName(normalized.language),
    layout: card.layout,
    legalities: card.legalities,
    gameplayAttributes: {
      colorIdentity: card.color_identity ?? [],
      colors: card.colors ?? [],
      manaCost: card.mana_cost ?? "",
    },
    gameplayIdentity: {
      aliases: providerAlias("scryfall", "oracle", card.oracle_id, "GameplayIdentity"),
      gameId: "Magic",
      gameplayAttributes: {
        colorIdentity: card.color_identity ?? [],
        colors: card.colors ?? [],
        manaCost: card.mana_cost ?? "",
      },
      gameplayIdentityId,
      layout: card.layout,
      name: normalized.name,
      rulesText: card.oracle_text ?? card.card_faces?.map((face) => face.oracle_text).filter(Boolean).join(" // "),
      subtypesOrClassifications: subtypeText ? subtypeText.split(/\s+/) : [],
      types: primaryType ? [primaryType] : [],
    },
    gameplayIdentityId,
    productFamily: card.set_name,
    providerConfidence: 98,
    providerIdentity: {
      providerId: "scryfall",
      providerRecordId: card.id,
    },
    illustrators: card.artist ? [card.artist] : [],
    publicationDate: card.released_at,
    printingDesignFacets,
    printingIdentity,
    physicalFinish: physicalVariants.length === 1 ? physicalVariants[0].physicalFinish : undefined,
    physicalVariants,
    marketIdentities: physicalVariants.flatMap((variant) => variant.marketIdentities),
    promoTypes: card.promo_types ?? [],
    releaseYear: card.released_at?.slice(0, 4),
    selectedFinish:
      availableFinishes.length === 1 ? availableFinishes[0] : undefined,
    sourceGames: card.games,
    treatment: primaryFacet,
    rulesText: card.oracle_text,
    tcgplayerId: card.tcgplayer_id,
    typeLine: card.type_line,
    component: card.component,
    finishVariants,
  };
}
