import type { EvidenceDomainId } from "@/lib/market/ontology/EvidenceDomain";
import type { MarketSnapshotField } from "@/lib/market/MarketSnapshotMetadata";

export interface EvidenceQuestion {
  domainId: EvidenceDomainId;
  field: MarketSnapshotField;
  question: string;
}

export const evidenceQuestions: EvidenceQuestion[] = [
  {
    field: "marketPrice",
    domainId: "variant-valuation",
    question: "What is this selected variant worth?",
  },
  {
    field: "lowestListing",
    domainId: "listing-intelligence",
    question: "What is the lowest live listing?",
  },
  {
    field: "listingCount",
    domainId: "listing-intelligence",
    question: "How much live listing depth exists?",
  },
  {
    field: "recentSales",
    domainId: "transaction-intelligence",
    question: "What completed sales support demand?",
  },
  {
    field: "spread",
    domainId: "listing-intelligence",
    question: "How wide is the active listing spread?",
  },
  {
    field: "liquidity",
    domainId: "market-liquidity",
    question: "How liquid is this market?",
  },
  {
    field: "salesVelocity",
    domainId: "transaction-intelligence",
    question: "How quickly is the asset selling?",
  },
  {
    field: "volatility",
    domainId: "volatility",
    question: "How unstable is the price?",
  },
  {
    field: "marketConfidence",
    domainId: "market-confidence",
    question: "How reliable is the market evidence?",
  },
  {
    field: "providerHealth",
    domainId: "provider-metadata",
    question: "Is the provider healthy?",
  },
  {
    field: "providerCapabilities",
    domainId: "provider-metadata",
    question: "What evidence can this provider supply?",
  },
  {
    field: "cardMetadata",
    domainId: "provider-metadata",
    question: "What provider metadata supports this card?",
  },
  {
    field: "printingMetadata",
    domainId: "provider-metadata",
    question: "What provider metadata supports this printing?",
  },
];

export function getEvidenceQuestionForField(field: MarketSnapshotField) {
  return evidenceQuestions.find((question) => question.field === field) ?? null;
}
