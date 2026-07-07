type NormalizeCardInput = {
  collectorNumber?: string;
  finish?: string;
  frameEffects?: string[];
  language?: string;
  name?: string;
  setName?: string;
  typeLine?: string;
};

function normalizeText(value?: string) {
  return value?.trim().replace(/\s+/g, " ") ?? "";
}

export function normalizeCard(input: NormalizeCardInput) {
  // TODO: Condition normalization.
  // TODO: Promo normalization.
  // TODO: Marketplace aliases.
  return {
    collectorNumber: normalizeText(input.collectorNumber),
    finish: normalizeText(input.finish),
    frameEffects: input.frameEffects ?? [],
    language: normalizeText(input.language || "en"),
    name: normalizeText(input.name),
    setName: normalizeText(input.setName),
    typeLine: normalizeText(input.typeLine),
  };
}
