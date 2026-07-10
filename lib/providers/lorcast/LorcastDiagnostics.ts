import type { LorcastErrorKind } from "@/lib/providers/lorcast/LorcastTypes";
import type { IdentityMappingAudit } from "@/types/identityCompleteness";

export const lorcastIdentityMappingAudit: Omit<IdentityMappingAudit, "treatmentSource"> = {
  canonicalFields: [
    "gameplayIdentity", "printingIdentity", "physicalVariantIdentity", "marketIdentity",
    "game", "name", "subtitle", "collectorNumber", "set", "setCode",
    "language", "artwork", "rarity", "printingDesignFacets", "cardType",
    "providerIdentity", "canonicalIdentity", "providerConfidence", "tcgplayerId",
  ],
  derivedFields: [
    "canonicalIdentity", "language", "releaseYear", "normalizedRarity",
    "productFamily", "typeLine", "providerConfidence", "gameplayFingerprint",
    "printingDesignFacets", "physicalFinishUnavailable", "completeness",
  ],
  ignoredFields: [
    "cost", "inkwell", "text", "move_cost", "strength", "willpower", "lore",
    "illustrators", "flavor_text", "prices.usd", "prices.usd_foil",
  ],
  mappedFields: [
    "id", "name", "version", "layout", "released_at", "image_uris.digital",
    "ink", "type", "classifications", "rarity", "collector_number", "lang",
    "tcgplayer_id", "legalities", "set.id", "set.code", "set.name",
  ],
};

export type LorcastDiagnostics = {
  cacheAgeMs: number | null;
  cacheStatus: "HIT" | "MISS";
  durationMs: number;
  errorKind?: LorcastErrorKind;
  errorMessage?: string;
  httpStatus?: number;
  normalizedCount: number;
  providerId: "lorcast";
  query: string;
  requestUrl?: string;
  unique: "prints";
};
