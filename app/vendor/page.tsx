import AppShell from "@/components/ui/AppShell";
import { mockCards } from "@/data/mockCards";
import {
  defaultStrategyId,
  seedStrategies,
  seedStrategyProfiles,
} from "@/data/seedStrategies";
import VendorWorkspace, {
  type VendorMarketSnapshot,
} from "@/features/vendor/components/VendorWorkspace";
import { MockMarketplaceProvider } from "@/lib/providers/MockMarketplaceProvider";

export default async function VendorPage() {
  const provider = new MockMarketplaceProvider();
  const marketSnapshots: VendorMarketSnapshot[] = await Promise.all(
    mockCards.map(async (card) => ({
      cardId: card.id,
      listings: await provider.getListings(card.id),
      recentSales: await provider.getRecentSales(card.id),
    })),
  );

  return (
    <AppShell selectedNavItem="Vendor Workspace">
      <div className="w-full space-y-6">
        <header>
          <h2 className="text-3xl font-semibold tracking-tight text-white">
            Vendor Workspace
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Search, price, and evaluate an in-person buying opportunity.
          </p>
        </header>

        <VendorWorkspace
          cards={mockCards}
          defaultStrategyId={defaultStrategyId}
          marketSnapshots={marketSnapshots}
          strategies={seedStrategies}
          strategyProfiles={seedStrategyProfiles}
        />
      </div>
    </AppShell>
  );
}
