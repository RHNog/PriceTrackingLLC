import { normalizeCard } from "@/lib/providers/identity/normalizers/CardNormalizer";
import { classifyRelationship } from "@/lib/engines/entity/classifyRelationship";
import type { Card, CardImageUrls } from "@/types/card";
import type { PrintingVariant } from "@/types/printingVariant";

type ScryfallImageUris = {
  art_crop?: string;
  large?: string;
  normal?: string;
  small?: string;
};

type ScryfallCardFace = {
  image_uris?: ScryfallImageUris;
  name?: string;
};

export type ScryfallCardResponse = {
  id?: string;
  name?: string;
  lang?: string;
  set_name?: string;
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

function getSpecialFinish(card: ScryfallCardResponse) {
  const promoTypes = card.promo_types ?? [];
  const specialFinishes: Record<string, string> = {
    confettifoil: "Confetti",
    galaxyfoil: "Galaxy",
    halofoil: "Halo",
    surgefoil: "Surge",
  };
  const matchedPromoType = promoTypes.find((promoType) => specialFinishes[promoType]);

  return matchedPromoType ? specialFinishes[matchedPromoType] : undefined;
}

function getAvailableFinishes(card: ScryfallCardResponse) {
  const specialFinish = getSpecialFinish(card);

  if (specialFinish) {
    return [specialFinish];
  }

  const finishes = card.finishes?.length
    ? card.finishes
    : [
        card.nonfoil ? "nonfoil" : undefined,
        card.foil ? "foil" : undefined,
      ];

  return Array.from(
    new Set(
      finishes
        .filter((finish): finish is string => Boolean(finish))
        .map(formatFinish),
    ),
  );
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

function getTreatment(card: ScryfallCardResponse) {
  const searchableText = [
    card.set_name,
    card.type_line,
    ...(card.frame_effects ?? []),
    ...(card.promo_types ?? []),
  ]
    .join(" ")
    .toLowerCase();

  if (searchableText.includes("textless")) {
    return "Textless";
  }

  if (searchableText.includes("store championship")) {
    return "Store Championship";
  }

  if (searchableText.includes("showcase")) {
    return "Showcase";
  }

  if (searchableText.includes("borderless")) {
    return "Borderless";
  }

  if (searchableText.includes("retro")) {
    return "Retro";
  }

  if (searchableText.includes("invocation")) {
    return "Invocation";
  }

  if (searchableText.includes("masterpiece") || searchableText.includes("invention")) {
    return "Masterpiece";
  }

  return "";
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
    productFamily: card.set_name,
    promoTypes: card.promo_types ?? [],
    releaseYear: card.released_at?.slice(0, 4),
    selectedFinish:
      availableFinishes.length === 1 ? availableFinishes[0] : undefined,
    sourceGames: card.games,
    treatment: getTreatment(card),
    typeLine: card.type_line,
    component: card.component,
    finishVariants,
  };
}
