import type {
  IdentityResolutionState,
  PhysicalFinish,
  PrintingDesignFacet,
} from "@/types/identityOntology";

export function formatPresentationState(state?: IdentityResolutionState) {
  if (state === "Provider Does Not Supply") return "Provider Does Not Supply";
  if (state === "Pending Support") return "Pending Provider Support";
  if (state === "Unresolved") return "Unknown";
  return undefined;
}

export function formatPresentationPrinting(setName?: string, collectorNumber?: string) {
  if (setName && collectorNumber) return `${setName} #${collectorNumber}`;
  if (setName) return setName;
  if (collectorNumber) return `#${collectorNumber}`;
  return "Printing Not Identified";
}

export function formatPresentationTreatment(facets?: PrintingDesignFacet[]) {
  const values = [...new Set((facets ?? []).map((facet) => facet.value).filter(Boolean))];
  return values.length > 0 ? values.join(" / ") : "Standard";
}

export function shouldShowTreatment(value: string) {
  return value.trim().toLowerCase() !== "standard";
}

export function formatPresentationFinish(
  finish?: PhysicalFinish,
  finishes?: PhysicalFinish[],
) {
  const candidates = finish ? [finish] : finishes ?? [];
  const explicit = [...new Set(
    candidates
      .filter((candidate) => candidate.evidence.state === "Explicit")
      .map((candidate) => candidate.value),
  )];
  if (explicit.length > 0) {
    const meaningful = explicit.filter((value) => !isRegularPrinting(value));
    return (meaningful.length > 0 ? meaningful : explicit).join(" / ");
  }
  const meaningfulState = candidates
    .map((candidate) => formatPresentationState(candidate.evidence.state))
    .find(Boolean);
  return meaningfulState ?? "Unknown";
}

export function isRegularPrinting(value: string) {
  return ["regular", "normal", "nonfoil", "non-foil"].includes(
    value.trim().toLowerCase(),
  );
}

export function shouldShowPrinting(value: string) {
  const normalized = value.trim().toLowerCase();
  return !isRegularPrinting(value) && normalized !== "provider does not supply";
}

export function formatPresentationMarket(value?: string | null) {
  return value?.trim() || "No Market Data";
}

export function formatPresentationCondition(value?: string | null) {
  return value?.trim() || "Not Selected";
}

export function canonicalFacetValue(facets?: PrintingDesignFacet[]) {
  return (facets ?? []).map((facet) => facet.value).join(" / ") || "None";
}

export function canonicalFinishValue(
  finish?: PhysicalFinish,
  finishes?: PhysicalFinish[],
) {
  const candidates = finish ? [finish] : finishes ?? [];
  return candidates.map((candidate) => candidate.value).join(" / ") || "None";
}
