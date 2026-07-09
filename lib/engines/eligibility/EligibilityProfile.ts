import type {
  EligibilityRule,
  EligibilityWorkflowId,
} from "@/lib/engines/eligibility/EligibilityRule";
import type { EligibilityReasonId } from "@/lib/engines/eligibility/EligibilityReason";

export type EligibilityDefaultDecision = {
  confidence: number;
  eligible: boolean;
  reasonId: EligibilityReasonId;
};

export type EligibilityProfile = {
  defaultDecision: EligibilityDefaultDecision;
  id: string;
  name: string;
  rules: EligibilityRule[];
  workflow: EligibilityWorkflowId;
};
