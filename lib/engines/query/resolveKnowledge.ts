import { universalKnowledgeBase } from "@/knowledge";
import { matchKnowledgeEntry } from "@/lib/engines/query/matchKnowledgeEntry";
import { normalizeQuery } from "@/lib/engines/query/normalizeQuery";
import { resolvePartialKnowledge } from "@/lib/engines/query/resolvePartialKnowledge";
import type { KnowledgeEntry } from "@/types/knowledgeEntry";
import type { KnowledgeMatch } from "@/types/knowledgeMatch";
import type { QueryContext } from "@/types/queryContext";
import type { QueryToken } from "@/types/queryToken";

const defaultContext: QueryContext = {
  knowledgeBase: universalKnowledgeBase,
};

function getAliasTokens(entry: KnowledgeEntry) {
  return [entry.canonical, ...entry.aliases].map((alias) =>
    normalizeQuery(alias).split(" "),
  );
}

function findKnowledgeMatch(
  tokens: string[],
  startIndex: number,
  context: QueryContext,
) {
  const matches = context.knowledgeBase.flatMap((entry) =>
    getAliasTokens(entry).map((aliasTokens) => {
      const sourceToken = tokens
        .slice(startIndex, startIndex + aliasTokens.length)
        .join(" ");

      return {
        aliasTokens,
        entry,
        knowledgeMatch: matchKnowledgeEntry(sourceToken, entry),
      };
    }),
  );

  return matches
    .filter(
      (
        match,
      ): match is {
        aliasTokens: string[];
        entry: KnowledgeEntry;
        knowledgeMatch: KnowledgeMatch;
      } =>
        Boolean(match.knowledgeMatch) &&
        match.aliasTokens.every(
          (token, offset) => tokens[startIndex + offset] === token,
        ),
    )
    .sort((first, second) => second.aliasTokens.length - first.aliasTokens.length)[0];
}

function createKnowledgeToken(
  match: KnowledgeMatch,
  raw: string,
  normalized: string,
): QueryToken {
  return {
    category: match.category,
    knowledgeMatch: match,
    normalized,
    raw,
    type: match.category === "setCode" ? "setCode" : match.category,
    value: match.canonical,
  } as QueryToken;
}

export function resolveKnowledge(
  tokens: string[],
  context: QueryContext = defaultContext,
) {
  const resolvedTokens: QueryToken[] = [];
  let index = 0;

  while (index < tokens.length) {
    const match = findKnowledgeMatch(tokens, index, context);

    if (match) {
      resolvedTokens.push(
        createKnowledgeToken(
          match.knowledgeMatch,
          match.aliasTokens.join(" "),
          match.aliasTokens.join(" "),
        ),
      );
      index += match.aliasTokens.length;
    } else {
      const partialMatch = resolvePartialKnowledge(
        tokens[index],
        context.knowledgeBase,
      );

      if (partialMatch) {
        resolvedTokens.push(
          createKnowledgeToken(partialMatch, tokens[index], tokens[index]),
        );
      } else {
        resolvedTokens.push({
          normalized: tokens[index],
          raw: tokens[index],
          type: "unknown",
        });
      }
      index += 1;
    }
  }

  return resolvedTokens;
}
