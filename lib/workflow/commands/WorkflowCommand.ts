import type { Card } from "@/types/card";
import type { CardIdentity } from "@/types/cardIdentity";
import type { CardConditionCode } from "@/types/conditionProfile";
import type { ResolvedIntent } from "@/types/resolvedIntent";

export type WorkflowCommandOrigin =
  | "User"
  | "System"
  | "SearchEngine"
  | "MarketProvider"
  | "EvaluationEngine";

export type WorkflowCommandType =
  | "SearchCards"
  | "LoadSearchResults"
  | "HighlightCard"
  | "LoadMarketSnapshot"
  | "SelectCard"
  | "SelectPrinting"
  | "SelectVariant"
  | "ChangeCondition"
  | "SelectCondition"
  | "ChangeStrategy"
  | "EnterAskingPrice"
  | "Evaluate"
  | "ResetWorkspace"
  | "ReportWorkflowError";

export type WorkflowCommandPayloadMap = {
  SearchCards: { query: string };
  LoadSearchResults: {
    resolvedIntent?: ResolvedIntent;
    results: CardIdentity[];
  };
  HighlightCard: {
    identity: CardIdentity;
    identityCount: number;
  };
  LoadMarketSnapshot: {
    assetContextGeneration: number;
    printingId: string;
    providerId: string;
    updatedAt: string;
    variantId: string;
  };
  SelectCard: {
    autoSelectionReason?: string;
    identity: CardIdentity;
    identityCount: number;
    resolvedIntent?: ResolvedIntent;
  };
  SelectPrinting: {
    identityCount: number;
    printing: Card;
    printingCount: number;
    resolvedIntent?: ResolvedIntent;
  };
  SelectVariant: { variantId: string };
  ChangeCondition: { condition: CardConditionCode };
  SelectCondition: { condition: CardConditionCode };
  ChangeStrategy: { strategyId: string };
  EnterAskingPrice: { askingPrice: string };
  Evaluate: { hasDecision?: boolean };
  ResetWorkspace: Record<string, never>;
  ReportWorkflowError: {
    errorMessage: string;
    identityCount?: number;
    printingCount?: number;
  };
};

type WorkflowCommandByType = {
  [TCommandType in WorkflowCommandType]: {
    commandId: string;
    commandType: TCommandType;
    origin: WorkflowCommandOrigin;
    payload: WorkflowCommandPayloadMap[TCommandType];
    timestamp: string;
  };
};

export type WorkflowCommand<
  TCommandType extends WorkflowCommandType = WorkflowCommandType,
> = WorkflowCommandByType[TCommandType];

export function createWorkflowCommand<TCommandType extends WorkflowCommandType>(
  commandType: TCommandType,
  payload: WorkflowCommandPayloadMap[TCommandType],
  origin: WorkflowCommandOrigin = "User",
): WorkflowCommand<TCommandType> {
  return {
    commandId: `${commandType}-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}`,
    commandType,
    origin,
    payload,
    timestamp: new Date().toISOString(),
  } as WorkflowCommand<TCommandType>;
}
