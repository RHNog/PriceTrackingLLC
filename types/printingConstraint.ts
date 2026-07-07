export type PrintingConstraintType =
  | "collectorNumber"
  | "condition"
  | "finish"
  | "frame"
  | "game"
  | "grading"
  | "language"
  | "product"
  | "promo"
  | "releaseYear"
  | "set"
  | "setCode"
  | "treatment"
  | "variant";

export type PrintingConstraintPriority =
  | "mandatory"
  | "preferred"
  | "informational";

export interface PrintingConstraint {
  confidence: number;
  priority: PrintingConstraintPriority;
  sourceToken: string;
  type: PrintingConstraintType;
  value: string;
}
