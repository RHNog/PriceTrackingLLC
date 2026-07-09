import { NextResponse } from "next/server";
import {
  marketRefreshScheduler,
  type MarketRepositoryReadResult,
} from "@/lib/market/MarketRefreshScheduler";
import type { MarketIntelligenceRepositorySnapshot } from "@/lib/market/MarketSnapshot";
import type { MarketPrice } from "@/types/marketPrice";
import type { MarketSnapshot } from "@/types/marketSnapshot";

function createPrices(snapshot: MarketIntelligenceRepositorySnapshot): MarketPrice[] {
  const base = {
    cardId: snapshot.identity.printingId,
    currency: "USD",
    finish: snapshot.identity.finish,
    printingId: snapshot.identity.printingId,
    updatedAt: snapshot.metadata.updatedAt,
    variantId: snapshot.identity.variantId,
  };
  const prices: MarketPrice[] = [];

  if (snapshot.marketPrice !== null) {
    prices.push({
      ...base,
      id: `repository:${snapshot.identity.printingId}:${snapshot.identity.variantId}:market`,
      confidence: snapshot.marketConfidence ?? 60,
      price: snapshot.marketPrice,
      priceType: "market_estimate",
      condition: snapshot.evidenceSelections?.marketPrice?.provenance?.node.condition,
      conditionSpecific:
        snapshot.evidenceSelections?.marketPrice?.provenance?.node
          .conditionSpecific,
      providerId:
        snapshot.evidenceSelections?.marketPrice?.selectedProvider ??
        snapshot.providerId,
      source:
        snapshot.evidenceSelections?.marketPrice?.provenance?.source ??
        "Market Intelligence Repository",
    });
  }

  if (snapshot.lowestListing !== null) {
    prices.push({
      ...base,
      id: `repository:${snapshot.identity.printingId}:${snapshot.identity.variantId}:lowest`,
      confidence: snapshot.marketConfidence ?? 60,
      price: snapshot.lowestListing,
      priceType: "lowest_known",
      condition:
        snapshot.evidenceSelections?.lowestListing?.provenance?.node.condition,
      conditionSpecific:
        snapshot.evidenceSelections?.lowestListing?.provenance?.node
          .conditionSpecific,
      providerId:
        snapshot.evidenceSelections?.lowestListing?.selectedProvider ??
        snapshot.providerId,
      source:
        snapshot.evidenceSelections?.lowestListing?.provenance?.source ??
        "Market Intelligence Repository",
    });
  }

  return prices;
}

function toApiMarketSnapshot(
  snapshot: MarketIntelligenceRepositorySnapshot,
  diagnostics?: MarketRepositoryReadResult["diagnostics"],
): MarketSnapshot {
  const prices = createPrices(snapshot);
  const selectedEvidence =
    snapshot.evidenceSelections?.marketPrice ??
    snapshot.evidenceSelections?.lowestListing ??
    null;
  const selectedNode = selectedEvidence?.provenance?.node ?? null;

  return {
    printingId: snapshot.identity.printingId,
    variantId: snapshot.identity.variantId,
    prices,
    providerId: snapshot.providerId,
    updatedAt: snapshot.metadata.updatedAt,
    sourceLabel: "Market Intelligence Repository",
    marketIntelligence: {
      apiStatus: "LIVE",
      demandMomentum: snapshot.salesVelocity ?? 0,
      directLow: null,
      evidenceCoverage: snapshot.marketConfidence ?? 0,
      healthStatus: "HEALTHY",
      inventoryHealth: snapshot.listingCount ?? 0,
      lastSynchronizedAt: snapshot.metadata.lastRefresh,
      latencyMs: null,
      liquidity: snapshot.liquidity ?? 0,
      listingCount: snapshot.listingCount ?? 0,
      lowestListing: snapshot.lowestListing,
      marketConfidence: snapshot.marketConfidence ?? 0,
      marketPrice: snapshot.marketPrice,
      marketStability: Math.max(0, 100 - (snapshot.volatility ?? 0)),
      priceHistory: [],
      providerId: snapshot.providerId,
      providerName:
        snapshot.evidenceSelections?.marketPrice?.selectedProvider ??
        snapshot.providerId,
      recentSalesCount: snapshot.recentSales ?? 0,
      salesVelocity: snapshot.salesVelocity ?? 0,
      spread: snapshot.spread ?? 0,
      trend: "Unknown",
      volatility: snapshot.volatility ?? 0,
    },
    marketEvidenceDiagnostics: {
      conditionSpecific: selectedNode?.conditionSpecific ?? false,
      coverage: diagnostics?.coverage.map((entry) => ({
        domainName: entry.domainName,
        freshness: entry.freshness,
        status: entry.status,
      })),
      evidenceSource:
        selectedEvidence?.projection?.evidenceSource ??
        selectedEvidence?.provenance?.source ??
        null,
      evidenceNodeId: selectedNode?.nodeId ?? null,
      fallbackReason:
        selectedEvidence?.fallbackReason ??
        "No selected market evidence was available.",
      fallbackUsed: !(selectedNode?.conditionSpecific ?? false),
      finish: selectedNode?.finish ?? snapshot.identity.finish,
      mergeResult: diagnostics?.mergeResult,
      missingEvidence: diagnostics?.missingEvidence,
      providerCondition: selectedNode?.providerCondition ?? null,
      providersQueried: diagnostics?.providersQueried,
      providersSkipped: diagnostics?.providersSkipped,
      projectionUsed: selectedEvidence?.projection?.projectionUsed ?? false,
      requestedCondition: snapshot.identity.condition,
      requestedUiField:
        selectedEvidence?.projection?.requestedUiField ?? selectedEvidence?.field ?? null,
      resolvedEvidenceDomain:
        selectedEvidence?.projection?.resolvedEvidenceDomain ?? null,
      selectedProvider: selectedEvidence?.selectedProvider ?? null,
    },
    priceMissing: prices.length === 0,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cardName = searchParams.get("cardName") ?? "";
  const condition = searchParams.get("condition") ?? "NM";
  const finish = searchParams.get("finish") ?? "Unknown";
  const game = searchParams.get("game") ?? "";
  const printingId = searchParams.get("printingId") ?? "";
  const variantId = searchParams.get("variantId") ?? "";

  if (!printingId || !variantId) {
    return NextResponse.json({
      printingId,
      variantId,
      prices: [],
      providerId: "scryfall-market",
      updatedAt: new Date().toISOString(),
      sourceLabel: "Scryfall Daily Market Estimate",
      errorMessage: "Missing printingId or variantId.",
      priceMissing: true,
    });
  }

  const result = await marketRefreshScheduler.getSnapshot({
    cardIdentity: cardName || printingId,
    condition,
    finish,
    game,
    printingId,
    variantId,
  });

  return NextResponse.json(
    toApiMarketSnapshot(result.repositorySnapshot, result.diagnostics),
  );
}
