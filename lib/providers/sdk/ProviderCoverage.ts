export interface ProviderCoverage {
  confidence: number;
  coverageAreas: string[];
  gaps: string[];
  lastMeasuredAt: string;
  scope: string;
}

export function createPlannedCoverage(
  scope: string,
  coverageAreas: string[],
  gaps: string[],
): ProviderCoverage {
  return {
    confidence: 0,
    coverageAreas,
    gaps,
    lastMeasuredAt: new Date().toISOString(),
    scope,
  };
}
