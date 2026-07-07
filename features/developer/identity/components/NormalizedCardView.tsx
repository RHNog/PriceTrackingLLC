import type { CardIdentity } from "@/types/cardIdentity";

type NormalizedCardViewProps = {
  identity?: CardIdentity;
};

export default function NormalizedCardView({
  identity,
}: NormalizedCardViewProps) {
  return (
    <section className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
      <h3 className="text-sm font-semibold text-zinc-200">
        Normalized Domain Card
      </h3>
      <pre className="mt-4 overflow-auto rounded-md bg-zinc-950 p-4 text-xs text-zinc-300">
        {identity
          ? JSON.stringify(identity.printings[0], null, 2)
          : "Select a card to inspect."}
      </pre>
    </section>
  );
}
