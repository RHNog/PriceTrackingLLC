import type {
  VendorWorkflowContext,
  WorkflowOwnedObject,
} from "@/types/VendorWorkflowState";

export type ContextChange =
  | "Identity"
  | "Printing"
  | "Variant"
  | "Condition"
  | "Market Context"
  | "Strategy"
  | "Asking Price"
  | "Reset";

type InvalidateContextInput = {
  change: ContextChange;
  context: VendorWorkflowContext;
};

export type ContextInvalidationResult = {
  context: VendorWorkflowContext;
  invalidatedObjects: WorkflowOwnedObject[];
};

function unique(items: WorkflowOwnedObject[]) {
  return Array.from(new Set(items));
}

export function invalidateWorkflowContext(
  input: InvalidateContextInput,
): ContextInvalidationResult {
  const context = { ...input.context };
  const invalidatedObjects: WorkflowOwnedObject[] = [];

  if (input.change === "Reset") {
    return {
      context: {
        askingPrice: "",
        highlightedIdentityId: "",
        marketContextId: "default",
        selectedCondition: "NM",
        selectedIdentityId: "",
        selectedPrintingId: "",
        selectedStrategyId: context.selectedStrategyId,
        selectedVariantId: "",
      },
      invalidatedObjects: [
        "Identity",
        "Printing",
        "Variant",
        "Condition",
        "Market Estimate",
        "Card Intelligence",
        "Offer Ladder",
        "Decision",
        "Evaluation",
      ],
    };
  }

  if (input.change === "Identity") {
    context.selectedPrintingId = "";
    context.selectedVariantId = "";
    context.selectedCondition = "NM";
    context.askingPrice = "";
    invalidatedObjects.push(
      "Printing",
      "Variant",
      "Condition",
      "Market Estimate",
      "Card Intelligence",
      "Offer Ladder",
      "Decision",
      "Evaluation",
    );
  }

  if (input.change === "Printing") {
    context.selectedVariantId = "";
    context.selectedCondition = "NM";
    context.askingPrice = "";
    invalidatedObjects.push(
      "Variant",
      "Condition",
      "Market Estimate",
      "Card Intelligence",
      "Offer Ladder",
      "Decision",
      "Evaluation",
    );
  }

  if (input.change === "Variant" || input.change === "Condition") {
    invalidatedObjects.push(
      "Market Estimate",
      "Card Intelligence",
      "Offer Ladder",
      "Decision",
      "Evaluation",
    );
  }

  if (input.change === "Market Context") {
    invalidatedObjects.push(
      "Market Estimate",
      "Card Intelligence",
      "Offer Ladder",
      "Decision",
      "Evaluation",
    );
  }

  if (input.change === "Strategy") {
    invalidatedObjects.push("Offer Ladder", "Decision", "Evaluation");
  }

  if (input.change === "Asking Price") {
    invalidatedObjects.push("Decision");
  }

  return {
    context,
    invalidatedObjects: unique(invalidatedObjects),
  };
}
