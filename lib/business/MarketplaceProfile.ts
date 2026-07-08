export interface MarketplaceProfile {
  id: string;
  name: string;
  marketplaceFeePercent: number;
  paymentFeePercent: number;
  typicalShippingCost: number;
  typicalPackagingCost: number;
  fixedTransactionCost: number;
  assumptions: string[];
}

export const marketplaceProfiles: MarketplaceProfile[] = [
  {
    id: "tcgplayer",
    name: "TCGplayer",
    marketplaceFeePercent: 10.25,
    paymentFeePercent: 2.5,
    typicalShippingCost: 4.5,
    typicalPackagingCost: 0.75,
    fixedTransactionCost: 0.3,
    assumptions: ["Online sale", "Tracked shipping for higher-value cards"],
  },
  {
    id: "ebay",
    name: "eBay",
    marketplaceFeePercent: 13.25,
    paymentFeePercent: 0,
    typicalShippingCost: 5,
    typicalPackagingCost: 0.9,
    fixedTransactionCost: 0.3,
    assumptions: ["Final value fee includes payment processing"],
  },
  {
    id: "cardtrader",
    name: "CardTrader",
    marketplaceFeePercent: 5,
    paymentFeePercent: 3,
    typicalShippingCost: 4,
    typicalPackagingCost: 0.75,
    fixedTransactionCost: 0.25,
    assumptions: ["Marketplace order", "Standard seller fulfillment"],
  },
  {
    id: "facebook-marketplace",
    name: "Facebook Marketplace",
    marketplaceFeePercent: 0,
    paymentFeePercent: 3,
    typicalShippingCost: 0,
    typicalPackagingCost: 0.25,
    fixedTransactionCost: 0,
    assumptions: ["Local meetup or peer payment"],
  },
  {
    id: "discord",
    name: "Discord",
    marketplaceFeePercent: 0,
    paymentFeePercent: 3,
    typicalShippingCost: 4,
    typicalPackagingCost: 0.75,
    fixedTransactionCost: 0,
    assumptions: ["Community sale", "Payment fee depends on method"],
  },
  {
    id: "local-cash",
    name: "Local Cash",
    marketplaceFeePercent: 0,
    paymentFeePercent: 0,
    typicalShippingCost: 0,
    typicalPackagingCost: 0,
    fixedTransactionCost: 0,
    assumptions: ["Cash transaction", "No shipping"],
  },
  {
    id: "convention-sales",
    name: "Convention Sales",
    marketplaceFeePercent: 3,
    paymentFeePercent: 2.9,
    typicalShippingCost: 0,
    typicalPackagingCost: 0.2,
    fixedTransactionCost: 1,
    assumptions: ["Booth overhead amortized per transaction"],
  },
  {
    id: "direct-store",
    name: "Direct Store",
    marketplaceFeePercent: 0,
    paymentFeePercent: 2.9,
    typicalShippingCost: 0,
    typicalPackagingCost: 0.2,
    fixedTransactionCost: 0.3,
    assumptions: ["Direct buyer", "Card-present or invoice payment"],
  },
];

