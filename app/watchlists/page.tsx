import WatchlistHeader from "@/components/watchlists/WatchlistHeader";
import WatchlistList from "@/components/watchlists/WatchlistList";
import AppShell from "@/components/ui/AppShell";
import { mockWatchlists } from "@/data/mockWatchlists";

export default function WatchlistsPage() {
  return (
    <AppShell selectedNavItem="Watchlists">
      <div className="w-full space-y-6">
        <WatchlistHeader />
        <WatchlistList watchlists={mockWatchlists} />
      </div>
    </AppShell>
  );
}
