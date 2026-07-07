type StatCardProps = {
  title: string;
  value: string;
};

export default function StatCard({ title, value }: StatCardProps) {
  return (
    <article className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
      {/* Small label above the main metric value. */}
      <h3 className="text-sm font-medium text-zinc-400">{title}</h3>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
        {value}
      </p>
    </article>
  );
}
