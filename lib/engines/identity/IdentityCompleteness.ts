import type { Card } from "@/types/card";
import type {
  IdentityCompleteness,
  IdentityCompletenessField,
  IdentityCompletenessMetric,
} from "@/types/identityCompleteness";

function metric(
  field: IdentityCompletenessField,
  present: number,
  total: number,
): IdentityCompletenessMetric {
  const percent = total === 0 ? 0 : Math.round((present / total) * 100);
  return {
    field,
    percent,
    status: percent === 100 ? "Complete" : percent > 0 ? "Partial" : "Missing",
  };
}

export function calculateIdentityCompleteness(printings: Card[]): IdentityCompleteness {
  const total = printings.length;
  const metrics: IdentityCompletenessMetric[] = [
    metric(
      "Artwork",
      printings.filter((printing) => Boolean(printing.imageUrls?.normal ?? printing.imageUrl)).length,
      total,
    ),
    metric("Printing", printings.filter((printing) => Boolean(printing.set)).length, total),
    metric(
      "Collector Number",
      printings.filter((printing) => Boolean(printing.number)).length,
      total,
    ),
    metric(
      "Treatment",
      printings.filter(
        (printing) =>
          Boolean(printing.treatmentDetails) &&
          printing.treatmentDetails?.state !== "Unknown",
      ).length,
      total,
    ),
    metric("Language", printings.filter((printing) => Boolean(printing.language)).length, total),
    { field: "Market", percent: null, status: "Not Applicable" },
  ];
  const scored = metrics.filter((item) => item.percent !== null);

  return {
    metrics,
    overallPercent:
      scored.length === 0
        ? 0
        : Math.round(
            scored.reduce((sum, item) => sum + (item.percent ?? 0), 0) /
              scored.length,
          ),
  };
}
