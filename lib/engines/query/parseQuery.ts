import { classifyTokens } from "@/lib/engines/query/classifyTokens";
import { resolveKnowledge } from "@/lib/engines/query/resolveKnowledge";
import { resolveQuery } from "@/lib/engines/query/resolveQuery";
import { tokenizeQuery } from "@/lib/engines/query/tokenizeQuery";

export function parseQuery(raw: string) {
  // TODO: OCR input.
  // TODO: Barcode parsing.
  // TODO: Voice parsing.
  // TODO: AI-assisted queries and natural language search.
  // TODO: Misspelling correction and synonym expansion.
  // TODO: Marketplace-specific terminology.
  return resolveQuery(classifyTokens(resolveKnowledge(tokenizeQuery(raw))));
}
