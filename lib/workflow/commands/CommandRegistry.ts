import type { WorkflowCommandType } from "@/lib/workflow/commands/WorkflowCommand";

export type CommandDefinition = {
  description: string;
  invalidates: string[];
};

export const CommandRegistry: Record<WorkflowCommandType, CommandDefinition> = {
  ChangeStrategy: {
    description: "Change the active buying strategy.",
    invalidates: ["Offer Ladder", "Decision", "Evaluation"],
  },
  ChangeCondition: {
    description: "Change the physical card condition.",
    invalidates: [
      "Market Estimate",
      "Card Intelligence",
      "Offer Ladder",
      "Decision",
      "Evaluation",
    ],
  },
  EnterAskingPrice: {
    description: "Enter the current seller asking price.",
    invalidates: ["Decision", "Evaluation"],
  },
  Evaluate: {
    description: "Request purchase evaluation from the business engines.",
    invalidates: [],
  },
  HighlightCard: {
    description: "Move keyboard or pointer focus to a card identity.",
    invalidates: [],
  },
  LoadSearchResults: {
    description: "Load normalized card identity results from the search engine.",
    invalidates: [],
  },
  LoadMarketSnapshot: {
    description: "Attach a market snapshot to the current Asset Context.",
    invalidates: [],
  },
  ReportWorkflowError: {
    description: "Record an orchestration failure without partial updates.",
    invalidates: [],
  },
  ResetWorkspace: {
    description: "Clear the current Vendor Workspace session.",
    invalidates: [
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
  },
  SearchCards: {
    description: "Start a card identity search.",
    invalidates: [
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
  },
  SelectCard: {
    description: "Select a card identity for purchase evaluation.",
    invalidates: [
      "Printing",
      "Variant",
      "Condition",
      "Market Estimate",
      "Card Intelligence",
      "Offer Ladder",
      "Decision",
      "Evaluation",
    ],
  },
  SelectCondition: {
    description: "Select the physical card condition.",
    invalidates: [
      "Market Estimate",
      "Card Intelligence",
      "Offer Ladder",
      "Decision",
      "Evaluation",
    ],
  },
  SelectPrinting: {
    description: "Select a specific printing for the active card identity.",
    invalidates: [
      "Variant",
      "Condition",
      "Market Estimate",
      "Card Intelligence",
      "Offer Ladder",
      "Decision",
      "Evaluation",
    ],
  },
  SelectVariant: {
    description: "Select a purchasable finish variant.",
    invalidates: [
      "Market Estimate",
      "Card Intelligence",
      "Offer Ladder",
      "Decision",
      "Evaluation",
    ],
  },
};
