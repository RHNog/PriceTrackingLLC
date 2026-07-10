import type { Card } from "@/types/card";
import type {
  CanonicalCollectibleIdentity,
  GameplayIdentity,
  IdentityEvidence,
  IdentityOntologyCompleteness,
  MarketIdentity,
  PhysicalFinish,
  PhysicalVariantIdentity,
  PrintingDesignFacet,
  PrintingIdentity,
  ProviderAlias,
} from "@/types/identityOntology";

function normalizeKey(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function createCanonicalId(namespace: string, ...parts: (number | string | undefined)[]) {
  return [namespace, ...parts.filter((part): part is number | string => part !== undefined)]
    .map((part) => normalizeKey(String(part)))
    .filter(Boolean)
    .join(":");
}

export function providerAlias(
  providerId: string,
  namespace: string,
  value: number | string | undefined,
  entityType: ProviderAlias["entityType"],
): ProviderAlias[] {
  return value === undefined
    ? []
    : [{ entityType, namespace, providerId, value: String(value) }];
}

export function explicitEvidence(
  providerId: string,
  providerField: string,
  explanation: string,
  confidence = 100,
): IdentityEvidence {
  return { confidence, explanation, providerField, providerId, state: "Explicit" };
}

export function unavailablePhysicalFinish(providerId: string): PhysicalFinish {
  return {
    evidence: {
      confidence: 100,
      explanation: `${providerId} does not explicitly supply physical finish availability for this printing.`,
      providerField: "none",
      providerId,
      state: "Provider Does Not Supply",
    },
    value: "Provider Does Not Supply",
  };
}

export function printingFacet(
  value: string,
  providerId: string,
  providerField: string,
  confidence = 100,
): PrintingDesignFacet {
  return {
    evidence: explicitEvidence(
      providerId,
      providerField,
      `${value} is a published printing design characteristic.`,
      confidence,
    ),
    value,
  };
}

function compatibilityPhysicalVariants(card: Card): PhysicalVariantIdentity[] {
  if (card.physicalVariants?.length) return card.physicalVariants;
  const finish = card.physicalFinish ?? unavailablePhysicalFinish(
    card.providerIdentity?.providerId ?? "unknown",
  );
  const printingIdentityId = card.printingIdentity?.printingIdentityId ?? card.id;
  const physicalVariantIdentityId = createCanonicalId(
    "physical",
    printingIdentityId,
    finish.value,
  );
  return [{
    aliases: [],
    marketIdentities: card.marketIdentities ?? [],
    physicalFinish: finish,
    physicalVariantIdentityId,
    printingIdentityId,
  }];
}

export function printingFromCard(card: Card, gameplayIdentityId: string): PrintingIdentity {
  if (card.printingIdentity) return card.printingIdentity;
  const providerId = card.providerIdentity?.providerId ?? "unknown";
  const printingIdentityId = createCanonicalId("printing", providerId, card.id);
  return {
    aliases: providerAlias(providerId, "print", card.id, "PrintingIdentity"),
    artwork: card.imageUrls ?? (card.imageUrl ? { normal: card.imageUrl } : {}),
    collectorNumber: card.number,
    gameplayIdentityId,
    illustrators: card.illustrators ?? [],
    language: card.language ?? "Unresolved",
    physicalVariants: compatibilityPhysicalVariants({
      ...card,
      printingIdentity: undefined,
    }).map((variant) => ({ ...variant, printingIdentityId })),
    printingDesignFacets: card.printingDesignFacets ?? [],
    printingIdentityId,
    publicationDate: card.publicationDate,
    rarity: card.rarity,
    setCode: card.setCode,
    setIdentityId: card.providerSetId,
    setName: card.set,
  };
}

export function gameplayFromCards(cards: Card[]): GameplayIdentity {
  const first = cards[0];
  if (first?.gameplayIdentity) return first.gameplayIdentity;
  const providerId = first?.providerIdentity?.providerId ?? "unknown";
  const gameplayIdentityId = first?.gameplayIdentityId ?? createCanonicalId(
    "gameplay",
    first?.game ?? "unknown",
    first?.name ?? "unknown",
    first?.version,
    first?.rulesText,
  );
  return {
    gameId: first?.game ?? "Unknown",
    gameplayAttributes: first?.gameplayAttributes ?? {},
    gameplayIdentityId,
    layout: first?.layout,
    name: first?.name ?? "Unknown",
    rulesText: first?.rulesText,
    subtitleOrVersion: first?.subtitle ?? first?.version,
    subtypesOrClassifications: first?.classifications ?? [],
    types: first?.cardTypes ?? [],
    ...(
      first?.gameplayProviderAlias
        ? { aliases: [first.gameplayProviderAlias] }
        : { aliases: providerAlias(providerId, "gameplay-fingerprint", gameplayIdentityId, "GameplayIdentity") }
    ),
  };
}

export function buildCanonicalCollectible(cards: Card[]): CanonicalCollectibleIdentity {
  const gameplayIdentity = gameplayFromCards(cards);
  return {
    gameplayIdentity,
    ontologyVersion: "PHR-ARCH-007",
    printingIdentities: cards.map((card) => printingFromCard(card, gameplayIdentity.gameplayIdentityId)),
  };
}

export function calculateOntologyCompleteness(
  identity: CanonicalCollectibleIdentity,
): IdentityOntologyCompleteness {
  const printings = identity.printingIdentities;
  const variants = printings.flatMap((printing) => printing.physicalVariants);
  const markets = variants.flatMap((variant) => variant.marketIdentities);
  const gameplayFields = [
    identity.gameplayIdentity.gameId,
    identity.gameplayIdentity.name,
    identity.gameplayIdentity.gameplayIdentityId,
  ];
  const gameplayIdentity = Math.round(
    (gameplayFields.filter(Boolean).length / gameplayFields.length) * 100,
  );
  const printingIdentity = printings.length
    ? Math.round(
        printings.reduce((sum, printing) => sum + [
          printing.setName,
          printing.collectorNumber,
          printing.language,
          printing.printingIdentityId,
          printing.artwork.normal ?? printing.artwork.small ?? printing.artwork.large,
        ].filter(Boolean).length / 5, 0) / printings.length * 100,
      )
    : 0;
  const physicalVariantIdentity = variants.length
    ? Math.round(
        variants.filter((variant) => variant.physicalFinish.evidence.state === "Explicit").length /
          variants.length * 100,
      )
    : 0;
  const marketIdentity = markets.length
    ? Math.round(markets.filter((market) => market.mappingStatus === "Validated").length / markets.length * 100)
    : 0;
  return {
    gameplayIdentity,
    marketIdentity,
    overall: Math.round((gameplayIdentity + printingIdentity + physicalVariantIdentity + marketIdentity) / 4),
    physicalVariantIdentity,
    printingIdentity,
  };
}

export function createMarketIdentity(input: {
  physicalVariantIdentityId: string;
  providerId: string;
  providerProductId?: number | string;
  providerSkuId?: number | string;
  status?: MarketIdentity["mappingStatus"];
}): MarketIdentity {
  const marketIdentityId = createCanonicalId(
    "market",
    input.providerId,
    input.providerProductId,
    input.providerSkuId,
  );
  return {
    aliases: [
      ...providerAlias(input.providerId, "product", input.providerProductId, "MarketIdentity"),
      ...providerAlias(input.providerId, "sku", input.providerSkuId, "MarketIdentity"),
    ],
    confidence: input.status === "Validated" ? 100 : 70,
    mappingEvidence: input.providerProductId === undefined ? [] : [explicitEvidence(
      input.providerId,
      "provider product id",
      "Provider supplied a marketplace product cross-reference; physical variant mapping still requires validation.",
      70,
    )],
    mappingStatus: input.status ?? "Candidate",
    marketIdentityId,
    marketProviderId: input.providerId,
    physicalVariantIdentityId: input.physicalVariantIdentityId,
    providerProductId: input.providerProductId === undefined ? undefined : String(input.providerProductId),
    providerSkuId: input.providerSkuId === undefined ? undefined : String(input.providerSkuId),
  };
}
