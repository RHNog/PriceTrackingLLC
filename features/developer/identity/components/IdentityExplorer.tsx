import IdentityResults from "@/features/developer/identity/components/IdentityResults";
import IdentitySearchPanel from "@/features/developer/identity/components/IdentitySearchPanel";
import NormalizedCardView from "@/features/developer/identity/components/NormalizedCardView";
import ProviderDiagnostics from "@/features/developer/identity/components/ProviderDiagnostics";
import RawResponseView from "@/features/developer/identity/components/RawResponseView";
import type { IdentityOrchestrationResponse } from "@/lib/engines/identity/IdentityOrchestrator";

type IdentityExplorerProps = {
  response: IdentityOrchestrationResponse;
  selectedCardId?: string;
};

function getRawId(rawResponse: unknown) {
  return typeof rawResponse === "object" && rawResponse && "id" in rawResponse
    ? String(rawResponse.id)
    : "";
}

export default function IdentityExplorer({
  response,
  selectedCardId,
}: IdentityExplorerProps) {
  const selectedResult =
    response.results.find((result) => result.item.id === selectedCardId) ??
    response.results.find(
      (result) => result.item.id === response.intent.selectedIdentity?.id,
    ) ??
    response.results[0];
  const selectedPrinting = selectedResult?.item.printings[0];
  const rawResponse = response.diagnostics.rawResponses.find(
    (raw) => getRawId(raw) === selectedPrinting?.id,
  );

  return (
    <div className="w-full space-y-6">
      <header>
        <h2 className="text-3xl font-semibold tracking-tight text-white">
          Identity Explorer
        </h2>
        <p className="mt-2 text-sm text-zinc-400">
          Validate provider search, raw data, adapter output, and normalized cards.
        </p>
      </header>

      <IdentitySearchPanel query={response.query.raw} />
      <ProviderDiagnostics response={response} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <IdentityResults
          query={response.query.raw}
          results={response.results}
          selectedCardId={selectedResult?.item.id}
        />
        <div className="space-y-6">
          <NormalizedCardView identity={selectedResult?.item} />
          <RawResponseView rawResponse={rawResponse} />
        </div>
      </div>
    </div>
  );
}
