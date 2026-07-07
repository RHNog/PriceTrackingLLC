import type { Card } from "@/types/card";

export interface IdentityProvider {
  readonly id: string;
  readonly name: string;
  searchCards(query: string): Promise<Card[]>;
  getCard(id: string): Promise<Card | null>;
}
