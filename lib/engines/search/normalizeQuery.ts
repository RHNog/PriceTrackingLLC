export function normalizeQuery(raw: string) {
  // TODO: Accent removal.
  // TODO: Language normalization.
  // TODO: Synonyms.
  // TODO: Aliases.
  return raw
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ");
}
