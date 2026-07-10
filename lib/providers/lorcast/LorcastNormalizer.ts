import type { Card } from "@/types/card";
import type { LorcastCard } from "@/lib/providers/lorcast/LorcastTypes";

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

export function normalizeLorcastCard(raw: LorcastCard): Card | null {
  if (!raw.id || !raw.name || !raw.set?.name || !raw.collector_number) return null;

  const imageUrls = {
    large: raw.image_uris?.digital?.large,
    normal: raw.image_uris?.digital?.normal,
    small: raw.image_uris?.digital?.small,
  };
  const cardTypes = [...(raw.type ?? []), ...(raw.classifications ?? [])];
  const canonicalIdentity = ["lorcana", raw.name, raw.version]
    .filter(Boolean)
    .join(":")
    .toLowerCase();

  return {
    availableFinishes: ["Unknown"],
    canonicalIdentity,
    cardTypes,
    finish: "Unknown",
    game: "Lorcana",
    id: raw.id,
    imageFace: "single",
    imageSource: imageUrls.normal ? "card" : "fallback",
    imageUrl: imageUrls.normal ?? imageUrls.small ?? imageUrls.large ?? "",
    imageUrls,
    ink: raw.ink ?? undefined,
    language: languageNames[raw.lang ?? ""] ?? raw.lang ?? "Unknown",
    layout: raw.layout,
    name: raw.name,
    number: raw.collector_number,
    productFamily: raw.set.name,
    providerConfidence: 95,
    providerIdentity: {
      providerId: "lorcast",
      providerRecordId: raw.id,
    },
    rarity: normalizeRarity(raw.rarity),
    releaseYear: raw.released_at?.slice(0, 4),
    set: raw.set.name,
    setCode: raw.set.code,
    sourceGames: ["paper"],
    tcgplayerId: raw.tcgplayer_id,
    typeLine: cardTypes.join(" — "),
    version: raw.version,
  };
}

export function normalizeLorcastCards(cards: LorcastCard[]) {
  return cards.map(normalizeLorcastCard).filter((card): card is Card => Boolean(card));
}
