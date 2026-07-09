export type EvidenceDomainId =
  | "variant-valuation"
  | "listing-intelligence"
  | "transaction-intelligence"
  | "historical-pricing"
  | "inventory-intelligence"
  | "price-trend"
  | "volatility"
  | "market-liquidity"
  | "market-confidence"
  | "provider-metadata";

export interface EvidenceDomain {
  description: string;
  examples: string[];
  id: EvidenceDomainId;
  name: string;
  owns: string[];
}

export const evidenceDomains: EvidenceDomain[] = [
  {
    id: "variant-valuation",
    name: "Variant Valuation",
    description:
      "Condition-, finish-, and language-specific valuation for a selected asset variant.",
    owns: [
      "condition-specific valuation",
      "finish-specific valuation",
      "language-specific valuation",
      "provider averages",
      "historical averages",
      "current provider price",
    ],
    examples: ["JustTCG variant price"],
  },
  {
    id: "listing-intelligence",
    name: "Listing Intelligence",
    description:
      "Live marketplace listing depth, seller competition, listing freshness, and listing spread.",
    owns: [
      "live listings",
      "lowest listing",
      "seller competition",
      "inventory depth",
      "listing spread",
      "shipping",
      "quantity",
      "listing freshness",
    ],
    examples: ["Future Cardmarket listings", "Future TCGplayer listings"],
  },
  {
    id: "transaction-intelligence",
    name: "Transaction Intelligence",
    description:
      "Completed sales, auction results, and buyer behavior from transaction-capable providers.",
    owns: [
      "completed sales",
      "average sale",
      "median sale",
      "auction results",
      "buyer behavior",
    ],
    examples: ["Future eBay completed sales", "Future Cardmarket sales"],
  },
  {
    id: "historical-pricing",
    name: "Historical Pricing",
    description:
      "Provider or repository price history and moving averages over time.",
    owns: [
      "price history",
      "moving averages",
      "historical trend",
      "provider history",
      "repository history",
    ],
    examples: ["JustTCG price history"],
  },
  {
    id: "inventory-intelligence",
    name: "Inventory Intelligence",
    description:
      "Marketplace inventory depth and supply-side availability signals.",
    owns: ["inventory depth", "quantity", "seller supply", "stock pressure"],
    examples: ["Future listing-capable provider quantity"],
  },
  {
    id: "price-trend",
    name: "Price Trend",
    description:
      "Directional market movement derived from price history or provider trend statistics.",
    owns: ["trend metrics", "trend slope", "movement direction"],
    examples: ["JustTCG trend slope"],
  },
  {
    id: "volatility",
    name: "Volatility",
    description:
      "Dispersion and instability statistics attached to market prices.",
    owns: [
      "standard deviation",
      "coefficient of variation",
      "IQR",
      "trend slope",
      "provider statistics",
    ],
    examples: ["JustTCG coefficient of variation"],
  },
  {
    id: "market-liquidity",
    name: "Market Liquidity",
    description:
      "Ability to enter or exit a position, ideally supported by listing and transaction evidence.",
    owns: ["liquidity", "sell-through strength", "market depth"],
    examples: ["Future listing and transaction consensus"],
  },
  {
    id: "market-confidence",
    name: "Market Confidence",
    description:
      "Confidence in market evidence based on freshness, coverage, provider health, and support depth.",
    owns: ["market confidence", "evidence completeness", "freshness confidence"],
    examples: ["Provider-backed confidence contribution"],
  },
  {
    id: "provider-metadata",
    name: "Provider Metadata",
    description:
      "Provider health, authentication, latency, usage, coverage, and synchronization metadata.",
    owns: [
      "provider health",
      "provider capabilities",
      "provider latency",
      "usage metadata",
      "last synchronization",
    ],
    examples: ["JustTCG usage metadata"],
  },
];

export function getEvidenceDomain(id: EvidenceDomainId) {
  return evidenceDomains.find((domain) => domain.id === id) ?? null;
}
