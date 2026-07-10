import { NextResponse } from "next/server";
import { IdentityOrchestrator } from "@/lib/engines/identity/IdentityOrchestrator";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";
  const response = await new IdentityOrchestrator().search(query);

  return NextResponse.json({
    intent: response.intent,
    message: response.message,
    orchestrationDiagnostics: response.orchestrationDiagnostics,
    results: response.results,
    status: response.status,
  });
}
