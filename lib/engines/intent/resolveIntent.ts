import { commitIdentity } from "@/lib/engines/intent/commitIdentity";
import { filterCandidates } from "@/lib/engines/entity/filterCandidates";
import { rankIdentityCandidates } from "@/lib/engines/intent/rankIdentityCandidates";
import { resolveConstraints } from "@/lib/engines/intent/resolveConstraints";
import { satisfyPrintingConstraints } from "@/lib/engines/constraints/satisfyPrintingConstraints";
import type { IdentityCandidate } from "@/types/identityCandidate";
import type { CardIdentity } from "@/types/cardIdentity";
import type { ParsedQuery } from "@/types/parsedQuery";
import type { PrintingResolution } from "@/types/printingResolution";
import type { ResolvedIntent } from "@/types/resolvedIntent";

function getInspectableIdentity(identityCandidates: IdentityCandidate[]) {
  const topCandidate = identityCandidates[0];
  const secondCandidate = identityCandidates[1];

  if (!topCandidate) {
    return undefined;
  }

  if (!secondCandidate && topCandidate.confidence >= 30) {
    return topCandidate.identity;
  }

  if (
    secondCandidate &&
    topCandidate.confidence >= 40 &&
    topCandidate.confidence - secondCandidate.confidence >= 12
  ) {
    return topCandidate.identity;
  }

  return undefined;
}

function formatConstraintType(type: string) {
  return type
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (character) => character.toUpperCase());
}

function getResolutionExplanation(
  selectedIdentity: CardIdentity | undefined,
  identityCandidates: IdentityCandidate[],
  selectedPrinting: ResolvedIntent["selectedPrinting"],
  printingResolution?: PrintingResolution,
) {
  const topCandidate = identityCandidates[0];
  const secondCandidate = identityCandidates[1];
  const isCloseMatch =
    topCandidate && secondCandidate
      ? topCandidate.confidence - secondCandidate.confidence <= 8
      : false;

  if (!selectedIdentity) {
    return identityCandidates.length > 0
      ? [
          "Did you mean:",
          ...identityCandidates
            .slice(0, 3)
            .map((candidate) => candidate.identity.name),
        ]
      : ["Start typing a card name to search identities and printings."];
  }

  if (isCloseMatch) {
    return [
      "Did you mean:",
      ...identityCandidates
        .slice(0, 3)
        .map((candidate) => candidate.identity.name),
    ];
  }

  return [
    "Interpreting your search as:",
    `✓ Card: ${selectedIdentity.name}`,
    ...(
      printingResolution
        ? [
            ...printingResolution.matchedConstraints.map(
              (match) =>
                `✓ ${formatConstraintType(match.constraint.type)}: ${match.constraint.value}`,
            ),
            ...printingResolution.relaxedConstraints.map(
              (constraint) =>
                `Preserved for evaluation: ${constraint.type} ${constraint.value}`,
            ),
          ]
        : []
    ),
    selectedPrinting
      ? `Best matching printing: ${selectedPrinting.set} #${selectedPrinting.number}`
      : "Searching available printings...",
  ];
}

export function resolveIntent(
  parsedQuery: ParsedQuery,
  identities: CardIdentity[],
): ResolvedIntent {
  // TODO: Emit Query Parsed event.
  // TODO: Behavior Engine.
  // TODO: Knowledge Feedback Engine.
  // TODO: Community Vocabulary and Personal Vocabulary.
  // TODO: Vendor Intelligence and Adaptive Query Learning.
  // TODO: AI Knowledge Curator.
  // TODO: Marketplace Vocabulary and Regional Vocabulary.
  const resolvedConstraints = resolveConstraints(parsedQuery);
  const relationshipStartedAt = Date.now();
  const relationshipCandidates = filterCandidates(identities);
  const relationshipResolutionTimeMs = Date.now() - relationshipStartedAt;
  const identityCandidates = rankIdentityCandidates(identities, parsedQuery);
  const selectedIdentity = commitIdentity(identityCandidates);
  const printingIdentity =
    selectedIdentity ?? getInspectableIdentity(identityCandidates);
  const printingResolution = printingIdentity
    ? satisfyPrintingConstraints(
        printingIdentity,
        printingIdentity.printings,
        resolvedConstraints,
      )
    : undefined;
  const printingCandidates =
    printingResolution?.printingCandidates.map((candidate) => ({
      confidence: candidate.confidence,
      explanation: candidate.explanation.map(
        (item) => `${item.label}: ${item.value}`,
      ),
      printing: candidate.printing,
    })) ?? [];
  const selectedPrinting = selectedIdentity
    ? printingResolution?.selectedPrinting
    : undefined;
  const identityConfidence = identityCandidates[0]?.confidence ?? 0;
  const printingConfidence =
    printingResolution?.selectedPrintingConfidence ??
    printingCandidates[0]?.confidence ??
    0;
  const overallConfidence = Math.round(
    (identityConfidence * 0.6 + printingConfidence * 0.4),
  );

  if (selectedIdentity) {
    // TODO: Emit Identity Selected event.
  }

  if (selectedPrinting) {
    // TODO: Emit Printing Selected event.
  }

  return {
    confidence: {
      identity: identityConfidence,
      overall: overallConfidence,
      printing: printingConfidence,
    },
    identityCandidates,
    parsedQuery,
    printingCandidates,
    printingResolution,
    relationshipResolutionTimeMs,
    rejectedIdentityCandidates: relationshipCandidates.rejected.map(
      (candidate) => ({
        confidence: 0,
        explanation: [
          candidate.rejectedReason ?? "Rejected by relationship filter.",
        ],
        identity: candidate.identity,
        relationship: candidate.relationship,
        rejectedReason: candidate.rejectedReason,
      }),
    ),
    rejectedPrintingCandidates: [],
    remainingTokens: parsedQuery.remainingTokens,
    resolutionExplanation: getResolutionExplanation(
      selectedIdentity,
      identityCandidates,
      selectedPrinting,
      printingResolution,
    ),
    resolvedConstraints,
    selectedIdentity,
    selectedPrinting,
  };
}
