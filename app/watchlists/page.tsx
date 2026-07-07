import WatchlistHeader from "@/components/watchlists/WatchlistHeader";
import WatchlistTable from "@/components/watchlists/WatchlistTable";
import AppShell from "@/components/ui/AppShell";

export default function WatchlistsPage() {
  return (
    <AppShell selectedNavItem="Watchlists">
      <div className="w-full space-y-6">
        <WatchlistHeader />
        <WatchlistTable />
      </div>
    </AppShell>
  );
}
