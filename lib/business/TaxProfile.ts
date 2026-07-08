export interface TaxProfile {
  taxModel: "included" | "excluded" | "not_collected";
  estimatedTaxPercent: number;
}

