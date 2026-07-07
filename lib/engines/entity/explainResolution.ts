import type { IdentityCandidate } from "@/types/identityCandidate";

export function explainResolution(candidate: IdentityCandidate) {
  return [
    {
      label: "Identity",
      passed: true,
      value: candidate.identity.name,
    },
    {
      label: "Relationship",
      passed: (candidate.relationship?.weight ?? 0) >= 50,
      value: candidate.relationship?.type ?? "UNKNOWN",
    },
    {
      label: "Overall confidence",
      passed: candidate.confidence >= 70,
      value: `${candidate.confidence}%`,
    },
  ];
}
