import { createProviderEvidenceScore } from "@/lib/market/ProviderEvidenceScore";
import { classifyProviderPrice } from "@/lib/market/ProviderPricingClassifier";
import { validateProviderMatch } from "@/lib/market/ProviderMatchValidator";
import type { MarketSnapshotRequestContext } from "@/lib/market/MarketIntelligenceRepository";
import type {
  MarketEvidenceNode,
  MarketProviderEvidence,
} from "@/lib/market/MarketSnapshot";
import type { MarketSnapshotField } from "@/lib/market/MarketSnapshotMetadata";
import type { MarketTruthReport } from "@/lib/market/MarketTruthReport";
import { canProviderAnswerMarketField } from "@/lib/market/ontology/EvidenceResolver";
import type { MarketSnapshot } from "@/types/marketSnapshot";
import type { MarketProviderRawObservation } from "@/types/marketSnapshot";

export interface ProviderEvidenceValidationResult {
  evidence: MarketProviderEvidence[];
  report: MarketTruthReport;
}

function createEvidence(input: {
  classification: MarketProviderEvidence["classification"];
  confidence: number;
  coverage: number;
  field: MarketSnapshotField;
  node: MarketEvidenceNode;
  providerName: string;
  rawObservations?: MarketProviderRawObservation[];
  retrievedAt: string;
  source: string;
  value: number | null | undefined;
}): MarketProviderEvidence | null {
  if (typeof input.value !== "number") {
    return null;
  }

  if (
    !canProviderAnswerMarketField({
      field: input.field,
      providerIdOrName: input.providerName,
    })
  ) {
    return null;
  }

  return {
    classification: input.classification,
    confidence: createProviderEvidenceScore({
      confidence: input.confidence,
      coverage: input.coverage,
    }),
    field: input.field,
    node: input.node,
    providerName: input.providerName,
    rawObservations: input.rawObservations,
    retrievedAt: input.retrievedAt,
    source: input.source,
    value: input.value,
  };
}

function dedupeEvidence(evidence: MarketProviderEvidence[]) {
  const byField = new Map<string, MarketProviderEvidence>();

  evidence.forEach((item) => {
    byField.set([item.field, item.node.nodeId, item.providerName].join("::"), item);
  });

  return [...byField.values()];
}

function normalizeCondition(value: string | undefined | null) {
  const normalized = (value ?? "").toLowerCase().trim();

  if (["nm", "near mint", "near-mint"].includes(normalized)) {
    return "NM";
  }

  if (["lp", "lightly played", "lightly-played"].includes(normalized)) {
    return "LP";
  }

  if (["mp", "moderately played", "moderately-played"].includes(normalized)) {
    return "MP";
  }

  if (["hp", "heavily played", "heavily-played"].includes(normalized)) {
    return "HP";
  }

  if (["dmg", "damaged"].includes(normalized)) {
    return "DMG";
  }

  return value ?? "ANY";
}

function createEvidenceNode(input: {
  context: MarketSnapshotRequestContext;
  snapshot: MarketSnapshot;
}): MarketEvidenceNode {
  const identity = input.snapshot.identityEvidence;
  const requestedCondition = input.context.condition ?? "NM";
  const providerCondition = identity?.condition ?? null;
  const conditionSpecific = Boolean(providerCondition);
  const condition = conditionSpecific
    ? normalizeCondition(providerCondition)
    : normalizeCondition(requestedCondition);
  const finish = identity?.finish ?? input.context.finish ?? "Unknown";
  const productIdentifier =
    identity?.productIdentifier ?? input.snapshot.providerId;

  return {
    assetId: input.context.cardIdentity,
    condition,
    conditionSpecific,
    finish,
    game: identity?.game ?? input.context.game,
    language: identity?.language ?? input.context.language,
    nodeId: [
      input.context.cardIdentity,
      input.context.printingId,
      input.context.variantId,
      finish,
      condition,
      productIdentifier,
    ].join("::"),
    printingId: input.context.printingId,
    productIdentifier,
    providerCondition: providerCondition ?? undefined,
    variantId: input.context.variantId,
  };
}

export function validateProviderEvidence(input: {
  context: MarketSnapshotRequestContext;
  snapshot: MarketSnapshot;
}): ProviderEvidenceValidationResult {
  const consistency = validateProviderMatch(input);
  const classifications = input.snapshot.prices.map((price) =>
    classifyProviderPrice({
      label: price.source,
      priceType: price.priceType,
    }),
  );
  const validationConfidence = Math.max(
    0,
    100 - consistency.rejectedFields.length * 25 - consistency.warnings.length * 5,
  );
  const report: MarketTruthReport = {
    matchedAsset: input.context.cardIdentity,
    matchedCondition: input.context.condition ?? "Unknown",
    matchedFinish: input.context.finish ?? "Unknown",
    matchedPriceType: classifications,
    matchedPrinting: input.context.printingId,
    rejectedFields: consistency.rejectedFields,
    valid: consistency.rejectedFields.length === 0,
    validationConfidence,
    warnings: consistency.warnings,
  };

  if (!report.valid) {
    return {
      evidence: [],
      report,
    };
  }

  const providerName =
    input.snapshot.marketIntelligence?.providerName ?? input.snapshot.providerId;
  const coverage =
    input.snapshot.marketIntelligence?.evidenceCoverage ?? validationConfidence;
  const providerSource = input.snapshot.sourceLabel;
  const node = createEvidenceNode(input);
  const priceEvidence = input.snapshot.prices
    .map((price, index) =>
      createEvidence({
        classification: classifications[index],
        confidence: Math.min(price.confidence, validationConfidence),
        coverage,
        field: price.priceType === "lowest_known" ? "lowestListing" : "marketPrice",
        node,
        providerName,
        rawObservations: input.snapshot.rawObservations,
        retrievedAt: input.snapshot.updatedAt,
        source: price.source,
        value: price.price,
      }),
    )
    .filter((evidence): evidence is MarketProviderEvidence => Boolean(evidence));
  const intelligence = input.snapshot.marketIntelligence;
  const intelligenceEvidence = intelligence
    ? [
        createEvidence({
          classification: "Market Price",
          confidence: Math.min(intelligence.marketConfidence, validationConfidence),
          coverage,
          field: "marketPrice",
          node,
          providerName,
          rawObservations: input.snapshot.rawObservations,
          retrievedAt: input.snapshot.updatedAt,
          source: providerSource,
          value: intelligence.marketPrice,
        }),
        createEvidence({
          classification: "Lowest Listing",
          confidence: Math.min(intelligence.marketConfidence, validationConfidence),
          coverage,
          field: "lowestListing",
          node,
          providerName,
          rawObservations: input.snapshot.rawObservations,
          retrievedAt: input.snapshot.updatedAt,
          source: providerSource,
          value: intelligence.lowestListing,
        }),
        createEvidence({
          classification: "Unknown",
          confidence: Math.min(intelligence.marketConfidence, validationConfidence),
          coverage,
          field: "listingCount",
          node,
          providerName,
          rawObservations: input.snapshot.rawObservations,
          retrievedAt: input.snapshot.updatedAt,
          source: providerSource,
          value: intelligence.listingCount,
        }),
        createEvidence({
          classification: "Recent Sale",
          confidence: Math.min(intelligence.marketConfidence, validationConfidence),
          coverage,
          field: "recentSales",
          node,
          providerName,
          rawObservations: input.snapshot.rawObservations,
          retrievedAt: input.snapshot.updatedAt,
          source: providerSource,
          value: intelligence.recentSalesCount,
        }),
        createEvidence({
          classification: "Unknown",
          confidence: Math.min(intelligence.marketConfidence, validationConfidence),
          coverage,
          field: "spread",
          node,
          providerName,
          rawObservations: input.snapshot.rawObservations,
          retrievedAt: input.snapshot.updatedAt,
          source: providerSource,
          value: intelligence.spread,
        }),
        createEvidence({
          classification: "Unknown",
          confidence: Math.min(intelligence.marketConfidence, validationConfidence),
          coverage,
          field: "liquidity",
          node,
          providerName,
          rawObservations: input.snapshot.rawObservations,
          retrievedAt: input.snapshot.updatedAt,
          source: providerSource,
          value: intelligence.liquidity,
        }),
        createEvidence({
          classification: "Unknown",
          confidence: Math.min(intelligence.marketConfidence, validationConfidence),
          coverage,
          field: "salesVelocity",
          node,
          providerName,
          rawObservations: input.snapshot.rawObservations,
          retrievedAt: input.snapshot.updatedAt,
          source: providerSource,
          value: intelligence.salesVelocity,
        }),
        createEvidence({
          classification: "Unknown",
          confidence: Math.min(intelligence.marketConfidence, validationConfidence),
          coverage,
          field: "volatility",
          node,
          providerName,
          rawObservations: input.snapshot.rawObservations,
          retrievedAt: input.snapshot.updatedAt,
          source: providerSource,
          value: intelligence.volatility,
        }),
        createEvidence({
          classification: "Unknown",
          confidence: Math.min(intelligence.marketConfidence, validationConfidence),
          coverage,
          field: "marketConfidence",
          node,
          providerName,
          rawObservations: input.snapshot.rawObservations,
          retrievedAt: input.snapshot.updatedAt,
          source: providerSource,
          value: intelligence.marketConfidence,
        }),
      ].filter((evidence): evidence is MarketProviderEvidence => Boolean(evidence))
    : [];

  return {
    report,
    evidence: dedupeEvidence([...priceEvidence, ...intelligenceEvidence]),
  };
}
