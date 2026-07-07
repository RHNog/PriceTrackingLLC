"use client";

import { useMemo, useState } from "react";
import OpportunityFilters from "@/components/opportunities/OpportunityFilters";
import OpportunityList from "@/components/opportunities/OpportunityList";
import { applyStrategy } from "@/lib/engines/strategy/applyStrategy";
import type { Opportunity } from "@/types/opportunity";
import type { Strategy } from "@/types/strategy";
import type { StrategyProfile } from "@/types/strategyProfile";

type HotOpportunitiesWorkspaceProps = {
  opportunities: Opportunity[];
  strategies: Strategy[];
  strategyProfiles: StrategyProfile[];
  defaultStrategyId: string;
};

function findById<T extends { id: string }>(items: T[], id: string) {
  return items.find((item) => item.id === id);
}

export default function HotOpportunitiesWorkspace({
  opportunities,
  strategies,
  strategyProfiles,
  defaultStrategyId,
}: HotOpportunitiesWorkspaceProps) {
  const [selectedStrategyId, setSelectedStrategyId] =
    useState(defaultStrategyId);

  const rankedOpportunities = useMemo(() => {
    const selectedStrategy =
      findById(strategies, selectedStrategyId) ?? strategies[0];
    const selectedProfile = selectedStrategy
      ? findById(strategyProfiles, selectedStrategy.profileId)
      : undefined;

    if (!selectedProfile) {
      return [];
    }

    return applyStrategy(selectedProfile, opportunities);
  }, [opportunities, selectedStrategyId, strategies, strategyProfiles]);

  return (
    <>
      <OpportunityFilters
        strategies={strategies}
        selectedStrategyId={selectedStrategyId}
        onStrategyChange={setSelectedStrategyId}
      />
      <OpportunityList opportunities={rankedOpportunities} />
    </>
  );
}
