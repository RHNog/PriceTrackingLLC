import type { Card } from "@/types/card";
import type { KnowledgeMatch } from "@/types/knowledgeMatch";

export interface ParsedQuery {
  cardName: string;
  game?: Card["game"];
  set?: string;
  setCode?: string;
  collectorNumber?: string;
  language?: string;
  finish?: string;
  frame?: string;
  condition?: string;
  variant?: string;
  treatment?: string;
  product?: string;
  promo?: string;
  rarity?: string;
  grading?: string;
  knowledgeMatches: KnowledgeMatch[];
  identityTokens: string[];
  constraintTokens: string[];
  remainingTokens: string[];
  confidence: number;
  confidenceByField: {
    condition: number;
    finish: number;
    identity: number;
    language: number;
    overall: number;
    set: number;
  };
}
