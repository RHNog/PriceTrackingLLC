import type { QueryToken } from "@/types/queryToken";

function classifyUnknownToken(token: QueryToken): QueryToken {
  if (token.type !== "unknown") {
    return token;
  }

  if (/^\d+[a-z]?$/i.test(token.normalized)) {
    return {
      ...token,
      type: "collectorNumber",
      value: token.normalized,
    };
  }

  return token;
}

export function classifyTokens(tokens: QueryToken[]) {
  return tokens.map(classifyUnknownToken);
}
