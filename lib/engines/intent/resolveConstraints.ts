import type { Constraint } from "@/types/constraint";
import type { ParsedQuery } from "@/types/parsedQuery";

const constraintFields: Array<keyof ParsedQuery> = [
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
];

export function resolveConstraints(parsedQuery: ParsedQuery): Constraint[] {
  return constraintFields.flatMap((field) => {
    const value = parsedQuery[field];

    if (typeof value !== "string" || !value) {
      return [];
    }
    const knowledgeMatch = parsedQuery.knowledgeMatches.find(
      (match) => match.category === field && match.canonical === value,
    );

    return {
      confidence: knowledgeMatch?.confidence,
      field,
      label: field,
      matchType: knowledgeMatch?.matchType,
      sourceToken: knowledgeMatch?.sourceToken,
      value,
    };
  });
}
