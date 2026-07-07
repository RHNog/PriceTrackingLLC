import AppShell from "@/components/ui/AppShell";
import OpportunityFilters from "@/components/opportunities/OpportunityFilters";
import OpportunityHeader from "@/components/opportunities/OpportunityHeader";
import OpportunityList from "@/components/opportunities/OpportunityList";
import { mockOpportunities } from "@/data/mockOpportunities";

export default function Home() {
  return (
    <AppShell>
      <div className="w-full space-y-6">
        <OpportunityHeader />
        <OpportunityFilters />
        <OpportunityList opportunities={mockOpportunities} />
      </div>
    </AppShell>
  );
}
