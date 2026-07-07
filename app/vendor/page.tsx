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
import { ScryfallProvider } from "@/lib/providers/identity/ScryfallProvider";
import { MockMarketProvider } from "@/lib/providers/market/MockMarketProvider";

async function getIdentityCards() {
  const identityProvider = new ScryfallProvider();
  const cards = await identityProvider.searchCards("urza saga textless");

  return cards.length > 0 ? cards : mockCards;
}

export default async function VendorPage() {
  const cards = await getIdentityCards();
  const marketProvider = new MockMarketProvider();
  const marketSnapshots: VendorMarketSnapshot[] = await Promise.all(
    cards.map(async (card) => ({
      cardId: card.id,
      listings: await marketProvider.getListings(card.id),
      recentSales: await marketProvider.getRecentSales(card.id),
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
          cards={cards}
          defaultStrategyId={defaultStrategyId}
          marketSnapshots={marketSnapshots}
          strategies={seedStrategies}
          strategyProfiles={seedStrategyProfiles}
        />
      </div>
    </AppShell>
  );
}
