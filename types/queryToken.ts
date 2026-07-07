import type { QueryTokenType } from "@/types/queryDictionary";
import type { KnowledgeMatch } from "@/types/knowledgeMatch";

export interface QueryToken {
  category?: string;
  knowledgeMatch?: KnowledgeMatch;
  raw: string;
  normalized: string;
  type: QueryTokenType;
  value?: string;
}
