"use client";

import type { AssetContextValidationResult } from "@/lib/workflow/AssetContextValidator";
import type { CardConditionCode } from "@/types/conditionProfile";
import type { MarketSnapshot } from "@/types/marketSnapshot";
import type { ResolvedIntent } from "@/types/resolvedIntent";
import type { VendorWorkflowSnapshot } from "@/types/VendorWorkflowState";

type AtlasInspectorProps = {
  assetValidation: AssetContextValidationResult;
  isMarketLoading: boolean;
  marketSnapshot?: MarketSnapshot;
  query: string;
  resolvedIntent?: ResolvedIntent;
  selectedCondition: CardConditionCode;
  workflow: VendorWorkflowSnapshot;
};

type InspectorSectionProps = {
  children: React.ReactNode;
  defaultOpen?: boolean;
  title: string;
};

function InspectorSection({
  children,
  defaultOpen = false,
  title,
}: InspectorSectionProps) {
  return (
    <details
      className="rounded-md border border-zinc-800 bg-zinc-950/60 p-3"
      open={defaultOpen}
    >
      <summary className="cursor-pointer text-sm font-semibold text-zinc-200">
        {title}
      </summary>
      <div className="mt-3 text-xs text-zinc-400">{children}</div>
    </details>
  );
}

function KeyValue({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-wrap gap-2">
      <span className="text-zinc-500">{label}</span>
      <span className="font-medium text-zinc-200">{value || "None"}</span>
    </div>
  );
}

export default function AtlasInspector({
  assetValidation,
  isMarketLoading,
  marketSnapshot,
  query,
  resolvedIntent,
  selectedCondition,
  workflow,
}: AtlasInspectorProps) {
  const assetContext = workflow.assetContext;

  return (
    <aside className="space-y-3 rounded-lg border border-cyan-900/60 bg-zinc-950 p-4 shadow-lg shadow-cyan-950/20">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">
          Atlas Inspector
        </p>
        <p className="mt-1 text-xs text-zinc-500">
          Development diagnostics are hidden from production users.
        </p>
      </div>

      <InspectorSection title="Workflow" defaultOpen>
        <div className="grid gap-2 sm:grid-cols-2">
          <KeyValue label="Current" value={workflow.state} />
          <KeyValue label="Previous" value={workflow.previousState} />
          <KeyValue label="Last Command" value={workflow.lastCommand} />
          <KeyValue label="Accepted" value={workflow.commandLog.at(-1)} />
          <KeyValue label="Rejected" value={workflow.rejectedCommands.at(-1)} />
          <KeyValue label="Execution" value={`${workflow.executionDurationMs}ms`} />
        </div>
      </InspectorSection>

      <InspectorSection title="Asset Context" defaultOpen>
        <div className="grid gap-2 sm:grid-cols-2">
          <KeyValue label="Context ID" value={assetContext.id} />
          <KeyValue label="Generation" value={assetContext.generation} />
          <KeyValue label="Identity" value={assetContext.identityId} />
          <KeyValue label="Printing" value={assetContext.printingId} />
          <KeyValue label="Variant" value={assetContext.variantId} />
          <KeyValue label="Condition" value={assetContext.condition} />
          <KeyValue label="Market" value={assetContext.marketSnapshotId} />
          <KeyValue label="Card Profile" value={assetContext.cardProfileId} />
          <KeyValue label="Offer Ladder" value={assetContext.offerLadderId} />
          <KeyValue label="Decision" value={assetContext.decisionId} />
          <KeyValue label="Validation" value={assetValidation.status} />
          <KeyValue label="Updated" value={assetContext.updatedAt} />
        </div>
        <ul className="mt-3 list-disc space-y-1 pl-5">
          {assetValidation.reasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      </InspectorSection>

      <InspectorSection title="Query Parser">
        <KeyValue label="Query" value={query} />
        <KeyValue
          label="Parsed"
          value={resolvedIntent?.parsedQuery.cardName ?? "Waiting for query"}
        />
      </InspectorSection>

      <InspectorSection title="Canonical Resolution">
        <KeyValue
          label="Resolution"
          value="Captured upstream by the identity search API."
        />
      </InspectorSection>

      <InspectorSection title="Intent Resolution">
        <KeyValue
          label="Summary"
          value={resolvedIntent?.resolutionExplanation.join(" ")}
        />
        <KeyValue
          label="Confidence"
          value={resolvedIntent?.confidence.overall}
        />
      </InspectorSection>

      <InspectorSection title="Printing Resolution">
        <KeyValue
          label="Candidates"
          value={resolvedIntent?.printingResolution?.printingCandidates.length}
        />
        <KeyValue
          label="Auto Commit"
          value={
            resolvedIntent?.printingResolution?.shouldAutoCommitPrinting
              ? "Yes"
              : "No"
          }
        />
      </InspectorSection>

      <InspectorSection title="Card Intelligence">
        <KeyValue
          label="Status"
          value={isMarketLoading ? "Loading" : "Driven by validated market data"}
        />
      </InspectorSection>

      <InspectorSection title="Offer Ladder">
        <KeyValue label="Context" value={assetContext.offerLadderId} />
      </InspectorSection>

      <InspectorSection title="Decision Trace">
        <KeyValue label="Context" value={assetContext.decisionId} />
      </InspectorSection>

      <InspectorSection title="Performance">
        <KeyValue label="Workflow Time" value={`${workflow.executionDurationMs}ms`} />
      </InspectorSection>

      <InspectorSection title="Provider Trace">
        <KeyValue label="Requested Condition" value={selectedCondition} />
        <KeyValue label="Snapshot Source" value={marketSnapshot?.sourceLabel} />
        <KeyValue label="Snapshot Generation" value={assetContext.generation} />
        <KeyValue
          label="Provider Returned Real Data"
          value={marketSnapshot && !marketSnapshot.priceMissing ? "Yes" : "No"}
        />
        <KeyValue
          label="Fallback Used"
          value={marketSnapshot?.priceMissing ? "Yes" : "No"}
        />
        <KeyValue
          label="Market Snapshot"
          value={assetContext.marketSnapshotId || "Not loaded"}
        />
      </InspectorSection>
    </aside>
  );
}
