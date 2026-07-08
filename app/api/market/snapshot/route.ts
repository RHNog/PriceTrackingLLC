import { NextResponse } from "next/server";
import { TCGplayerIntelligenceProvider } from "@/lib/providers/market/TCGplayerIntelligenceProvider";
import { ScryfallMarketProvider } from "@/lib/providers/market/ScryfallMarketProvider";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
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

  const provider = new TCGplayerIntelligenceProvider();
  const snapshot = await provider.getMarketSnapshot(printingId, variantId);

  if (snapshot.prices.length > 0 && !snapshot.priceMissing) {
    return NextResponse.json(snapshot);
  }

  const fallbackProvider = new ScryfallMarketProvider();
  const fallbackSnapshot = await fallbackProvider.getMarketSnapshot(
    printingId,
    variantId,
  );

  return NextResponse.json({
    ...fallbackSnapshot,
    errorMessage: fallbackSnapshot.errorMessage ?? snapshot.errorMessage,
    marketIntelligence: snapshot.marketIntelligence,
  });
}
