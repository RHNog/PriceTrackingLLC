import { toPrintingConstraints } from "@/lib/engines/constraints/satisfyPrintingConstraints";
import { resolvePrintingVariant } from "@/lib/engines/variantResolution/VariantResolutionPolicy";
import {
  invalidateWorkflowContext,
  type ContextChange,
} from "@/lib/workflow/commands/ContextInvalidationEngine";
import { createMarketSnapshotId } from "@/lib/workflow/AssetContextValidator";
import type { AssetContext } from "@/types/AssetContext";
import type {
  WorkflowCommand,
  WorkflowCommandType,
} from "@/lib/workflow/commands/WorkflowCommand";
import type { WorkflowCommandResult } from "@/lib/workflow/commands/WorkflowCommandResult";
import type { Card } from "@/types/card";
import type { CardIdentity } from "@/types/cardIdentity";
import type { CardConditionCode } from "@/types/conditionProfile";
import type { ResolvedIntent } from "@/types/resolvedIntent";
import type {
  VendorWorkflowContext,
  VendorWorkflowSnapshot,
  VendorWorkflowState,
  WorkflowOwnedObject,
} from "@/types/VendorWorkflowState";

const defaultContext: VendorWorkflowContext = {
  askingPrice: "",
  highlightedIdentityId: "",
  marketContextId: "default",
  selectedCondition: "NM",
  selectedIdentityId: "",
  selectedPrintingId: "",
  selectedStrategyId: "",
  selectedVariantId: "",
};

function createAssetContext(input: {
  condition?: CardConditionCode | string;
  generation: number;
  identityId?: string;
  marketContextId?: string;
  printingId?: string;
  strategyId?: string;
  variantId?: string;
}): AssetContext {
  const identityId = input.identityId ?? "";
  const printingId = input.printingId ?? "";
  const variantId = input.variantId ?? "";
  const marketContextId = input.marketContextId ?? "default";
  const strategyId = input.strategyId ?? "";

  return {
    id: [
      "asset",
      input.generation,
      identityId || "none",
      printingId || "none",
      variantId || "none",
    ].join(":"),
    identityId,
    printingId,
    variantId,
    condition: (input.condition as CardConditionCode | undefined) ?? "NM",
    marketContextId,
    strategyId,
    marketSnapshotId: "",
    cardProfileId: "",
    offerLadderId: "",
    decisionId: "",
    generation: input.generation,
    updatedAt: new Date().toISOString(),
  };
}

const defaultAssetContext = createAssetContext({ generation: 0 });

export const initialVendorWorkflowSnapshot: VendorWorkflowSnapshot = {
  assetContext: defaultAssetContext,
  state: "Idle",
  commandLog: [],
  context: defaultContext,
  identityCount: 0,
  printingCount: 0,
  invalidatedObjects: [],
  lastCommand: "INITIALIZE",
  loadedObjects: [],
  rejectedCommands: [],
  singlePrintingRuleActivated: false,
  executionStartedAt: new Date(0).toISOString(),
  executionDurationMs: 0,
};

function appendCommand(commands: string[], commandType: WorkflowCommandType) {
  return [...commands.slice(-8), commandType];
}

function unique(items: WorkflowOwnedObject[]) {
  return Array.from(new Set(items));
}

function getPolicyVariant(printing?: Card, intent?: ResolvedIntent) {
  if (!printing) {
    return undefined;
  }

  return (
    resolvePrintingVariant({
      availableVariants: printing.finishVariants ?? [],
      constraints: toPrintingConstraints(intent?.resolvedConstraints ?? []),
      printing,
    }).selectedVariant ?? undefined
  );
}

function rejectCommand(input: {
  command: WorkflowCommand;
  previous: VendorWorkflowSnapshot;
  reason: string;
}): WorkflowCommandResult {
  const now = new Date();

  return {
    accepted: false,
    command: input.command,
    reason: input.reason,
    workflow: {
      ...input.previous,
      errorMessage: input.reason,
      invalidatedObjects: [],
      lastCommand: input.command.commandType,
      loadedObjects: [],
      nextState: input.previous.state,
      previousState: input.previous.state,
      rejectedCommands: appendCommand(
        input.previous.rejectedCommands,
        input.command.commandType,
      ),
      rejectionReason: input.reason,
      executionStartedAt: now.toISOString(),
      executionDurationMs: Math.max(
        0,
        now.getTime() - new Date(input.command.timestamp).getTime(),
      ),
    },
  };
}

function acceptCommand(input: {
  assetContext?: AssetContext;
  autoSelectionReason?: string;
  command: WorkflowCommand;
  context: VendorWorkflowContext;
  errorMessage?: string;
  identityCount?: number;
  invalidatedObjects?: WorkflowOwnedObject[];
  loadedObjects?: WorkflowOwnedObject[];
  previous: VendorWorkflowSnapshot;
  printingCount?: number;
  singlePrintingRuleActivated?: boolean;
  state: VendorWorkflowState;
}): WorkflowCommandResult {
  const now = new Date();
  const workflow: VendorWorkflowSnapshot = {
    state: input.state,
    previousState: input.previous.state,
    nextState: input.state,
    commandLog: appendCommand(
      input.previous.commandLog,
      input.command.commandType,
    ),
    context: input.context,
    assetContext: input.assetContext ?? input.previous.assetContext,
    identityCount: input.identityCount ?? input.previous.identityCount,
    printingCount: input.printingCount ?? input.previous.printingCount,
    autoSelectionReason: input.autoSelectionReason,
    errorMessage: input.errorMessage,
    invalidatedObjects: unique(input.invalidatedObjects ?? []),
    lastCommand: input.command.commandType,
    loadedObjects: unique(input.loadedObjects ?? []),
    rejectedCommands: input.previous.rejectedCommands,
    singlePrintingRuleActivated:
      input.singlePrintingRuleActivated ??
      input.previous.singlePrintingRuleActivated,
    executionStartedAt: now.toISOString(),
    executionDurationMs: Math.max(
      0,
      now.getTime() - new Date(input.command.timestamp).getTime(),
    ),
  };

  return {
    accepted: true,
    command: input.command,
    workflow,
  };
}

function applyInvalidation(
  context: VendorWorkflowContext,
  change: ContextChange,
) {
  return invalidateWorkflowContext({ change, context });
}

function resolveSelection(input: {
  identity: CardIdentity;
  intent?: ResolvedIntent;
}) {
  const printingResolution = input.intent?.printingResolution;
  const hasSinglePrinting = input.identity.printings.length === 1;
  const selectedPrinting =
    (printingResolution?.shouldAutoCommitPrinting
      ? printingResolution.selectedPrinting
      : undefined) ??
    (hasSinglePrinting ? input.identity.printings[0] : undefined);
  const selectedPolicyVariant = getPolicyVariant(selectedPrinting, input.intent);
  const selectedVariant =
    printingResolution?.shouldAutoCommitVariant
      ? printingResolution.selectedVariant
      : selectedPolicyVariant;

  return {
    hasSinglePrinting,
    selectedPrinting,
    selectedVariant,
  };
}

function selectCard(input: {
  autoSelectionReason?: string;
  command: WorkflowCommand;
  identity: CardIdentity;
  identityCount: number;
  intent?: ResolvedIntent;
  previous: VendorWorkflowSnapshot;
}) {
  if (
    input.previous.context.selectedIdentityId === input.identity.id &&
    input.previous.context.selectedPrintingId
  ) {
    return acceptCommand({
      command: input.command,
      context: {
        ...input.previous.context,
        highlightedIdentityId: input.identity.id,
      },
      identityCount: input.identityCount,
      loadedObjects: [],
      previous: input.previous,
      printingCount: input.identity.printings.length,
      state: input.previous.state,
    });
  }

  if (input.identity.printings.length === 0) {
    return acceptCommand({
      command: input.command,
      context: input.previous.context,
      errorMessage: "No printing available.",
      identityCount: input.identityCount,
      previous: input.previous,
      printingCount: 0,
      state: "Error",
    });
  }

  const invalidation = applyInvalidation(input.previous.context, "Identity");
  const selection = resolveSelection({
    identity: input.identity,
    intent: input.intent,
  });
  const nextContext = {
    ...invalidation.context,
    highlightedIdentityId: input.identity.id,
    selectedCondition: "NM",
    selectedIdentityId: input.identity.id,
    selectedPrintingId: selection.selectedPrinting?.id ?? "",
    selectedVariantId: selection.selectedVariant?.id ?? "",
  };
  const nextAssetContext = createAssetContext({
    condition: "NM",
    generation: input.previous.assetContext.generation + 1,
    identityId: input.identity.id,
    marketContextId: nextContext.marketContextId,
    printingId: selection.selectedPrinting?.id,
    strategyId: nextContext.selectedStrategyId,
    variantId: selection.selectedVariant?.id,
  });
  const loadedObjects: WorkflowOwnedObject[] = ["Identity"];

  if (selection.selectedPrinting) {
    loadedObjects.push("Printing");
  }

  if (selection.selectedVariant) {
    loadedObjects.push(
      "Variant",
      "Condition",
      "Market Estimate",
      "Card Intelligence",
    );
  }

  if (selection.selectedPrinting && !selection.selectedVariant) {
    return acceptCommand({
      command: input.command,
      context: nextContext,
      assetContext: nextAssetContext,
      errorMessage: "No supported finish.",
      identityCount: input.identityCount,
      invalidatedObjects: invalidation.invalidatedObjects,
      loadedObjects,
      previous: input.previous,
      printingCount: input.identity.printings.length,
      state: "Error",
    });
  }

  return acceptCommand({
    autoSelectionReason: input.autoSelectionReason,
    command: input.command,
    context: nextContext,
    assetContext: nextAssetContext,
    identityCount: input.identityCount,
    invalidatedObjects: invalidation.invalidatedObjects,
    loadedObjects,
    previous: input.previous,
    printingCount: input.identity.printings.length,
    singlePrintingRuleActivated: selection.hasSinglePrinting,
    state: selection.selectedPrinting ? "ReadyForEvaluation" : "PrintingsLoaded",
  });
}

function loadSearchResults(
  previous: VendorWorkflowSnapshot,
  command: WorkflowCommand<"LoadSearchResults">,
) {
  const results = command.payload.results;
  const selectedIdentity =
    command.payload.resolvedIntent?.selectedIdentity ?? results[0];
  const identityCount = results.length;
  const printingCount =
    command.payload.resolvedIntent?.printingResolution?.printingCandidates
      .length ??
    selectedIdentity?.printings.length ??
    0;

  if (identityCount === 0 || !selectedIdentity) {
    return acceptCommand({
      command,
      context: previous.context,
      errorMessage: "No card identities found.",
      identityCount,
      previous,
      printingCount,
      state: "Error",
    });
  }

  const shouldAutoSelectIdentity =
    (command.payload.resolvedIntent?.confidence.overall ?? 0) >= 85 ||
    selectedIdentity.printings.length === 1;

  if (shouldAutoSelectIdentity) {
    return selectCard({
      autoSelectionReason:
        selectedIdentity.printings.length === 1
          ? "Single Printing Rule"
          : "High confidence identity resolution",
      command,
      identity: selectedIdentity,
      identityCount,
      intent: command.payload.resolvedIntent,
      previous,
    });
  }

  return acceptCommand({
    command,
    context: {
      ...previous.context,
      highlightedIdentityId: selectedIdentity.id,
    },
    identityCount,
    loadedObjects: ["Identity"],
    previous,
    printingCount,
    state: "CandidatesFound",
  });
}

export function processWorkflowCommand(
  previous: VendorWorkflowSnapshot,
  command: WorkflowCommand,
): WorkflowCommandResult {
  if (command.commandType === "ResetWorkspace") {
    const invalidation = applyInvalidation(previous.context, "Reset");

    return acceptCommand({
      command,
      context: invalidation.context,
      assetContext: createAssetContext({
        generation: previous.assetContext.generation + 1,
        strategyId: invalidation.context.selectedStrategyId,
      }),
      invalidatedObjects: invalidation.invalidatedObjects,
      previous,
      state: "Idle",
    });
  }

  if (command.commandType === "SearchCards") {
    const invalidation = applyInvalidation(previous.context, "Reset");

    return acceptCommand({
      command,
      context: invalidation.context,
      assetContext: createAssetContext({
        generation: previous.assetContext.generation + 1,
        strategyId: invalidation.context.selectedStrategyId,
      }),
      invalidatedObjects: invalidation.invalidatedObjects,
      loadedObjects: [],
      previous,
      state: command.payload.query.trim() ? "Searching" : "Idle",
    });
  }

  if (command.commandType === "LoadSearchResults") {
    return loadSearchResults(previous, command);
  }

  if (command.commandType === "HighlightCard") {
    return acceptCommand({
      command,
      context: {
        ...previous.context,
        highlightedIdentityId: command.payload.identity.id,
      },
      identityCount: command.payload.identityCount,
      previous,
      printingCount: command.payload.identity.printings.length,
      state: "IdentityHighlighted",
    });
  }

  if (command.commandType === "SelectCard") {
    return selectCard({
      autoSelectionReason: command.payload.autoSelectionReason,
      command,
      identity: command.payload.identity,
      identityCount: command.payload.identityCount,
      intent: command.payload.resolvedIntent,
      previous,
    });
  }

  if (command.commandType === "SelectPrinting") {
    const selectedVariant = getPolicyVariant(
      command.payload.printing,
      command.payload.resolvedIntent,
    );
    const invalidation = applyInvalidation(previous.context, "Printing");
    const context = {
      ...invalidation.context,
      selectedCondition: "NM",
      selectedPrintingId: command.payload.printing.id,
      selectedVariantId: selectedVariant?.id ?? "",
    };
    const nextAssetContext = createAssetContext({
      condition: "NM",
      generation: previous.assetContext.generation + 1,
      identityId: previous.context.selectedIdentityId,
      marketContextId: context.marketContextId,
      printingId: command.payload.printing.id,
      strategyId: context.selectedStrategyId,
      variantId: selectedVariant?.id,
    });

    if (!selectedVariant) {
      return acceptCommand({
        command,
        context,
        assetContext: nextAssetContext,
        errorMessage: "No supported finish.",
        identityCount: command.payload.identityCount,
        invalidatedObjects: invalidation.invalidatedObjects,
        loadedObjects: ["Printing"],
        previous,
        printingCount: command.payload.printingCount,
        state: "Error",
      });
    }

    return acceptCommand({
      command,
      context,
      assetContext: nextAssetContext,
      identityCount: command.payload.identityCount,
      invalidatedObjects: invalidation.invalidatedObjects,
      loadedObjects: [
        "Printing",
        "Variant",
        "Condition",
        "Market Estimate",
        "Card Intelligence",
      ],
      previous,
      printingCount: command.payload.printingCount,
      state: "ReadyForEvaluation",
    });
  }

  if (command.commandType === "SelectVariant") {
    const invalidation = applyInvalidation(previous.context, "Variant");
    const context = {
      ...invalidation.context,
      selectedVariantId: command.payload.variantId,
    };

    return acceptCommand({
      command,
      context,
      assetContext: createAssetContext({
        condition: context.selectedCondition,
        generation: previous.assetContext.generation + 1,
        identityId: context.selectedIdentityId,
        marketContextId: context.marketContextId,
        printingId: context.selectedPrintingId,
        strategyId: context.selectedStrategyId,
        variantId: context.selectedVariantId,
      }),
      invalidatedObjects: invalidation.invalidatedObjects,
      loadedObjects: ["Variant", "Market Estimate", "Card Intelligence"],
      previous,
      state: "ReadyForEvaluation",
    });
  }

  if (
    command.commandType === "ChangeCondition" ||
    command.commandType === "SelectCondition"
  ) {
    const invalidation = applyInvalidation(previous.context, "Condition");
    const context = {
      ...invalidation.context,
      selectedCondition: command.payload.condition,
    };

    return acceptCommand({
      command,
      context,
      assetContext: createAssetContext({
        condition: context.selectedCondition,
        generation: previous.assetContext.generation + 1,
        identityId: context.selectedIdentityId,
        marketContextId: context.marketContextId,
        printingId: context.selectedPrintingId,
        strategyId: context.selectedStrategyId,
        variantId: context.selectedVariantId,
      }),
      invalidatedObjects: invalidation.invalidatedObjects,
      previous,
      state: "ReadyForEvaluation",
    });
  }

  if (command.commandType === "ChangeStrategy") {
    const invalidation = applyInvalidation(previous.context, "Strategy");
    const context = {
      ...invalidation.context,
      selectedStrategyId: command.payload.strategyId,
    };

    return acceptCommand({
      command,
      context,
      assetContext: createAssetContext({
        condition: context.selectedCondition,
        generation: previous.assetContext.generation + 1,
        identityId: context.selectedIdentityId,
        marketContextId: context.marketContextId,
        printingId: context.selectedPrintingId,
        strategyId: context.selectedStrategyId,
        variantId: context.selectedVariantId,
      }),
      invalidatedObjects: invalidation.invalidatedObjects,
      previous,
      state: previous.state,
    });
  }

  if (command.commandType === "EnterAskingPrice") {
    const invalidation = applyInvalidation(previous.context, "Asking Price");

    return acceptCommand({
      command,
      context: {
        ...invalidation.context,
        askingPrice: command.payload.askingPrice,
      },
      invalidatedObjects: invalidation.invalidatedObjects,
      previous,
      state: previous.state === "Idle" ? "Idle" : "ReadyForEvaluation",
    });
  }

  if (command.commandType === "LoadMarketSnapshot") {
    const snapshotId = createMarketSnapshotId(command.payload);

    if (
      command.payload.assetContextGeneration !==
        previous.assetContext.generation ||
      command.payload.printingId !== previous.assetContext.printingId ||
      command.payload.variantId !== previous.assetContext.variantId
    ) {
      return rejectCommand({
        command,
        previous,
        reason: "Market snapshot does not match the current Asset Context.",
      });
    }

    return acceptCommand({
      command,
      context: previous.context,
      assetContext: {
        ...previous.assetContext,
        marketSnapshotId: snapshotId,
        cardProfileId: [
          "card-profile",
          previous.assetContext.generation,
          previous.assetContext.printingId,
          previous.assetContext.variantId,
          previous.assetContext.condition,
        ].join(":"),
        offerLadderId: [
          "offer-ladder",
          previous.assetContext.generation,
          previous.assetContext.strategyId || "none",
        ].join(":"),
        decisionId: [
          "decision",
          previous.assetContext.generation,
          previous.assetContext.printingId,
          previous.assetContext.variantId,
        ].join(":"),
        updatedAt: new Date().toISOString(),
      },
      loadedObjects: [
        "Market Estimate",
        "Card Intelligence",
        "Offer Ladder",
        "Decision",
      ],
      previous,
      state: previous.state,
    });
  }

  if (command.commandType === "Evaluate") {
    return acceptCommand({
      command,
      context: previous.context,
      loadedObjects: command.payload.hasDecision
        ? ["Evaluation", "Offer Ladder", "Decision"]
        : [],
      previous,
      state: command.payload.hasDecision ? "EvaluationComplete" : "Error",
    });
  }

  if (command.commandType === "ReportWorkflowError") {
    return acceptCommand({
      command,
      context: previous.context,
      errorMessage: command.payload.errorMessage,
      identityCount: command.payload.identityCount,
      previous,
      printingCount: command.payload.printingCount,
      state: "Error",
    });
  }

  return rejectCommand({
    command,
    previous,
    reason: "Unsupported workflow command.",
  });
}
