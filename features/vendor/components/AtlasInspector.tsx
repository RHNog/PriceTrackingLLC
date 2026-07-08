"use client";

import type { AssetContextValidationResult } from "@/lib/workflow/AssetContextValidator";
import type { CardProfile } from "@/lib/engines/cardIntelligence/models/CardProfile";
import type { PipelineReport } from "@/lib/pipeline/PipelineReport";
import type { ReadinessReport } from "@/lib/validation/ReadinessReport";
import type { CardConditionCode } from "@/types/conditionProfile";
import type { MarketSnapshot } from "@/types/marketSnapshot";
import type { ResolvedIntent } from "@/types/resolvedIntent";
import type { VendorWorkflowSnapshot } from "@/types/VendorWorkflowState";

type AtlasInspectorProps = {
  assetValidation: AssetContextValidationResult;
  cardProfile?: CardProfile;
  isMarketLoading: boolean;
  marketSnapshot?: MarketSnapshot;
  pipelineReport: PipelineReport;
  query: string;
  resolvedIntent?: ResolvedIntent;
  selectedCondition: CardConditionCode;
  systemReadinessReport: ReadinessReport;
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

function ReadinessList({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <p className="font-medium text-zinc-500">{label}</p>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        {items.length > 0 ? (
          items.map((item) => <li key={item}>{item}</li>)
        ) : (
          <li>None</li>
        )}
      </ul>
    </div>
  );
}

export default function AtlasInspector({
  assetValidation,
  cardProfile,
  isMarketLoading,
  marketSnapshot,
  pipelineReport,
  query,
  resolvedIntent,
  selectedCondition,
  systemReadinessReport,
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

      <InspectorSection title="System Readiness" defaultOpen>
        <div className="grid gap-2 sm:grid-cols-2">
          <KeyValue label="Status" value={systemReadinessReport.status} />
          <KeyValue
            label="Ready"
            value={systemReadinessReport.readyComponents.join(", ")}
          />
          <KeyValue
            label="Missing"
            value={systemReadinessReport.missingComponents.join(", ")}
          />
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <ReadinessList
            label="Blocking Issues"
            items={systemReadinessReport.blockingIssues.map(
              (issue) => `${issue.component}: ${issue.message}`,
            )}
          />
          <ReadinessList
            label="Warnings"
            items={systemReadinessReport.warnings.map(
              (issue) => `${issue.component}: ${issue.message}`,
            )}
          />
        </div>
      </InspectorSection>

      <InspectorSection title="Configuration Readiness">
        <KeyValue
          label="Business Profile"
          value={
            systemReadinessReport.readyComponents.includes("Business Profile")
              ? "READY"
              : "WAITING_FOR_CONFIGURATION"
          }
        />
        <KeyValue
          label="Strategy"
          value={
            systemReadinessReport.readyComponents.includes("Strategy")
              ? "READY"
              : "WAITING_FOR_CONFIGURATION"
          }
        />
      </InspectorSection>

      <InspectorSection title="Offer Ladder Readiness">
        <KeyValue
          label="Status"
          value={
            systemReadinessReport.readyComponents.includes("Offer Ladder")
              ? "READY"
              : "WAITING_FOR_PREREQUISITES"
          }
        />
      </InspectorSection>

      <InspectorSection title="Decision Readiness">
        <KeyValue
          label="Status"
          value={
            systemReadinessReport.readyComponents.includes("Decision")
              ? "READY"
              : "WAITING_FOR_PREREQUISITES"
          }
        />
      </InspectorSection>

      <InspectorSection title="Pipeline Trace">
        <KeyValue
          label="Status"
          value={pipelineReport.status}
        />
        <KeyValue
          label="First Invalid"
          value={pipelineReport.firstInvalidStage?.name ?? "None"}
        />
        <div className="mt-3 grid gap-2">
          {pipelineReport.stages.map((stage) => (
            <div
              key={stage.name}
              className={`rounded-md border px-3 py-2 ${
                pipelineReport.firstInvalidStage?.name === stage.name
                  ? "border-amber-500/60 bg-amber-950/20"
                  : "border-zinc-800 bg-zinc-950/60"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-semibold text-zinc-200">{stage.name}</span>
                <span className="text-zinc-500">{stage.validationStatus}</span>
              </div>
              <div className="mt-2 grid gap-1 sm:grid-cols-2">
                <KeyValue
                  label="Missing"
                  value={stage.missingFields.join(", ")}
                />
                <KeyValue
                  label="Fallbacks"
                  value={stage.fallbacksUsed.join(", ")}
                />
                <KeyValue
                  label="Execution"
                  value={`${stage.executionTimeMs}ms`}
                />
                <KeyValue label="Reason" value={stage.reason} />
              </div>
            </div>
          ))}
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

      <InspectorSection title="Intelligence Implementation Details">
        {cardProfile ? (
          <div className="grid gap-3">
            {cardProfile.intelligenceModels.map((model) => (
              <div
                key={model.id}
                className="rounded-md border border-zinc-800 bg-zinc-950/60 px-3 py-2"
              >
                <div className="grid gap-2 sm:grid-cols-2">
                  <KeyValue label="Model" value={model.name} />
                  <KeyValue label="Version" value={model.version} />
                  <KeyValue label="Status" value={model.status} />
                  <KeyValue label="Health" value={model.health} />
                  <KeyValue label="Confidence" value={`${model.confidence}%`} />
                  <KeyValue
                    label="Evidence Status"
                    value={model.evidenceReport.status}
                  />
                  <KeyValue
                    label="Missing Evidence"
                    value={model.evidenceReport.missingEvidence
                      .map((requirement) => requirement.label)
                      .join(", ")}
                  />
                  <KeyValue
                    label="Evidence Explanation"
                    value={model.evidenceReport.explanation}
                  />
                  <KeyValue
                    label="Internal Sources"
                    value={model.supportingSources.join(", ")}
                  />
                  <KeyValue
                    label="Future Dependencies"
                    value={model.indicators
                      .flatMap((indicator) => indicator.futureDependencies)
                      .join(", ")}
                  />
                  <KeyValue
                    label="Dependency Graph"
                    value={model.dependencyGraph.join(" -> ")}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <KeyValue label="Card Profile" value="Waiting for validated data" />
        )}
      </InspectorSection>

      <InspectorSection title="Internal Signals">
        {cardProfile ? (
          <div className="grid gap-2 sm:grid-cols-2">
            {cardProfile.signals.map((signal) => (
              <div
                key={signal.name}
                className="rounded-md border border-zinc-800 bg-zinc-950/60 px-3 py-2"
              >
                <KeyValue label="Signal" value={signal.label} />
                <KeyValue label="Score" value={signal.score} />
                <KeyValue label="Confidence" value={`${signal.confidence}%`} />
                <KeyValue label="Version" value={signal.version} />
                <KeyValue label="Status" value={signal.status} />
                <KeyValue
                  label="Sources"
                  value={signal.supportingDataSources.join(", ")}
                />
              </div>
            ))}
          </div>
        ) : (
          <KeyValue label="Signals" value="Waiting for card profile" />
        )}
      </InspectorSection>

      <InspectorSection title="Certification Provider Matrix">
        {cardProfile ? (
          <div className="grid gap-2">
            {cardProfile.certificationProfile.providers.map((provider) => (
              <div
                key={provider.providerId}
                className="rounded-md border border-zinc-800 bg-zinc-950/60 px-3 py-2"
              >
                <div className="grid gap-2 sm:grid-cols-3">
                  <KeyValue label="Provider" value={provider.providerName} />
                  <KeyValue label="Status" value={provider.status} />
                  <KeyValue label="Source" value={provider.source} />
                  <KeyValue label="Grade" value={provider.grade} />
                  <KeyValue
                    label="Confidence"
                    value={`${provider.confidence}%`}
                  />
                  <KeyValue
                    label="Population"
                    value={provider.population ?? "Provider pending"}
                  />
                  <KeyValue
                    label="Gem Population"
                    value={provider.gemPopulation ?? "Provider pending"}
                  />
                  <KeyValue
                    label="Gem Rate"
                    value={
                      provider.gemRate === null
                        ? "Provider pending"
                        : `${provider.gemRate}%`
                    }
                  />
                  <KeyValue
                    label="Estimated Premium"
                    value={
                      provider.estimatedPremium === null
                        ? "Provider pending"
                        : `${provider.estimatedPremium}%`
                    }
                  />
                  <KeyValue label="Trend" value={provider.trend} />
                  <KeyValue label="Last Updated" value={provider.lastUpdated} />
                </div>
              </div>
            ))}
            <KeyValue
              label="Future Providers"
              value={cardProfile.certificationProfile.futureProviders
                .map((provider) => `${provider.providerName}: ${provider.status}`)
                .join(", ")}
            />
          </div>
        ) : (
          <KeyValue label="Certification" value="Waiting for card profile" />
        )}
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
