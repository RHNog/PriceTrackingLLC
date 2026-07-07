import type { Card } from "@/types/card";

export interface CardIdentity {
  id: string;
  name: string;
  game: Card["game"];
  printings: Card[];
}
