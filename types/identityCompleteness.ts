export type IdentityCompletenessField =
  | "Artwork"
  | "Printing"
  | "Collector Number"
  | "Treatment"
  | "Language"
  | "Market";

export type IdentityCompletenessMetric = {
  field: IdentityCompletenessField;
  percent: number | null;
  status: "Complete" | "Partial" | "Missing" | "Not Applicable";
};

export type IdentityCompleteness = {
  metrics: IdentityCompletenessMetric[];
  overallPercent: number;
};

export type IdentityMappingAudit = {
  canonicalFields: string[];
  derivedFields: string[];
  ignoredFields: string[];
  mappedFields: string[];
  treatmentSource: string;
};
