import type { PriceType } from "@/types/marketPrice";

export type ProviderPriceClassification =
  | "Variant Valuation"
  | "Market Price"
  | "Lowest Listing"
  | "Lowest NM Listing"
  | "Direct Price"
  | "Average Sale"
  | "Recent Sale"
  | "Suggested Price"
  | "Unknown";

export function classifyProviderPrice(input: {
  label?: string;
  priceType?: PriceType;
}): ProviderPriceClassification {
  const label = input.label?.toLowerCase() ?? "";

  if (input.priceType === "variant_valuation" || label.includes("variant valuation")) {
    return "Variant Valuation";
  }

  if (input.priceType === "market_estimate" || label.includes("market")) {
    return "Market Price";
  }

  if (label.includes("near mint") || label.includes(" nm ")) {
    return "Lowest NM Listing";
  }

  if (input.priceType === "lowest_known" || label.includes("lowest")) {
    return "Lowest Listing";
  }

  if (label.includes("direct")) {
    return "Direct Price";
  }

  if (label.includes("average")) {
    return "Average Sale";
  }

  if (input.priceType === "recent_sale" || label.includes("recent")) {
    return "Recent Sale";
  }

  if (label.includes("suggested")) {
    return "Suggested Price";
  }

  return "Unknown";
}
