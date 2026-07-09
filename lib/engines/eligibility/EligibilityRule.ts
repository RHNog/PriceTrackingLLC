import type { EligibilityReasonId } from "@/lib/engines/eligibility/EligibilityReason";
import type { EntityRelationshipType } from "@/types/entityRelationship";

export type EligibilityWorkflowId = "vendor-workspace" | (string & {});

export type EligibilityRuleMatcher = {
  componentAnyOf?: string[];
  frameEffectIncludesAny?: string[];
  languageNotAnyOf?: string[];
  layoutAnyOf?: string[];
  nameIncludesAny?: string[];
  productFamilyIncludesAny?: string[];
  promoTypeIncludesAny?: string[];
  relationshipTypeAnyOf?: EntityRelationshipType[];
  setIncludesAny?: string[];
  sourceGamesExcludesAll?: string[];
  sourceGamesIncludesAny?: string[];
  treatmentIncludesAny?: string[];
  typeLineIncludesAny?: string[];
};

export type EligibilityRule = {
  confidence: number;
  eligible: boolean;
  id: string;
  matcher: EligibilityRuleMatcher;
  priority: number;
  reasonId: EligibilityReasonId;
  workflow: EligibilityWorkflowId;
};
