import type { PlatformStatus } from "@/lib/capabilities/PlatformCapability";

const styles: Record<PlatformStatus, string> = {
  "Coming Soon": "border-amber-400/30 bg-amber-400/10 text-amber-200",
  Disabled: "border-zinc-700 bg-zinc-900 text-zinc-500",
  "Not Applicable": "border-zinc-700 bg-zinc-900 text-zinc-400",
  Operational: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  Pending: "border-amber-400/30 bg-amber-400/10 text-amber-200",
  Provider: "border-cyan-400/30 bg-cyan-400/10 text-cyan-200",
  Replay: "border-purple-400/30 bg-purple-400/10 text-purple-200",
  Repository: "border-blue-400/30 bg-blue-400/10 text-blue-200",
  Unavailable: "border-red-400/30 bg-red-400/10 text-red-200",
};

export default function StatusBadge({ status }: { status: PlatformStatus }) {
  return (
    <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold ${styles[status]}`}>
      {status}
    </span>
  );
}
