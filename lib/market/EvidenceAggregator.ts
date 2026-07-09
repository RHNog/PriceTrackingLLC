import {
  getEvidencePriority,
  type ProviderPriorityConfig,
} from "@/lib/market/EvidencePriority";
import type { MarketProviderEvidence } from "@/lib/market/MarketSnapshot";
import { getFieldFreshness } from "@/lib/market/MarketFreshness";
import { getMarketRefreshPolicy } from "@/lib/market/MarketRefreshPolicy";

function sameEvidenceSource(
  first: MarketProviderEvidence,
  second: MarketProviderEvidence,
) {
  return (
    first.field === second.field &&
    first.node.nodeId === second.node.nodeId &&
    first.providerName === second.providerName &&
    first.classification === second.classification &&
    first.source === second.source
  );
}

function isFresher(
  incoming: MarketProviderEvidence,
  existing: MarketProviderEvidence,
) {
  return (
    new Date(incoming.retrievedAt).getTime() >
    new Date(existing.retrievedAt).getTime()
  );
}

function isExpired(evidence: MarketProviderEvidence, now = new Date()) {
  const policy = getMarketRefreshPolicy(evidence.field);
  const retrievedAtMs = new Date(evidence.retrievedAt).getTime();

  if (Number.isNaN(retrievedAtMs)) {
    return true;
  }

  return (
    getFieldFreshness({
      expiresAt: new Date(retrievedAtMs + policy.ttlMs).toISOString(),
      lastRefresh: evidence.retrievedAt,
      now,
    }) === "Expired"
  );
}

function hasHigherPriority(input: {
  existing: MarketProviderEvidence;
  incoming: MarketProviderEvidence;
  priorityConfig?: ProviderPriorityConfig;
}) {
  return (
    getEvidencePriority({
      field: input.incoming.field,
      providerName: input.incoming.providerName,
      priorityConfig: input.priorityConfig,
    }) >
    getEvidencePriority({
      field: input.existing.field,
      providerName: input.existing.providerName,
      priorityConfig: input.priorityConfig,
    })
  );
}

export class EvidenceAggregator {
  constructor(
    private readonly priorityConfig = undefined as
      | ProviderPriorityConfig
      | undefined,
  ) {}

  merge(input: {
    existingEvidence: MarketProviderEvidence[];
    incomingEvidence: MarketProviderEvidence[];
    now?: Date;
  }) {
    const merged = [...input.existingEvidence];

    input.incomingEvidence.forEach((incoming) => {
      const existingIndex = merged.findIndex((existing) =>
        sameEvidenceSource(existing, incoming),
      );

      if (existingIndex === -1) {
        merged.push(incoming);
        return;
      }

      const existing = merged[existingIndex];

      if (
        isFresher(incoming, existing) ||
        hasHigherPriority({
          existing,
          incoming,
          priorityConfig: this.priorityConfig,
        }) ||
        isExpired(existing, input.now)
      ) {
        merged[existingIndex] = incoming;
      }
    });

    return merged;
  }
}

export const evidenceAggregator = new EvidenceAggregator();
