export interface MarketContext {
  country: string;
  region: string;
  currency: string;
  marketplace: string;
  language: string;
  taxModel: string;
  shippingModel: string;
}

export const defaultMarketContext: MarketContext = {
  country: "United States",
  region: "North America",
  currency: "USD",
  marketplace: "Scryfall Market Provider",
  language: "English",
  taxModel: "Standard US estimate",
  shippingModel: "Domestic single-card estimate",
};

// TODO: Brazil, Europe, Japan, Canada, Australia.
// TODO: Regional valuation, currency normalization, marketplace selection.
// TODO: Shipping assumptions, tax models, import costs, regional liquidity.
// TODO: Regional demand, format popularity, and market-specific multipliers.
