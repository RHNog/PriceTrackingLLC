export type IdentityValueState =
  | "Explicit"
  | "Derived"
  | "Inferred"
  | "Unknown"
  | "Not Applicable"
  | "Provider Does Not Supply"
  | "Pending Support";

export type IdentityTreatment = {
  confidence: number;
  explanation: string;
  source: string;
  state: IdentityValueState;
  value: string;
};
