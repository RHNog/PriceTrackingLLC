import type {
  MarketSnapshotField,
  MarketSnapshotFreshness,
} from "@/lib/market/MarketSnapshotMetadata";
import type { MarketIntelligenceRepositorySnapshot } from "@/lib/market/MarketSnapshot";

export const staleGraceMs = 5 * 60 * 1000;

export function getFieldFreshness(input: {
  expiresAt: string | null;
  lastRefresh: string | null;
  now?: Date;
}): MarketSnapshotFreshness {
  if (!input.lastRefresh || !input.expiresAt) {
    return "Missing";
  }

  const nowMs = input.now?.getTime() ?? Date.now();
  const expiresAtMs = new Date(input.expiresAt).getTime();

  if (Number.isNaN(expiresAtMs)) {
    return "Missing";
  }

  if (nowMs <= expiresAtMs) {
    return "Fresh";
  }

  if (nowMs - expiresAtMs <= staleGraceMs) {
    return "Stale";
  }

  return "Expired";
}

export function getSnapshotFreshness(
  snapshot: MarketIntelligenceRepositorySnapshot | null,
  fields: MarketSnapshotField[],
  now = new Date(),
) {
  if (!snapshot) {
    return {
      expiredFields: fields,
      freshFields: [],
      missingFields: fields,
      staleFields: [],
      state: "Missing" as const,
    };
  }

  const freshFields: MarketSnapshotField[] = [];
  const staleFields: MarketSnapshotField[] = [];
  const expiredFields: MarketSnapshotField[] = [];
  const missingFields: MarketSnapshotField[] = [];

  fields.forEach((field) => {
    const metadata = snapshot.metadata.fieldMetadata[field];
    const freshness = getFieldFreshness({
      expiresAt: metadata?.expiresAt ?? null,
      lastRefresh: metadata?.lastRefresh ?? null,
      now,
    });

    if (freshness === "Fresh") {
      freshFields.push(field);
    }

    if (freshness === "Stale") {
      staleFields.push(field);
    }

    if (freshness === "Expired") {
      expiredFields.push(field);
    }

    if (freshness === "Missing") {
      missingFields.push(field);
    }
  });

  return {
    expiredFields,
    freshFields,
    missingFields,
    staleFields,
    state: missingFields.length
      ? "Missing" as const
      : expiredFields.length
        ? "Expired" as const
        : staleFields.length
          ? "Stale" as const
          : "Fresh" as const,
  };
}
