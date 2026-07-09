import type {
  Card,
  JustTCGApiResponse,
  PriceHistoryEntry,
  UsageMeta,
  Variant,
} from "justtcg-js";
import type { MarketProviderRawObservation } from "@/types/marketSnapshot";

export type JustTCGRawCardResponse = JustTCGApiResponse<Card[]>;

export type JustTCGKnownCardContext = {
  cardName?: string;
  collectorNumber?: string;
  condition?: string;
  finish?: string;
  game?: string;
  includePriceHistory?: boolean;
  language?: string;
  limit?: number;
  priceHistoryDuration?: "7d" | "30d" | "90d" | "180d" | "1y";
  printing?: string;
  printingId?: string;
  providerProductIdentifier?: string;
  providerVariantIdentifier?: string;
  variantId?: string;
};

export type JustTCGFieldMapping = {
  internalField: string;
  notes: string;
  providerField: string;
};

export type JustTCGNormalizedVariant = {
  condition: string;
  currentPriceUsd: number | null;
  language: string | null;
  lastUpdatedAt: string | null;
  priceChange24hrPct: number | null;
  priceChange7dPct: number | null;
  priceChange30dPct: number | null;
  priceChange90dPct: number | null;
  priceHistory: {
    date: string;
    priceUsd: number;
  }[];
  printing: string;
  providerDerivedMetrics: JustTCGProviderDerivedMetrics;
  rawObservations: MarketProviderRawObservation[];
  statistics: {
    avgPrice7d: number | null;
    avgPrice30d: number | null;
    avgPrice90d: number | null;
    maxPrice7d: number | null;
    maxPrice30d: number | null;
    maxPrice90d: number | null;
    minPrice7d: number | null;
    minPrice30d: number | null;
    minPrice90d: number | null;
    volatility7d: number | null;
    volatility30d: number | null;
    volatility90d: number | null;
  };
  tcgplayerSkuId: string | null;
  variantId: string;
  variantUuid: string;
};

export type JustTCGProviderDerivedMetrics = {
  covPrice7d: number | null;
  covPrice30d: number | null;
  covPrice90d: number | null;
  iqrPrice7d: number | null;
  iqrPrice30d: number | null;
  iqrPrice90d: number | null;
  maxPriceAllTime: number | null;
  maxPriceAllTimeDate: string | null;
  minPriceAllTime: number | null;
  minPriceAllTimeDate: string | null;
  priceChangesCount7d: number | null;
  priceChangesCount30d: number | null;
  priceChangesCount90d: number | null;
  priceRelativeTo30dRange: number | null;
  priceRelativeTo90dRange: number | null;
  stddevPopPrice7d: number | null;
  stddevPopPrice30d: number | null;
  stddevPopPrice90d: number | null;
  trendSlope7d: number | null;
  trendSlope30d: number | null;
  trendSlope90d: number | null;
};

export type JustTCGNormalizedCard = {
  cardId: string;
  cardUuid: string;
  game: string;
  identifiers: {
    mtgjsonId: string | null;
    scryfallId: string | null;
    tcgplayerId: string | null;
  };
  name: string;
  number: string | null;
  rarity: string | null;
  rawObservations: MarketProviderRawObservation[];
  setId: string;
  setName: string | null;
  variants: JustTCGNormalizedVariant[];
};

export type JustTCGNormalizedResponse = {
  cards: JustTCGNormalizedCard[];
  fieldMappings: JustTCGFieldMapping[];
  providerMetadata: {
    pagination: {
      hasMore: boolean;
      limit: number;
      offset: number;
      total: number;
    } | null;
    rawObservations: MarketProviderRawObservation[];
    usage: Pick<
      UsageMeta,
      | "apiDailyLimit"
      | "apiDailyRequestsRemaining"
      | "apiDailyRequestsUsed"
      | "apiPlan"
      | "apiRateLimit"
      | "apiRequestsRemaining"
      | "apiRequestsUsed"
    >;
  };
  pagination: {
    hasMore: boolean;
    limit: number;
    offset: number;
    total: number;
  } | null;
  providerId: "justtcg";
  providerName: "JustTCG";
  request: {
    cardName: string;
    game: string;
    includePriceHistory: boolean;
    limit: number;
  };
  synchronizedAt: string;
  usage: Pick<
    UsageMeta,
    | "apiDailyLimit"
    | "apiDailyRequestsRemaining"
    | "apiDailyRequestsUsed"
    | "apiPlan"
    | "apiRateLimit"
    | "apiRequestsRemaining"
    | "apiRequestsUsed"
  >;
};

export const JUSTTCG_DEFAULT_CONTEXT: Required<JustTCGKnownCardContext> = {
  cardName: "Mox Opal",
  collectorNumber: "unknown",
  condition: "Near Mint",
  finish: "Normal",
  game: "Magic: The Gathering",
  includePriceHistory: true,
  language: "English",
  limit: 1,
  priceHistoryDuration: "30d",
  printing: "unknown",
  printingId: "unknown",
  providerProductIdentifier: "unknown",
  providerVariantIdentifier: "unknown",
  variantId: "unknown",
};

export const JUSTTCG_FIELD_MAPPINGS: JustTCGFieldMapping[] = [
  {
    providerField: "card.id",
    internalField: "cardId",
    notes: "JustTCG card slug is preserved as the provider-scoped card identifier.",
  },
  {
    providerField: "card.uuid",
    internalField: "cardUuid",
    notes: "Provider UUID is preserved for stable JustTCG identity matching.",
  },
  {
    providerField: "card.name",
    internalField: "name",
    notes: "Card display name is copied without interpretation.",
  },
  {
    providerField: "card.game",
    internalField: "game",
    notes: "Provider game name becomes normalized game context.",
  },
  {
    providerField: "card.set",
    internalField: "setId",
    notes: "JustTCG set slug becomes normalized set identifier.",
  },
  {
    providerField: "card.set_name",
    internalField: "setName",
    notes: "Provider set display name is nullable and remains nullable.",
  },
  {
    providerField: "card.tcgplayerId | card.scryfallId | card.mtgjsonId",
    internalField: "identifiers",
    notes: "External identifiers are grouped under normalized identifiers.",
  },
  {
    providerField: "variant.price",
    internalField: "currentPriceUsd",
    notes: "SDK prices are already dollars; values stay numeric USD.",
  },
  {
    providerField: "variant.lastUpdated",
    internalField: "lastUpdatedAt",
    notes: "Unix seconds are converted to ISO timestamps.",
  },
  {
    providerField: "variant.priceHistory[].t | variant.priceHistory[].p",
    internalField: "priceHistory[].date | priceHistory[].priceUsd",
    notes: "History timestamps are converted to ISO dates and prices remain USD.",
  },
  {
    providerField: "variant.priceChange* | variant.avgPrice* | variant.minPrice* | variant.maxPrice* | variant.covPrice*",
    internalField: "priceChange*Pct | statistics",
    notes: "Provider statistics are copied into named normalized market statistics.",
  },
];

function toIsoFromEpochSeconds(value: number | null | undefined) {
  return typeof value === "number"
    ? new Date(value * 1000).toISOString()
    : null;
}

function normalizePriceHistory(entries: PriceHistoryEntry[] | null | undefined) {
  return (entries ?? []).map((entry) => ({
    date: toIsoFromEpochSeconds(entry.t) ?? new Date(0).toISOString(),
    priceUsd: entry.p,
  }));
}

function createRawObservation(input: {
  observedAt: string;
  providerField: string;
  rawValue: MarketProviderRawObservation["rawValue"];
  unit?: string;
}): MarketProviderRawObservation {
  return {
    observedAt: input.observedAt,
    providerField: input.providerField,
    providerName: "JustTCG",
    rawValue: input.rawValue,
    unit: input.unit,
  };
}

function createVariantRawObservations(
  variant: Variant,
): MarketProviderRawObservation[] {
  const observedAt = toIsoFromEpochSeconds(variant.lastUpdated) ??
    new Date(0).toISOString();
  const observations: MarketProviderRawObservation[] = [
    createRawObservation({
      observedAt,
      providerField: "variant.id",
      rawValue: variant.id,
    }),
    createRawObservation({
      observedAt,
      providerField: "variant.uuid",
      rawValue: variant.uuid,
    }),
    createRawObservation({
      observedAt,
      providerField: "variant.condition",
      rawValue: variant.condition,
    }),
    createRawObservation({
      observedAt,
      providerField: "variant.printing",
      rawValue: variant.printing,
    }),
    createRawObservation({
      observedAt,
      providerField: "variant.language",
      rawValue: variant.language,
    }),
    createRawObservation({
      observedAt,
      providerField: "variant.tcgplayerSkuId",
      rawValue: variant.tcgplayerSkuId ?? null,
    }),
    createRawObservation({
      observedAt,
      providerField: "variant.price",
      rawValue: variant.price,
      unit: "USD",
    }),
    createRawObservation({
      observedAt,
      providerField: "variant.lastUpdated",
      rawValue: variant.lastUpdated,
      unit: "epoch-seconds",
    }),
  ];

  (variant.priceHistory ?? []).forEach((point, index) => {
    observations.push(
      createRawObservation({
        observedAt,
        providerField: `variant.priceHistory[${index}].t`,
        rawValue: point.t,
        unit: "epoch-seconds",
      }),
      createRawObservation({
        observedAt,
        providerField: `variant.priceHistory[${index}].p`,
        rawValue: point.p,
        unit: "USD",
      }),
    );
  });

  [
    ["variant.priceChange24hr", variant.priceChange24hr ?? null, "percent"],
    ["variant.priceChange7d", variant.priceChange7d ?? null, "percent"],
    ["variant.priceChange30d", variant.priceChange30d ?? null, "percent"],
    ["variant.priceChange90d", variant.priceChange90d ?? null, "percent"],
    ["variant.avgPrice", variant.avgPrice ?? null, "USD"],
    ["variant.avgPrice30d", variant.avgPrice30d ?? null, "USD"],
    ["variant.avgPrice90d", variant.avgPrice90d ?? null, "USD"],
    ["variant.minPrice7d", variant.minPrice7d ?? null, "USD"],
    ["variant.maxPrice7d", variant.maxPrice7d ?? null, "USD"],
    ["variant.minPrice30d", variant.minPrice30d ?? null, "USD"],
    ["variant.maxPrice30d", variant.maxPrice30d ?? null, "USD"],
    ["variant.minPrice90d", variant.minPrice90d ?? null, "USD"],
    ["variant.maxPrice90d", variant.maxPrice90d ?? null, "USD"],
    ["variant.stddevPopPrice7d", variant.stddevPopPrice7d ?? null, "USD"],
    ["variant.stddevPopPrice30d", variant.stddevPopPrice30d ?? null, "USD"],
    ["variant.stddevPopPrice90d", variant.stddevPopPrice90d ?? null, "USD"],
    ["variant.covPrice7d", variant.covPrice7d ?? null, null],
    ["variant.covPrice30d", variant.covPrice30d ?? null, null],
    ["variant.covPrice90d", variant.covPrice90d ?? null, null],
    ["variant.iqrPrice7d", variant.iqrPrice7d ?? null, "USD"],
    ["variant.iqrPrice30d", variant.iqrPrice30d ?? null, "USD"],
    ["variant.iqrPrice90d", variant.iqrPrice90d ?? null, "USD"],
    ["variant.trendSlope7d", variant.trendSlope7d ?? null, null],
    ["variant.trendSlope30d", variant.trendSlope30d ?? null, null],
    ["variant.trendSlope90d", variant.trendSlope90d ?? null, null],
    ["variant.priceChangesCount7d", variant.priceChangesCount7d ?? null, "count"],
    ["variant.priceChangesCount30d", variant.priceChangesCount30d ?? null, "count"],
    ["variant.priceChangesCount90d", variant.priceChangesCount90d ?? null, "count"],
    ["variant.priceRelativeTo30dRange", variant.priceRelativeTo30dRange ?? null, null],
    ["variant.priceRelativeTo90dRange", variant.priceRelativeTo90dRange ?? null, null],
    ["variant.minPriceAllTime", variant.minPriceAllTime ?? null, "USD"],
    ["variant.maxPriceAllTime", variant.maxPriceAllTime ?? null, "USD"],
    ["variant.minPriceAllTimeDate", variant.minPriceAllTimeDate ?? null, null],
    ["variant.maxPriceAllTimeDate", variant.maxPriceAllTimeDate ?? null, null],
  ].forEach(([providerField, rawValue, unit]) => {
    observations.push(
      createRawObservation({
        observedAt,
        providerField: providerField as string,
        rawValue: rawValue as MarketProviderRawObservation["rawValue"],
        unit: unit as string | undefined,
      }),
    );
  });

  return observations;
}

function createCardRawObservations(card: Card): MarketProviderRawObservation[] {
  const observedAt = new Date().toISOString();

  return [
    ["card.id", card.id],
    ["card.uuid", card.uuid],
    ["card.name", card.name],
    ["card.game", card.game],
    ["card.set", card.set],
    ["card.set_name", card.set_name ?? null],
    ["card.number", card.number],
    ["card.rarity", card.rarity],
    ["card.tcgplayerId", card.tcgplayerId],
    ["card.scryfallId", card.scryfallId],
    ["card.mtgjsonId", card.mtgjsonId],
    ["card.details", card.details ?? null],
  ].map(([providerField, rawValue]) =>
    createRawObservation({
      observedAt,
      providerField: providerField as string,
      rawValue: rawValue as MarketProviderRawObservation["rawValue"],
    }),
  );
}

function createProviderDerivedMetrics(
  variant: Variant,
): JustTCGProviderDerivedMetrics {
  return {
    covPrice7d: variant.covPrice7d ?? null,
    covPrice30d: variant.covPrice30d ?? null,
    covPrice90d: variant.covPrice90d ?? null,
    iqrPrice7d: variant.iqrPrice7d ?? null,
    iqrPrice30d: variant.iqrPrice30d ?? null,
    iqrPrice90d: variant.iqrPrice90d ?? null,
    maxPriceAllTime: variant.maxPriceAllTime ?? null,
    maxPriceAllTimeDate: variant.maxPriceAllTimeDate ?? null,
    minPriceAllTime: variant.minPriceAllTime ?? null,
    minPriceAllTimeDate: variant.minPriceAllTimeDate ?? null,
    priceChangesCount7d: variant.priceChangesCount7d ?? null,
    priceChangesCount30d: variant.priceChangesCount30d ?? null,
    priceChangesCount90d: variant.priceChangesCount90d ?? null,
    priceRelativeTo30dRange: variant.priceRelativeTo30dRange ?? null,
    priceRelativeTo90dRange: variant.priceRelativeTo90dRange ?? null,
    stddevPopPrice7d: variant.stddevPopPrice7d ?? null,
    stddevPopPrice30d: variant.stddevPopPrice30d ?? null,
    stddevPopPrice90d: variant.stddevPopPrice90d ?? null,
    trendSlope7d: variant.trendSlope7d ?? null,
    trendSlope30d: variant.trendSlope30d ?? null,
    trendSlope90d: variant.trendSlope90d ?? null,
  };
}

function normalizeVariant(variant: Variant): JustTCGNormalizedVariant {
  return {
    condition: variant.condition,
    currentPriceUsd: typeof variant.price === "number" ? variant.price : null,
    language: variant.language,
    lastUpdatedAt: toIsoFromEpochSeconds(variant.lastUpdated),
    priceChange24hrPct: variant.priceChange24hr ?? null,
    priceChange7dPct: variant.priceChange7d ?? null,
    priceChange30dPct: variant.priceChange30d ?? null,
    priceChange90dPct: variant.priceChange90d ?? null,
    priceHistory: normalizePriceHistory(variant.priceHistory),
    printing: variant.printing,
    providerDerivedMetrics: createProviderDerivedMetrics(variant),
    rawObservations: createVariantRawObservations(variant),
    statistics: {
      avgPrice7d: variant.avgPrice ?? null,
      avgPrice30d: variant.avgPrice30d ?? null,
      avgPrice90d: variant.avgPrice90d ?? null,
      maxPrice7d: variant.maxPrice7d ?? null,
      maxPrice30d: variant.maxPrice30d ?? null,
      maxPrice90d: variant.maxPrice90d ?? null,
      minPrice7d: variant.minPrice7d ?? null,
      minPrice30d: variant.minPrice30d ?? null,
      minPrice90d: variant.minPrice90d ?? null,
      volatility7d: variant.covPrice7d ?? null,
      volatility30d: variant.covPrice30d ?? null,
      volatility90d: variant.covPrice90d ?? null,
    },
    tcgplayerSkuId: variant.tcgplayerSkuId ?? null,
    variantId: variant.id,
    variantUuid: variant.uuid,
  };
}

function normalizeCard(card: Card): JustTCGNormalizedCard {
  return {
    cardId: card.id,
    cardUuid: card.uuid,
    game: card.game,
    identifiers: {
      mtgjsonId: card.mtgjsonId,
      scryfallId: card.scryfallId,
      tcgplayerId: card.tcgplayerId,
    },
    name: card.name,
    number: card.number,
    rarity: card.rarity,
    rawObservations: createCardRawObservations(card),
    setId: card.set,
    setName: card.set_name ?? null,
    variants: card.variants.map(normalizeVariant),
  };
}

function normalizeProviderMetadata(raw: JustTCGRawCardResponse) {
  const observedAt = new Date().toISOString();
  const usage = {
    apiDailyLimit: raw.usage.apiDailyLimit,
    apiDailyRequestsRemaining: raw.usage.apiDailyRequestsRemaining,
    apiDailyRequestsUsed: raw.usage.apiDailyRequestsUsed,
    apiPlan: raw.usage.apiPlan,
    apiRateLimit: raw.usage.apiRateLimit,
    apiRequestsRemaining: raw.usage.apiRequestsRemaining,
    apiRequestsUsed: raw.usage.apiRequestsUsed,
  };
  const pagination = raw.pagination
    ? {
        hasMore: raw.pagination.hasMore,
        limit: raw.pagination.limit,
        offset: raw.pagination.offset,
        total: raw.pagination.total,
      }
    : null;
  const rawObservations = [
    ...Object.entries(usage).map(([providerField, rawValue]) =>
      createRawObservation({
        observedAt,
        providerField: `provider.usage.${providerField}`,
        rawValue: rawValue as MarketProviderRawObservation["rawValue"],
      }),
    ),
    ...(pagination
      ? Object.entries(pagination).map(([providerField, rawValue]) =>
          createRawObservation({
            observedAt,
            providerField: `provider.pagination.${providerField}`,
            rawValue: rawValue as MarketProviderRawObservation["rawValue"],
          }),
        )
      : []),
  ];

  return {
    pagination,
    rawObservations,
    usage,
  };
}

export function normalizeJustTCGContext(
  context?: JustTCGKnownCardContext,
): Required<JustTCGKnownCardContext> {
  return {
    ...JUSTTCG_DEFAULT_CONTEXT,
    ...context,
  };
}

export function normalizeJustTCGCardResponse(
  raw: JustTCGRawCardResponse,
  context?: JustTCGKnownCardContext,
): JustTCGNormalizedResponse {
  const normalizedContext = normalizeJustTCGContext(context);
  const providerMetadata = normalizeProviderMetadata(raw);

  return {
    cards: raw.data.map(normalizeCard),
    fieldMappings: JUSTTCG_FIELD_MAPPINGS,
    providerMetadata,
    pagination: providerMetadata.pagination,
    providerId: "justtcg",
    providerName: "JustTCG",
    request: {
      cardName: normalizedContext.cardName,
      game: normalizedContext.game,
      includePriceHistory: normalizedContext.includePriceHistory,
      limit: normalizedContext.limit,
    },
    synchronizedAt: new Date().toISOString(),
    usage: providerMetadata.usage,
  };
}
