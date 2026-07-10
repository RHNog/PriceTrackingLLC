import StatusBadge from "@/components/ui/StatusBadge";
import type { PlatformCapability } from "@/lib/capabilities/PlatformCapability";

type CapabilityCardProps = {
  capabilities: PlatformCapability[];
  compact?: boolean;
  developerMode?: boolean;
  title?: string;
};

export default function CapabilityCard({
  capabilities,
  compact = false,
  developerMode = false,
  title = "Capabilities",
}: CapabilityCardProps) {
  return (
    <section className={`rounded-lg border border-zinc-800 bg-zinc-950/80 ${compact ? "p-2" : "p-4"}`}>
      {!compact ? <h3 className="text-sm font-semibold text-zinc-200">{title}</h3> : null}
      <div className={compact ? "space-y-1" : "mt-3 space-y-2"}>
        {capabilities.map((capability) => (
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs" key={capability.id}>
            <span className="text-zinc-400">{capability.label}</span>
            <StatusBadge status={capability.status === "Pending" ? "Coming Soon" : capability.status} />
            {developerMode ? (
              <div className="w-full rounded bg-zinc-900 px-2 py-1 text-[10px] leading-4 text-zinc-500">
                <span>Source: {capability.source}</span>
                <span className="ml-2">Provider: {capability.provider ?? "None"}</span>
                <span className="ml-2">Resolution: {capability.resolution}</span>
                <span className="ml-2">Selected: {capability.providerSelected ?? "None"}</span>
                <span className="ml-2">Reason: {capability.reason}</span>
                <span className="ml-2">Future: {capability.futureProvider ?? "None"}</span>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
