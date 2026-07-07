import type { PrintingConstraint } from "@/types/printingConstraint";

export interface ConstraintMatch {
  constraint: PrintingConstraint;
  matched: boolean;
  score: number;
}
