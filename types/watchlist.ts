export interface Watchlist {
  id: string;
  name: string;
  description: string;
  type: "system" | "manual";
  enabled: boolean;
  cardCount: number;
  opportunities: number;
  lastUpdated: string;
  color: string;
  icon: string;
}
