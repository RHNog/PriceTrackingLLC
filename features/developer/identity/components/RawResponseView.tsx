type RawResponseViewProps = {
  rawResponse?: unknown;
};

export default function RawResponseView({ rawResponse }: RawResponseViewProps) {
  return (
    <section className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
      <h3 className="text-sm font-semibold text-zinc-200">
        Raw Scryfall Response
      </h3>
      <pre className="mt-4 max-h-[520px] overflow-auto rounded-md bg-zinc-950 p-4 text-xs text-zinc-300">
        {rawResponse
          ? JSON.stringify(rawResponse, null, 2)
          : "Select a card to compare raw provider data."}
      </pre>
    </section>
  );
}
