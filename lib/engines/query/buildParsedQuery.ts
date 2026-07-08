import { scoreParsedQuery } from "@/lib/engines/query/scoreParsedQuery";
import type { ParsedQuery } from "@/types/parsedQuery";
import type { QueryToken } from "@/types/queryToken";

const constraintTokenTypes = new Set<NonNullable<QueryToken["type"]>>([
  "collectorNumber",
  "condition",
  "finish",
  "frame",
  "game",
  "grading",
  "language",
  "product",
  "promo",
  "rarity",
  "set",
  "setCode",
  "treatment",
  "variant",
]);

function findValue(tokens: QueryToken[], type: QueryToken["type"]) {
  return tokens.find((token) => token.type === type)?.value;
}

export function buildParsedQuery(tokens: QueryToken[]): ParsedQuery {
  const identityTokens = tokens
    .filter((token) => token.type === "unknown")
    .map((token) => token.normalized);
  const constraintTokens = tokens
    .filter((token) => constraintTokenTypes.has(token.type))
    .map((token) => token.normalized);
  const knowledgeMatches = tokens.flatMap((token) =>
    token.knowledgeMatch ? [token.knowledgeMatch] : [],
  );
  const queryWithoutConfidence = {
    cardName: identityTokens.join(" "),
    collectorNumber: findValue(tokens, "collectorNumber"),
    condition: findValue(tokens, "condition"),
    finish: findValue(tokens, "finish"),
    frame: findValue(tokens, "frame"),
    game: findValue(tokens, "game") as ParsedQuery["game"],
    grading: findValue(tokens, "grading"),
    identityTokens,
    knowledgeMatches,
    language: findValue(tokens, "language"),
    product: findValue(tokens, "product"),
    promo: findValue(tokens, "promo"),
    rarity: findValue(tokens, "rarity"),
    constraintTokens,
    remainingTokens: identityTokens,
    set: findValue(tokens, "set"),
    setCode: findValue(tokens, "setCode"),
    treatment: findValue(tokens, "treatment"),
    variant: findValue(tokens, "variant"),
  };
  const confidenceByField = scoreParsedQuery(queryWithoutConfidence, tokens);

  return {
    ...queryWithoutConfidence,
    confidence: confidenceByField.overall,
    confidenceByField,
  };
}
