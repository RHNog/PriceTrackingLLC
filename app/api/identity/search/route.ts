import { NextResponse } from "next/server";
import { searchIdentityCardsWithDiagnostics } from "@/lib/engines/search/searchIdentityCards";
import { ScryfallProvider } from "@/lib/providers/identity/ScryfallProvider";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";
  const provider = new ScryfallProvider();
  const response = await searchIdentityCardsWithDiagnostics(query, provider);

  return NextResponse.json({
    intent: response.intent,
    results: response.results,
  });
}
