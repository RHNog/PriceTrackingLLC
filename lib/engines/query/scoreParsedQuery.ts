import type { ParsedQuery } from "@/types/parsedQuery";
import type { QueryToken } from "@/types/queryToken";

function hasValue(value?: string) {
  return value ? 100 : 0;
}

export function scoreParsedQuery(
  parsedQuery: Omit<ParsedQuery, "confidence" | "confidenceByField">,
  tokens: QueryToken[],
) {
  const tokenCount = Math.max(tokens.length, 1);
  const knownCount = tokens.filter((token) => token.type !== "unknown").length;
  const identityConfidence = parsedQuery.cardName ? 70 : 0;
  const overall = Math.round(
    ((knownCount + parsedQuery.remainingTokens.length * 0.6) / tokenCount) * 100,
  );

  return {
    condition: hasValue(parsedQuery.condition),
    finish: hasValue(parsedQuery.finish || parsedQuery.frame || parsedQuery.treatment),
    identity: identityConfidence,
    language: hasValue(parsedQuery.language),
    overall,
    set: hasValue(parsedQuery.set || parsedQuery.setCode),
  };
}
