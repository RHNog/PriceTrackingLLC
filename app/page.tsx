import AppShell from "@/components/ui/AppShell";

export default function Home() {
  return (
    <AppShell>
      <section className="flex w-full max-w-3xl flex-col items-center text-center">
        {/* Primary brand message for the dashboard foundation page. */}
        <h2 className="text-4xl font-bold tracking-tight sm:text-6xl">
          PriceTrackingLLC
        </h2>

        <p className="mt-4 text-lg text-zinc-300 sm:text-xl">
          Professional Trading Card Market Intelligence
        </p>

        {/* Simple sprint status card. */}
        <div className="mt-12 rounded-lg border border-zinc-800 bg-zinc-900 px-10 py-8 shadow-2xl shadow-black/30">
          <p className="text-xl font-semibold text-zinc-100">
            Sprint 1 - Foundation
          </p>
        </div>
      </section>
    </AppShell>
  );
}
