import type { Card } from "@/types/card";
import type { CardConditionCode } from "@/types/conditionProfile";
import type { PrintingVariant } from "@/types/printingVariant";

export type CommandPaletteMode =
  | "Cards"
  | "Watchlists"
  | "Collections"
  | "Inventory"
  | "Commands"
  | "Settings";

export type CommandPaletteContext =
  | "MarketWatch"
  | "VendorWorkspace"
  | "General";

export type CommandPaletteAssetSelection = {
  condition: CardConditionCode;
  identityId: string;
  printing: Card;
  query: string;
  variant: PrintingVariant;
};

export const commandPaletteSelectionEvent = "phronesis:command-palette-selection";

export function getWorkflowActionLabel(context: CommandPaletteContext) {
  if (context === "MarketWatch") return "Add to Watchlist";
  if (context === "VendorWorkspace") return "Open Purchase Evaluation";
  return "Open Vendor Workspace";
}

export function createVendorSelectionUrl(selection: CommandPaletteAssetSelection) {
  const params = new URLSearchParams({
    search: selection.query,
    printingId: selection.printing.id,
    variantId: selection.variant.id,
    condition: selection.condition,
  });

  return `/vendor?${params.toString()}`;
}

export function dispatchWorkflowSelection(selection: CommandPaletteAssetSelection) {
  window.dispatchEvent(
    new CustomEvent<CommandPaletteAssetSelection>(commandPaletteSelectionEvent, {
      detail: selection,
    }),
  );
}
