import { normalizeMarketPrice } from "@/lib/providers/market/normalizers/MarketPriceNormalizer";
import type {
  ScryfallCardResponse,
  ScryfallPriceResponse,
} from "@/lib/providers/identity/adapters/ScryfallAdapter";
import type { MarketPrice } from "@/types/marketPrice";
import type { MarketSnapshot } from "@/types/marketSnapshot";
import type { PrintingVariant } from "@/types/printingVariant";
import { createCanonicalId } from "@/lib/engines/identity/IdentityOntology";

const PROVIDER_ID = "scryfall-market";
const SOURCE_LABEL = "Scryfall Daily Market Estimate";

type ScryfallPriceField = {
  currency: string;
  field: keyof ScryfallPriceResponse;
  finish: string;
};

const priceFields: ScryfallPriceField[] = [
  { field: "usd", finish: "Nonfoil", currency: "USD" },
  { field: "usd_foil", finish: "Foil", currency: "USD" },
  { field: "usd_etched", finish: "Etched", currency: "USD" },
  { field: "eur", finish: "Nonfoil", currency: "EUR" },
  { field: "eur_foil", finish: "Foil", currency: "EUR" },
  { field: "eur_etched", finish: "Etched", currency: "EUR" },
  { field: "tix", finish: "MTGO", currency: "TIX" },
];

function normalizeFinish(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function getRawPrices(prices?: ScryfallPriceResponse) {
  return {
    eur: prices?.eur,
    eur_etched: prices?.eur_etched,
    eur_foil: prices?.eur_foil,
    tix: prices?.tix,
    usd: prices?.usd,
    usd_etched: prices?.usd_etched,
    usd_foil: prices?.usd_foil,
  };
}

function createPriceId(
  printingId: string,
  variantId: string,
  field: keyof ScryfallPriceResponse,
) {
  return `${PROVIDER_ID}:${printingId}:${variantId}:${field}`;
}

export function adaptScryfallMarketSnapshot(
  card: ScryfallCardResponse,
  variant: PrintingVariant,
  durationMs = 0,
): MarketSnapshot {
  const prices = card.prices ?? {};
  const matchingFields = priceFields.filter(
    (priceField) =>
      normalizeFinish(priceField.finish) === normalizeFinish(variant.finish),
  );
  const marketPrices: MarketPrice[] = matchingFields
    .map((priceField) => {
      const price = normalizeMarketPrice(prices[priceField.field]);

      if (price === null) {
        return null;
      }

      const marketPrice: MarketPrice = {
        id: createPriceId(card.id ?? "", variant.id, priceField.field),
        cardId: card.id ?? "",
        printingId: card.id ?? "",
        variantId: variant.id,
        providerId: PROVIDER_ID,
        source: SOURCE_LABEL,
        currency: priceField.currency,
        finish: variant.finish,
        price,
        priceType: "market_estimate" as const,
        updatedAt: new Date().toISOString(),
        confidence: 70,
      };

      return marketPrice;
    })
    .filter((price): price is MarketPrice => Boolean(price));
  const observedAt = new Date().toISOString();
  const marketIdentityId = createCanonicalId(
    "market",
    PROVIDER_ID,
    card.id,
    variant.id,
  );

  return {
    canonicalObservation: {
      currency: marketPrices[0]?.currency ?? matchingFields[0]?.currency ?? "USD",
      evidence: {
        priceMissing: marketPrices.length === 0,
        source: SOURCE_LABEL,
      },
      marketIdentityId,
      marketObservationId: createCanonicalId("observation", marketIdentityId, observedAt),
      observedAt,
      price: marketPrices[0]?.price ?? null,
    },
    marketIdentityId,
    printingId: card.id ?? "",
    variantId: variant.id,
    prices: marketPrices,
    providerId: PROVIDER_ID,
    updatedAt: observedAt,
    sourceLabel: SOURCE_LABEL,
    rawPrices: getRawPrices(card.prices),
    durationMs,
    priceMissing: marketPrices.length === 0,
  };
}
