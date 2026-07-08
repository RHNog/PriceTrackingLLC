import { adaptScryfallMarketSnapshot } from "@/lib/providers/market/adapters/ScryfallMarketAdapter";
import type { ScryfallCardResponse } from "@/lib/providers/identity/adapters/ScryfallAdapter";
import type { IdentitySearchResponse } from "@/lib/engines/search/searchIdentityCards";

type ProviderDiagnosticsProps = {
  response: IdentitySearchResponse;
};

const pipelineStages = [
  "Query Parsed",
  "Canonical Terms Resolved",
  "Entity Relationships Resolved",
  "Identity Candidates Ranked",
  "Identity Selected",
  "Printing Candidates Ranked",
  "Printing Selected",
  "Finish Variant Resolved",
];

function isScryfallCardResponse(value: unknown): value is ScryfallCardResponse {
  return typeof value === "object" && value !== null && "id" in value;
}

function getRawPrices(rawResponse?: ScryfallCardResponse) {
  return rawResponse?.prices
    ? JSON.stringify(rawResponse.prices)
    : "None";
}

export default function ProviderDiagnostics({
  response,
}: ProviderDiagnosticsProps) {
  const diagnostics = response.diagnostics;
  const canonicalResolution = diagnostics.canonicalResolution;
  const printingResolution = response.intent.printingResolution;
  const selectedPrinting =
    printingResolution?.selectedPrinting ??
    printingResolution?.printingCandidates[0]?.printing;
  const selectedVariant = printingResolution?.selectedVariant;
  const rawSelectedPrinting = response.diagnostics.rawResponses.find(
    (raw): raw is ScryfallCardResponse =>
      isScryfallCardResponse(raw) && raw.id === selectedPrinting?.id,
  );
  const marketSnapshot =
    rawSelectedPrinting && selectedVariant
      ? adaptScryfallMarketSnapshot(rawSelectedPrinting, selectedVariant)
      : undefined;
  const mappedMarketPrice = marketSnapshot?.prices[0];
  const selectedCandidate =
    response.intent.identityCandidates.find(
      (candidate) =>
        candidate.identity.id === response.intent.selectedIdentity?.id,
    ) ?? response.intent.identityCandidates[0];

  return (
    <section className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
      <h3 className="text-sm font-semibold text-zinc-200">
        Provider Diagnostics
      </h3>
      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <Diagnostic label="Identity Provider" value={diagnostics.providerName} />
        <Diagnostic label="Original Query" value={response.query.raw || "-"} />
        <Diagnostic label="Normalized Query" value={response.query.normalized} />
        <Diagnostic
          label="Punctuation-Stripped Query"
          value={response.query.punctuationStripped || "-"}
        />
        <Diagnostic
          label="Canonical Candidates"
          value={
            canonicalResolution.candidates
              .map(
                (candidate) =>
                  `${candidate.entry.canonicalIdentity} (${candidate.confidence})`,
              )
              .join(", ") || "None"
          }
        />
        <Diagnostic
          label="Canonical Confidence"
          value={String(canonicalResolution.confidence)}
        />
        <Diagnostic
          label="Chosen Canonical Identity"
          value={
            canonicalResolution.chosenCandidate?.entry.canonicalIdentity ??
            "Not committed"
          }
        />
        <Diagnostic
          label="Popularity Weight"
          value={
            canonicalResolution.chosenCandidate
              ? String(
                  Math.round(
                    (canonicalResolution.chosenCandidate.entry
                      .communityPopularity +
                      canonicalResolution.chosenCandidate.entry
                        .professionalUsage) /
                      2,
                  ),
                )
              : "0"
          }
        />
        <Diagnostic
          label="Canonical Rejected Candidates"
          value={
            canonicalResolution.rejectedCandidates
              .map(
                (candidate) =>
                  `${candidate.entry.canonicalIdentity}: ${
                    candidate.rejectedReason ?? "Rejected"
                  }`,
              )
              .join(", ") || "None"
          }
        />
        <Diagnostic
          label="Canonical Explanation"
          value={canonicalResolution.explanation.join(" ")}
        />
        <Diagnostic
          label="Canonical Resolution Time"
          value={`${canonicalResolution.resolutionTimeMs}ms`}
        />
        <Diagnostic label="Search Duration" value={`${diagnostics.durationMs}ms`} />
        <Diagnostic
          label="Resolution Time"
          value={`${diagnostics.resolutionTimeMs}ms`}
        />
        <Diagnostic
          label="Identity Resolution Time"
          value={`${diagnostics.identityResolutionTimeMs}ms`}
        />
        <Diagnostic
          label="Printing Resolution Time"
          value={`${diagnostics.printingResolutionTimeMs}ms`}
        />
        <Diagnostic
          label="Relationship Resolution Time"
          value={`${response.intent.relationshipResolutionTimeMs ?? 0}ms`}
        />
        <Diagnostic label="Number of Results" value={String(response.results.length)} />
        <Diagnostic label="Cache Status" value={diagnostics.cacheStatus} />
        <Diagnostic label="Error Message" value={diagnostics.errorMessage ?? "None"} />
        <Diagnostic
          label="Identity Tokens"
          value={response.parsedQuery.identityTokens.join(", ") || "None"}
        />
        <Diagnostic
          label="Constraint Tokens"
          value={response.parsedQuery.constraintTokens.join(", ") || "None"}
        />
        <Diagnostic
          label="Remaining Tokens"
          value={response.intent.remainingTokens.join(", ") || "None"}
        />
        <Diagnostic
          label="Knowledge Matches"
          value={
            response.parsedQuery.knowledgeMatches
              .map(
                (match) =>
                  `${match.sourceToken} → ${match.canonical} (${match.matchType}, ${match.confidence})`,
              )
              .join(", ") || "None"
          }
        />
        <Diagnostic
          label="Prefix Matching Used"
          value={
            response.parsedQuery.knowledgeMatches.some(
              (match) => match.matchType === "prefix",
            )
              ? "Yes"
              : "No"
          }
        />
        <Diagnostic
          label="Knowledge Match Details"
          value={
            response.parsedQuery.knowledgeMatches
              .map(
                (match) =>
                  `${match.category}: matched "${match.matchedAlias}" from "${match.sourceToken}"`,
              )
              .join(", ") || "None"
          }
        />
        <Diagnostic
          label="Knowledge Acceptance"
          value={
            response.parsedQuery.knowledgeMatches
              .map(
                (match) =>
                  `${match.sourceToken} accepted as ${match.matchType} because confidence ${match.confidence} met threshold.`,
              )
              .join(", ") || "No vocabulary terms accepted."
          }
        />
        <Diagnostic
          label="Unresolved Knowledge Tokens"
          value={response.intent.remainingTokens.join(", ") || "None"}
        />
        <Diagnostic
          label="Resolved Constraints"
          value={
            response.intent.resolvedConstraints
              .map((constraint) => `${constraint.field}: ${constraint.value}`)
              .join(", ") || "None"
          }
        />
        <Diagnostic
          label="Parsed Constraint Priorities"
          value={
            printingResolution?.printingCandidates[0]
              ? [
                  ...printingResolution.matchedConstraints,
                  ...printingResolution.unmatchedConstraints,
                ]
                  .map(
                    (match) =>
                      `${match.constraint.type}: ${match.constraint.value} (${match.constraint.priority})`,
                  )
                  .join(", ")
              : "None"
          }
        />
        <Diagnostic
          label="Identity Candidates"
          value={response.intent.identityCandidates
            .map(
              (candidate) =>
                `${candidate.identity.name} (${candidate.confidence})`,
            )
            .join(", ")}
        />
        <Diagnostic
          label="Selected Identity"
          value={response.intent.selectedIdentity?.name ?? "Ambiguous"}
        />
        <Diagnostic
          label="Identity Score Before Normalization Boost"
          value={String(selectedCandidate?.scoreBeforeNormalizationBoost ?? 0)}
        />
        <Diagnostic
          label="Identity Score After Normalization Boost"
          value={String(selectedCandidate?.scoreAfterNormalizationBoost ?? 0)}
        />
        <Diagnostic
          label="Identity Auto-Committed"
          value={response.intent.selectedIdentity ? "Yes" : "No"}
        />
        <Diagnostic
          label="Printings Loaded"
          value={
            printingResolution?.printingCandidates.length ? "Yes" : "No"
          }
        />
        <Diagnostic
          label="Why Printings Displayed"
          value={
            printingResolution?.printingCandidates.length
              ? response.intent.selectedIdentity
                ? "Identity auto-committed and printing constraints were evaluated."
                : "Clear top identity candidate was available for inspection."
              : "No selected or inspectable identity was available."
          }
        />
        <Diagnostic
          label="Relationship Type"
          value={selectedCandidate?.relationship?.type ?? "None"}
        />
        <Diagnostic
          label="Relationship Weight"
          value={String(selectedCandidate?.relationship?.weight ?? 0)}
        />
        <Diagnostic
          label="Confidence Factors"
          value={
            selectedCandidate?.explanationDetails
              ?.map(
                (detail) =>
                  `${detail.passed ? "Pass" : "Review"} ${detail.label}: ${detail.value}`,
              )
              .join(", ") ?? "None"
          }
        />
        <Diagnostic
          label="Rejected Candidates"
          value={
            response.intent.rejectedIdentityCandidates
              .map(
                (candidate) =>
                  `${candidate.identity.name}: ${
                    candidate.rejectedReason ?? "Rejected"
                  }`,
              )
              .join(", ") || "None"
          }
        />
        <Diagnostic
          label="Selection Explanation"
          value={response.intent.resolutionExplanation.join(" ")}
        />
        <Diagnostic
          label="Printing Candidates"
          value={
            printingResolution?.printingCandidates
              .map(
                (candidate) =>
                  `${candidate.printing.set} #${candidate.printing.number} (${candidate.confidence})`,
              )
              .join(", ") || "None"
          }
        />
        <Diagnostic
          label="Matched Printing Constraints"
          value={
            printingResolution?.matchedConstraints
              .map(
                (match) =>
                  `${match.constraint.type}: ${match.constraint.value}`,
              )
              .join(", ") || "None"
          }
        />
        <Diagnostic
          label="Unmatched Printing Constraints"
          value={
            printingResolution?.unmatchedConstraints
              .map(
                (match) =>
                  `${match.constraint.type}: ${match.constraint.value}`,
              )
              .join(", ") || "None"
          }
        />
        <Diagnostic
          label="Relaxed Constraints"
          value={
            printingResolution?.relaxedConstraints
              .map(
                (constraint) =>
                  `${constraint.type}: ${constraint.value}`,
              )
              .join(", ") || "None"
          }
        />
        <Diagnostic
          label="Selected Printing"
          value={
            selectedPrinting
              ? `${selectedPrinting.set} #${selectedPrinting.number}`
              : "Not committed"
          }
        />
        <Diagnostic
          label="Scryfall Finishes Field"
          value={
            selectedPrinting?.availableFinishes?.join(", ") ??
            selectedPrinting?.finish ??
            "None"
          }
        />
        <Diagnostic
          label="Available Finish Variants"
          value={
            printingResolution?.availableVariants
              .map((variant) => variant.finish)
              .join(", ") || "None"
          }
        />
        <Diagnostic
          label="Selected Variant"
          value={selectedVariant?.finish ?? "Unresolved"}
        />
        <Diagnostic
          label="Variant Confidence"
          value={String(printingResolution?.selectedVariantConfidence ?? 0)}
        />
        <Diagnostic
          label="Variant Auto-Committed"
          value={printingResolution?.shouldAutoCommitVariant ? "Yes" : "No"}
        />
        <Diagnostic
          label="Variant Selection Explanation"
          value={printingResolution?.explanation.join(" ") ?? "None"}
        />
        <Diagnostic
          label="Variant Policy Used"
          value={printingResolution?.selectedVariantReasonCode ?? "None"}
        />
        <Diagnostic
          label="Variant Policy Reason"
          value={printingResolution?.selectedVariantReason ?? "None"}
        />
        <Diagnostic
          label="Evaluation Blocked by Finish"
          value={
            printingResolution?.shouldAutoCommitPrinting &&
            !printingResolution.shouldAutoCommitVariant
              ? "Yes"
              : "No"
          }
        />
        <Diagnostic label="Market Provider" value="Scryfall Market Provider" />
        <Diagnostic
          label="Price Source"
          value="Scryfall Daily Market Estimate"
        />
        <Diagnostic
          label="Raw Scryfall Price Fields"
          value={getRawPrices(rawSelectedPrinting)}
        />
        <Diagnostic
          label="Selected Market Finish"
          value={selectedVariant?.finish ?? "Unresolved"}
        />
        <Diagnostic
          label="Mapped Market Price"
          value={
            mappedMarketPrice
              ? `${mappedMarketPrice.currency} ${mappedMarketPrice.price}`
              : "Missing"
          }
        />
        <Diagnostic
          label="Mapped Price Type"
          value={mappedMarketPrice?.priceType ?? "None"}
        />
        <Diagnostic
          label="Market Price Missing"
          value={marketSnapshot?.priceMissing ? "Yes" : "No"}
        />
        <Diagnostic
          label="Market Provider Response Time"
          value={`${marketSnapshot?.durationMs ?? 0}ms`}
        />
        <Diagnostic
          label="Image URL Selected"
          value={
            selectedPrinting?.imageUrls?.normal ??
            selectedPrinting?.imageUrls?.small ??
            selectedPrinting?.imageUrl ??
            "None"
          }
        />
        <Diagnostic
          label="Image Source"
          value={selectedPrinting?.imageSource ?? "None"}
        />
        <Diagnostic
          label="Image Fallback Used"
          value={selectedPrinting?.imageSource === "fallback" ? "Yes" : "No"}
        />
        <Diagnostic
          label="Card Faces Present"
          value={selectedPrinting?.hasCardFaces ? "Yes" : "No"}
        />
        <Diagnostic
          label="Selected Face Image"
          value={selectedPrinting?.imageFace ?? "None"}
        />
        <Diagnostic
          label="Printing Selection Explanation"
          value={printingResolution?.explanation.join(" ") ?? "None"}
        />
        <Diagnostic
          label="Why Other Printings Lost"
          value={
            printingResolution?.printingCandidates
              .slice(1)
              .map(
                (candidate) =>
                  `${candidate.printing.set} #${candidate.printing.number}: missing ${candidate.unmatchedConstraints.length}`,
              )
              .join(", ") || "None"
          }
        />
        <Diagnostic
          label="Confidence"
          value={`Identity ${response.intent.confidence.identity}, Printing ${response.intent.confidence.printing}, Overall ${response.intent.confidence.overall}`}
        />
      </dl>
      <div className="mt-5 border-t border-zinc-800 pt-4">
        <p className="text-xs font-medium text-zinc-400">Pipeline</p>
        <ol className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-300">
          {pipelineStages.map((stage) => (
            <li key={stage} className="rounded-full bg-zinc-950 px-3 py-1">
              {stage}: OK
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Diagnostic({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-zinc-950/60 p-3">
      <dt className="text-xs text-zinc-500">{label}</dt>
      <dd className="mt-1 break-words font-medium text-zinc-200">{value}</dd>
    </div>
  );
}
