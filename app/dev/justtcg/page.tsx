import { notFound } from "next/navigation";
import AppShell from "@/components/ui/AppShell";
import { marketEvidenceLayer } from "@/lib/market/MarketEvidenceLayer";
import { marketTruthEngine } from "@/lib/market/MarketTruthEngine";
import { JustTCGProvider } from "@/lib/providers/justtcg/JustTCGProvider";
import type { JustTCGKnownCardContext } from "@/lib/providers/justtcg/JustTCGNormalizer";

type JustTCGDeveloperPageProps = {
  searchParams: Promise<{
    card?: string;
    game?: string;
  }>;
};

function JsonPanel({ title, value }: { title: string; value: unknown }) {
  return (
    <section className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
      <h3 className="text-sm font-semibold text-zinc-200">{title}</h3>
      <pre className="mt-4 max-h-[520px] overflow-auto rounded-md bg-zinc-950 p-4 text-xs text-zinc-300">
        {JSON.stringify(value, null, 2)}
      </pre>
    </section>
  );
}

function StatusValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-zinc-800 bg-zinc-950 p-3">
      <dt className="text-xs uppercase text-zinc-500">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-zinc-100">{value}</dd>
    </div>
  );
}

export default async function JustTCGDeveloperPage({
  searchParams,
}: JustTCGDeveloperPageProps) {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  const params = await searchParams;
  const context: JustTCGKnownCardContext = {
    cardName: params.card ?? "Mox Opal",
    game: params.game ?? "Magic: The Gathering",
  };
  const provider = new JustTCGProvider();
  const inspection = await provider.inspectKnownCardForDevelopment(context);
  const normalizedCard = inspection.normalized?.cards[0];
  const normalizedVariant = normalizedCard?.variants[0];
  const marketSnapshot =
    normalizedCard && normalizedVariant
      ? await provider.getMarketSnapshot({
          cardName: normalizedCard.name,
          game: normalizedCard.game,
          printingId: normalizedCard.cardId,
          variantId: `${normalizedCard.cardId}:${normalizedVariant.printing}`,
        })
      : null;
  const truthReport =
    normalizedCard && normalizedVariant && marketSnapshot
      ? marketTruthEngine.evaluate({
          context: {
            cardIdentity: normalizedCard.name,
            collectorNumber: normalizedCard.number ?? undefined,
            condition: normalizedVariant.condition,
            finish: normalizedVariant.printing,
            game: normalizedCard.game,
            language: normalizedVariant.language ?? undefined,
            printingId: normalizedCard.cardId,
            variantId: `${normalizedCard.cardId}:${normalizedVariant.printing}`,
          },
          snapshot: marketSnapshot,
        }).report
      : {
          valid: false,
          warnings: ["No normalized card variant was available to validate."],
        };
  const truthEvaluation =
    normalizedCard && normalizedVariant && marketSnapshot
      ? marketTruthEngine.evaluate({
          context: {
            cardIdentity: normalizedCard.name,
            collectorNumber: normalizedCard.number ?? undefined,
            condition: normalizedVariant.condition,
            finish: normalizedVariant.printing,
            game: normalizedCard.game,
            language: normalizedVariant.language ?? undefined,
            printingId: normalizedCard.cardId,
            variantId: `${normalizedCard.cardId}:${normalizedVariant.printing}`,
          },
          snapshot: marketSnapshot,
        })
      : null;
  const evidenceLayer = truthEvaluation
    ? marketEvidenceLayer.apply({
        existingEvidence: [],
        incomingEvidence: truthEvaluation.evidence,
      })
    : null;

  return (
    <AppShell>
      <div className="w-full space-y-6">
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
            Developer-only temporary tool
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">
            JustTCG SDK Inspection
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Connectivity validation for the official JustTCG SDK provider adapter.
          </p>
        </header>

        <section className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          <h3 className="text-sm font-semibold text-zinc-200">
            Connection Status
          </h3>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatusValue
              label="Authentication"
              value={inspection.authenticationStatus}
            />
            <StatusValue
              label="Connection"
              value={inspection.connectionStatus}
            />
            <StatusValue
              label="Provider Result"
              value={inspection.providerResultStatus}
            />
            <StatusValue
              label="Latency"
              value={`${inspection.diagnostics.durationMs}ms`}
            />
          </dl>
        </section>

        <div className="grid gap-6 xl:grid-cols-2">
          <JsonPanel title="Raw SDK Response" value={inspection.rawSdkResponse} />
          <JsonPanel title="Normalized Response" value={inspection.normalized} />
        </div>

        <JsonPanel title="Market Truth Report" value={truthReport} />
        <JsonPanel title="Market Evidence Layer" value={evidenceLayer} />
        <JsonPanel title="Provider Diagnostics" value={inspection.diagnostics} />
      </div>
    </AppShell>
  );
}
