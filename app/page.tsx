import AppShell from "@/components/ui/AppShell";
import HotOpportunitiesWorkspace from "@/components/opportunities/HotOpportunitiesWorkspace";
import OpportunityHeader from "@/components/opportunities/OpportunityHeader";
import {
  defaultStrategyId,
  seedStrategies,
  seedStrategyProfiles,
} from "@/data/seedStrategies";
import { generateOpportunity } from "@/lib/engines/opportunity/generateOpportunity";
import { MockMarketplaceProvider } from "@/lib/providers/MockMarketplaceProvider";

export default async function Home() {
  const provider = new MockMarketplaceProvider();
  const opportunity = await generateOpportunity(
    provider,
    "store-championship-urzas-saga-textless",
  );
  const opportunities = opportunity ? [opportunity] : [];

  return (
    <AppShell>
      <div className="w-full space-y-6">
        <OpportunityHeader />
        <HotOpportunitiesWorkspace
          opportunities={opportunities}
          strategies={seedStrategies}
          strategyProfiles={seedStrategyProfiles}
          defaultStrategyId={defaultStrategyId}
        />
      </div>
    </AppShell>
  );
}
