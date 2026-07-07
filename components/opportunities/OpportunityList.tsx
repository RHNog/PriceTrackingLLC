import OpportunityCard from "@/components/opportunities/OpportunityCard";
import type { RankedOpportunity } from "@/types/opportunity";

type OpportunityListProps = {
  opportunities: RankedOpportunity[];
};

export default function OpportunityList({
  opportunities,
}: OpportunityListProps) {
  return (
    <section aria-label="Hot opportunities" className="grid gap-4 xl:grid-cols-3">
      {opportunities.map((opportunity) => (
        <OpportunityCard key={opportunity.id} opportunity={opportunity} />
      ))}
    </section>
  );
}
