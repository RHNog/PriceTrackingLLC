export interface KnowledgeMatch {
  entryId?: string;
  canonical: string;
  category: string;
  matchedAlias: string;
  sourceToken: string;
  matchType: "exact" | "alias" | "prefix" | "partial" | "unknown";
  confidence: number;
}
