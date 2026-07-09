import AppShell from "@/components/ui/AppShell";
import { mockCards } from "@/data/mockCards";
import {
  defaultStrategyId,
  seedStrategies,
  seedStrategyProfiles,
} from "@/data/seedStrategies";
import VendorWorkspace from "@/features/vendor/components/VendorWorkspace";
import { ScryfallProvider } from "@/lib/providers/identity/ScryfallProvider";

async function getIdentityCards() {
  const identityProvider = new ScryfallProvider();
  const cards = await identityProvider.searchCards("urza saga textless");

  return cards.length > 0 ? cards : mockCards;
}

export default async function VendorPage() {
  const cards = await getIdentityCards();

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
          strategies={seedStrategies}
          strategyProfiles={seedStrategyProfiles}
        />
      </div>
    </AppShell>
  );
}
