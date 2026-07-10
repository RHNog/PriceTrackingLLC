import CardThumbnail from "@/components/cards/CardThumbnail";
import type { CardIdentity } from "@/types/cardIdentity";
import type { SearchResult } from "@/types/searchResult";

type IdentityResultsProps = {
  query: string;
  results: SearchResult<CardIdentity>[];
  selectedCardId?: string;
};

export default function IdentityResults({
  query,
  results,
  selectedCardId,
}: IdentityResultsProps) {
  return (
    <section className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
      <h3 className="text-sm font-semibold text-zinc-200">Results</h3>
      <div className="mt-4 space-y-3">
        {results.length > 0 ? (
          results.map((result) => (
            <a
              key={result.item.id}
              href={`/dev/identity?q=${encodeURIComponent(
                query,
              )}&cardId=${encodeURIComponent(result.item.id)}`}
              className={`flex gap-4 rounded-md border p-3 transition ${
                result.item.id === selectedCardId
                  ? "border-cyan-400 bg-cyan-400/10"
                  : "border-zinc-800 bg-zinc-950/50 hover:border-zinc-700"
              }`}
            >
              {result.item.printings[0] ? (
                <CardThumbnail
                  alt={`${result.item.name}, ${result.item.printings[0].set}`}
                  assetKey={result.item.printings[0].id}
                  candidates={[{
                    source: "Provider",
                    urls: result.item.printings[0].imageUrls ?? { normal: result.item.printings[0].imageUrl },
                  }]}
                  className="w-14"
                  selected={result.item.id === selectedCardId}
                />
              ) : null}
              <span className="min-w-0 text-sm">
                <span className="block font-semibold text-white">
                  {result.item.name}
                </span>
                <span className="mt-1 block text-zinc-400">
                  {result.item.printings.length} available printings
                </span>
                <span className="mt-1 block text-zinc-500">
                  First printing: {result.item.printings[0]?.set} / #
                  {result.item.printings[0]?.number}
                </span>
                <span className="mt-1 block break-all text-xs text-zinc-500">
                  Identity ID: {result.item.id}
                </span>
              </span>
            </a>
          ))
        ) : (
          <p className="text-sm text-zinc-400">No identity results yet.</p>
        )}
      </div>
    </section>
  );
}
