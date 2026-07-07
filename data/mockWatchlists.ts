import type { Watchlist } from "@/types/watchlist";

export const mockWatchlists: Watchlist[] = [
  {
    id: "arbitrage-br-usa",
    name: "Arbitrage BR → USA",
    description:
      "Cards profitable when buying in Brazil and selling in the United States.",
    type: "system",
    enabled: true,
    cardCount: 0,
    opportunities: 0,
    lastUpdated: "Now",
    color: "emerald",
    icon: "brazil",
  },
  {
    id: "arbitrage-usa-br",
    name: "Arbitrage USA → BR",
    description:
      "Cards profitable when buying in the United States and selling in Brazil.",
    type: "system",
    enabled: true,
    cardCount: 0,
    opportunities: 0,
    lastUpdated: "Now",
    color: "blue",
    icon: "usa",
  },
  {
    id: "spikes",
    name: "Spikes",
    description:
      "Cards experiencing unusual price movement and market activity.",
    type: "system",
    enabled: true,
    cardCount: 0,
    opportunities: 0,
    lastUpdated: "Now",
    color: "orange",
    icon: "spike",
  },
  {
    id: "cards-to-watch",
    name: "Manual Watchlists",
    description: "Default manual watchlist for user-selected cards.",
    type: "manual",
    enabled: true,
    cardCount: 0,
    opportunities: 0,
    lastUpdated: "Now",
    color: "purple",
    icon: "watch",
  },
];
