import { normalizeCard } from "@/lib/providers/identity/normalizers/CardNormalizer";
import { classifyRelationship } from "@/lib/engines/entity/classifyRelationship";
import type { Card, CardImageUrls } from "@/types/card";

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
  layout?: string;
  component?: string;
  promo_types?: string[];
  released_at?: string;
  set?: string;
  type_line?: string;
  image_uris?: ScryfallImageUris;
  card_faces?: ScryfallCardFace[];
};

function getFinish(card: ScryfallCardResponse) {
  if (card.finishes?.includes("foil")) {
    return "Foil";
  }

  if (card.foil) {
    return "Foil";
  }

  if (card.nonfoil) {
    return "Nonfoil";
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

  return {
    id: card.id,
    name: normalized.name,
    game: "Magic",
    set: normalized.setName,
    setCode: card.set?.toUpperCase(),
    number: normalized.collectorNumber,
    rarity: card.rarity ?? "Unknown",
    finish: normalized.finish,
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
    productFamily: card.set_name,
    promoTypes: card.promo_types ?? [],
    releaseYear: card.released_at?.slice(0, 4),
    treatment: getTreatment(card),
  };
}
