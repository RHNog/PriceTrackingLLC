export interface Watchlist {
  name: string;
  cards: number;
  alerts: number;
  lastUpdated: string;
}

export const mockWatchlists: Watchlist[] = [
  {
    name: "Reserved List",
    cards: 82,
    alerts: 12,
    lastUpdated: "2 min ago",
  },
  {
    name: "Modern Staples",
    cards: 134,
    alerts: 18,
    lastUpdated: "4 min ago",
  },
  {
    name: "One Piece",
    cards: 241,
    alerts: 39,
    lastUpdated: "1 min ago",
  },
  {
    name: "Pokemon",
    cards: 189,
    alerts: 24,
    lastUpdated: "6 min ago",
  },
];
