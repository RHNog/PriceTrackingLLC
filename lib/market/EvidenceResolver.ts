import {
  getEvidencePriority,
  type ProviderPriorityConfig,
} from "@/lib/market/EvidencePriority";
import {
  evidenceFallbackChains,
  getEvidenceFallbackChain,
  type EvidenceFallbackConfig,
} from "@/lib/market/EvidenceFallback";
import type { EvidenceProvenance } from "@/lib/market/EvidenceProvenance";
import type {
  EvidenceSelection,
  EvidenceSelectionRecord,
} from "@/lib/market/EvidenceSelection";
import type { MarketProviderEvidence } from "@/lib/market/MarketSnapshot";
import type {
  MarketSnapshotField,
  MarketSnapshotFreshness,
} from "@/lib/market/MarketSnapshotMetadata";
import { getFieldFreshness } from "@/lib/market/MarketFreshness";
import {
  getMarketRefreshPolicy,
  marketSnapshotFields,
} from "@/lib/market/MarketRefreshPolicy";
import {
  createTransitionalEvidenceProjection,
  getMissingEvidenceReason,
} from "@/lib/market/TransitionalEvidenceProjection";

const freshnessRank: Record<MarketSnapshotFreshness, number> = {
  Fresh: 4,
  Stale: 3,
  Expired: 2,
  Missing: 1,
};

function getEvidenceFreshness(
  evidence: MarketProviderEvidence,
  now = new Date(),
): MarketSnapshotFreshness {
  const policy = getMarketRefreshPolicy(evidence.field);
  const retrievedAtMs = new Date(evidence.retrievedAt).getTime();

  if (Number.isNaN(retrievedAtMs)) {
    return "Missing";
  }

  return getFieldFreshness({
    expiresAt: new Date(retrievedAtMs + policy.ttlMs).toISOString(),
    lastRefresh: evidence.retrievedAt,
    now,
  });
}

function normalizeProvider(providerName: string) {
  return providerName.toLowerCase().trim();
}

function createProvenance(input: {
  evidence: MarketProviderEvidence;
  freshness: MarketSnapshotFreshness;
  priorityConfig?: ProviderPriorityConfig;
}): EvidenceProvenance {
  return {
    classification: input.evidence.classification,
    confidence: {
      ...input.evidence.confidence,
      freshness: input.freshness,
    },
    field: input.evidence.field,
    freshness: input.freshness,
    node: input.evidence.node,
    providerName: input.evidence.providerName,
    providerPriority: getEvidencePriority({
      field: input.evidence.field,
      providerName: input.evidence.providerName,
      priorityConfig: input.priorityConfig,
    }),
    retrievedAt: input.evidence.retrievedAt,
    source: input.evidence.source,
  };
}

function compareEvidence(
  first: EvidenceProvenance,
  second: EvidenceProvenance,
) {
  const freshnessDelta =
    freshnessRank[second.freshness] - freshnessRank[first.freshness];

  if (freshnessDelta !== 0) {
    return freshnessDelta;
  }

  if (first.node.conditionSpecific !== second.node.conditionSpecific) {
    return second.node.conditionSpecific ? 1 : -1;
  }

  const priorityDelta = second.providerPriority - first.providerPriority;

  if (priorityDelta !== 0) {
    return priorityDelta;
  }

  const confidenceDelta =
    second.confidence.confidence - first.confidence.confidence;

  if (confidenceDelta !== 0) {
    return confidenceDelta;
  }

  return (
    new Date(second.retrievedAt).getTime() - new Date(first.retrievedAt).getTime()
  );
}

export class EvidenceResolver {
  constructor(
    private readonly priorityConfig = undefined as
      | ProviderPriorityConfig
      | undefined,
    private readonly fallbackConfig: EvidenceFallbackConfig = evidenceFallbackChains,
  ) {}

  resolveField(input: {
    evidenceStack: MarketProviderEvidence[];
    field: MarketSnapshotField;
    now?: Date;
  }): EvidenceSelection {
    const chain = getEvidenceFallbackChain(input.field, this.fallbackConfig);
    const candidates = input.evidenceStack
      .filter((evidence) => evidence.field === input.field)
      .map((evidence) =>
        createProvenance({
          evidence,
          freshness: getEvidenceFreshness(evidence, input.now),
          priorityConfig: this.priorityConfig,
        }),
      )
      .filter((provenance) => provenance.freshness !== "Missing")
      .sort(compareEvidence);

    if (candidates.length === 0) {
      return {
        fallbackReason: getMissingEvidenceReason(input.field),
        field: input.field,
        provenance: null,
        projection: createTransitionalEvidenceProjection({
          field: input.field,
          provenance: null,
        }),
        selectedProvider: null,
        value: null,
      };
    }

    const selected = candidates[0];
    const matchingStep = chain.find(
      (step) => normalizeProvider(step.providerName) === normalizeProvider(selected.providerName),
    );
    const fallbackReason = matchingStep
      ? `${matchingStep.label} selected from available evidence.`
      : "Selected highest-ranked available provider evidence.";
    const selectedEvidence = input.evidenceStack.find(
      (evidence) =>
        evidence.field === selected.field &&
        evidence.node.nodeId === selected.node.nodeId &&
        evidence.providerName === selected.providerName &&
        evidence.retrievedAt === selected.retrievedAt,
    );

    return {
      fallbackReason,
      field: input.field,
      provenance: selected,
      projection: createTransitionalEvidenceProjection({
        field: input.field,
        provenance: selected,
      }),
      selectedProvider: selected.providerName,
      value: selectedEvidence?.value ?? null,
    };
  }

  resolve(input: {
    evidenceStack: MarketProviderEvidence[];
    fields?: MarketSnapshotField[];
    now?: Date;
  }): EvidenceSelectionRecord {
    const fields = input.fields ?? marketSnapshotFields;

    return Object.fromEntries(
      fields.map((field) => [
        field,
        this.resolveField({
          evidenceStack: input.evidenceStack,
          field,
          now: input.now,
        }),
      ]),
    ) as EvidenceSelectionRecord;
  }
}

export const evidenceResolver = new EvidenceResolver();
