export interface Constraint {
  confidence?: number;
  field: string;
  label: string;
  matchType?: string;
  sourceToken?: string;
  value: string;
}
