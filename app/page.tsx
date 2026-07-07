import AppShell from "@/components/ui/AppShell";
import OpportunityFilters from "@/components/opportunities/OpportunityFilters";
import OpportunityHeader from "@/components/opportunities/OpportunityHeader";
import OpportunityList from "@/components/opportunities/OpportunityList";
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
        <OpportunityFilters />
        <OpportunityList opportunities={opportunities} />
      </div>
    </AppShell>
  );
}
