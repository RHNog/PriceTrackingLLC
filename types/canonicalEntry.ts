import type { Card } from "@/types/card";

export interface CanonicalEntry {
  canonicalIdentity: string;
  aliases: string[];
  nicknames: string[];
  abbreviations: string[];
  game: Card["game"];
  confidenceWeight: number;
  priority: number;
  communityPopularity: number;
  professionalUsage: number;
  futureSearchFrequency: number;
  futureUserWeight: number;
  notes?: string;
  futureMetadata?: Record<string, string>;
}
