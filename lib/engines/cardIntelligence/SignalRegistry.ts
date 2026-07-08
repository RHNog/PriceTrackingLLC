import type {
  SignalName,
  SignalStatus,
} from "@/lib/engines/cardIntelligence/models/Signal";

export type SignalDefinition = {
  name: SignalName;
  label: string;
  source: string;
  status: SignalStatus;
  version: string;
  supportingDataSources: string[];
};

export const signalRegistry: SignalDefinition[] = [
  {
    name: "InvestmentPotential",
    label: "Investment",
    source: "Card Intelligence Engine",
    status: "estimated",
    version: "1.0.0",
    supportingDataSources: ["Card metadata", "Market confidence"],
  },
  {
    name: "FlipPotential",
    label: "Flip",
    source: "Card Intelligence Engine",
    status: "estimated",
    version: "1.0.0",
    supportingDataSources: ["Condition profile", "Market confidence"],
  },
  {
    name: "GradingPotential",
    label: "Grading",
    source: "Condition Resolution",
    status: "estimated",
    version: "1.0.0",
    supportingDataSources: ["Condition profile", "Printing metadata"],
  },
  {
    name: "CollectorAppeal",
    label: "Collector",
    source: "Printing Metadata",
    status: "estimated",
    version: "1.0.0",
    supportingDataSources: ["Set", "Treatment", "Promo metadata", "Finish"],
  },
  {
    name: "Liquidity",
    label: "Liquidity",
    source: "Market Context",
    status: "placeholder",
    version: "1.0.0",
    supportingDataSources: ["Market context placeholder"],
  },
  {
    name: "Volatility",
    label: "Volatility",
    source: "Historical Market Context",
    status: "future",
    version: "1.0.0",
    supportingDataSources: ["Future historical analytics"],
  },
  {
    name: "Scarcity",
    label: "Scarcity",
    source: "Printing Metadata",
    status: "estimated",
    version: "1.0.0",
    supportingDataSources: ["Rarity", "Collector appeal"],
  },
  {
    name: "Demand",
    label: "Demand",
    source: "Market Context",
    status: "placeholder",
    version: "1.0.0",
    supportingDataSources: ["Future marketplace depth"],
  },
  {
    name: "Playability",
    label: "Playability",
    source: "Game Knowledge",
    status: "placeholder",
    version: "1.0.0",
    supportingDataSources: ["Game knowledge placeholder"],
  },
  {
    name: "ReprintRisk",
    label: "Reprint Risk",
    source: "Card Intelligence Engine",
    status: "placeholder",
    version: "1.0.0",
    supportingDataSources: ["Collector profile placeholder"],
  },
  {
    name: "MarketConfidence",
    label: "Market Confidence",
    source: "Market Provider",
    status: "estimated",
    version: "1.0.0",
    supportingDataSources: ["Normalized market price"],
  },
  {
    name: "HistoricalStability",
    label: "Historical Stability",
    source: "Historical Analytics",
    status: "future",
    version: "1.0.0",
    supportingDataSources: ["Future historical analytics"],
  },
];

export function getSignalDefinition(name: SignalName) {
  return signalRegistry.find((signal) => signal.name === name);
}
