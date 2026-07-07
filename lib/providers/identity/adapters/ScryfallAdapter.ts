import { normalizeCard } from "@/lib/providers/identity/normalizers/CardNormalizer";
import { classifyRelationship } from "@/lib/engines/entity/classifyRelationship";
import type { Card } from "@/types/card";

type ScryfallCardFace = {
  image_uris?: {
    normal?: string;
  };
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
  image_uris?: {
    normal?: string;
  };
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

function getImageUrl(card: ScryfallCardResponse) {
  return (
    card.image_uris?.normal ?? card.card_faces?.[0]?.image_uris?.normal ?? ""
  );
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
    imageUrl: getImageUrl(card),
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
