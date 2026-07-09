import {
  eligibilityReasons,
  type EligibilityReason,
} from "@/lib/engines/eligibility/EligibilityReason";
import type { EligibilityProfile } from "@/lib/engines/eligibility/EligibilityProfile";
import {
  defaultVendorEligibilityProfile,
  VENDOR_WORKSPACE_WORKFLOW_LABEL,
} from "@/lib/engines/eligibility/EligibilityRegistry";
import type {
  EligibilityRule,
  EligibilityRuleMatcher,
} from "@/lib/engines/eligibility/EligibilityRule";
import type { Card } from "@/types/card";
import type { CardIdentity } from "@/types/cardIdentity";
import type { SearchResult } from "@/types/searchResult";

export type AssetEligibilityResult = {
  assetId: string;
  assetName: string;
  confidence: number;
  eligible: boolean;
  matchedRuleId: string;
  reason: EligibilityReason;
  workflow: string;
};

export type IdentityEligibilityResult = {
  eligible: boolean;
  identity: CardIdentity;
  printings: AssetEligibilityResult[];
  workflow: string;
};

export type EligibilityFilterResult = {
  diagnostics: IdentityEligibilityResult[];
  results: SearchResult<CardIdentity>[];
};

export class AssetEligibilityEngine {
  constructor(private readonly profile: EligibilityProfile) {}

  evaluate(asset: Card): AssetEligibilityResult {
    const matchedRule = this.profile.rules
      .filter((rule) => rule.workflow === this.profile.workflow)
      .sort((left, right) => right.priority - left.priority)
      .find((rule) => matchesRule(asset, rule));
    const decision = matchedRule ?? {
      confidence: this.profile.defaultDecision.confidence,
      eligible: this.profile.defaultDecision.eligible,
      id: "default-decision",
      reasonId: this.profile.defaultDecision.reasonId,
    };

    return {
      assetId: asset.id,
      assetName: asset.name,
      confidence: decision.confidence,
      eligible: decision.eligible,
      matchedRuleId: decision.id,
      reason: eligibilityReasons[decision.reasonId],
      workflow: formatWorkflowLabel(this.profile.workflow),
    };
  }

  evaluateIdentity(identity: CardIdentity): IdentityEligibilityResult {
    const printings = identity.printings.map((printing) => this.evaluate(printing));

    return {
      eligible: printings.some((result) => result.eligible),
      identity,
      printings,
      workflow: formatWorkflowLabel(this.profile.workflow),
    };
  }

  filterSearchResults(
    results: SearchResult<CardIdentity>[],
  ): EligibilityFilterResult {
    const diagnostics = results.map((result) =>
      this.evaluateIdentity(result.item),
    );
    const diagnosticsById = new Map(
      diagnostics.map((diagnostic) => [diagnostic.identity.id, diagnostic]),
    );

    return {
      diagnostics,
      results: results
        .map((result) => {
          const diagnostic = diagnosticsById.get(result.item.id);
          const eligiblePrintingIds = new Set(
            diagnostic?.printings
              .filter((printing) => printing.eligible)
              .map((printing) => printing.assetId) ?? [],
          );
          const printings = result.item.printings.filter((printing) =>
            eligiblePrintingIds.has(printing.id),
          );

          return {
            ...result,
            item: {
              ...result.item,
              printings,
            },
          };
        })
        .filter((result) => result.item.printings.length > 0),
    };
  }
}

export const defaultVendorEligibilityEngine = new AssetEligibilityEngine(
  defaultVendorEligibilityProfile,
);

export function filterIdentityResultsForVendorWorkflow(
  results: SearchResult<CardIdentity>[],
) {
  return defaultVendorEligibilityEngine.filterSearchResults(results);
}

function matchesRule(asset: Card, rule: EligibilityRule) {
  return matchesMatcher(asset, rule.matcher);
}

function matchesMatcher(asset: Card, matcher: EligibilityRuleMatcher) {
  const alternatives = [
    matchesAnyText(asset.component, matcher.componentAnyOf),
    matchesAnyText(asset.layout, matcher.layoutAnyOf),
    matchesAnyText(asset.name, matcher.nameIncludesAny),
    matchesAnyText(asset.productFamily, matcher.productFamilyIncludesAny),
    matchesAnyText(asset.set, matcher.setIncludesAny),
    matchesAnyText(asset.treatment, matcher.treatmentIncludesAny),
    matchesAnyText(asset.typeLine, matcher.typeLineIncludesAny),
    matchesAnyArrayText(asset.frameEffects, matcher.frameEffectIncludesAny),
    matchesAnyArrayText(asset.promoTypes, matcher.promoTypeIncludesAny),
    matchesAnyArrayText(asset.sourceGames, matcher.sourceGamesIncludesAny),
    matchesRelationship(asset, matcher.relationshipTypeAnyOf),
  ].filter((match): match is boolean => match !== undefined);

  if (alternatives.length > 0 && !alternatives.some(Boolean)) {
    return false;
  }

  return [
    excludesAllArrayText(asset.sourceGames, matcher.sourceGamesExcludesAll),
    matchesLanguageExclusion(asset.language, matcher.languageNotAnyOf),
  ].every(Boolean);
}

function matchesAnyText(value: string | undefined, expected: string[] | undefined) {
  if (!expected?.length) {
    return undefined;
  }

  const normalizedValue = normalize(value);

  return expected.some((item) => normalizedValue.includes(normalize(item)));
}

function matchesAnyArrayText(
  values: string[] | undefined,
  expected: string[] | undefined,
) {
  if (!expected?.length) {
    return undefined;
  }

  return (values ?? []).some((value) =>
    expected.some((item) => normalize(value).includes(normalize(item))),
  );
}

function excludesAllArrayText(
  values: string[] | undefined,
  excluded: string[] | undefined,
) {
  if (!excluded?.length) {
    return true;
  }

  return !(values ?? []).some((value) =>
    excluded.some((item) => normalize(value) === normalize(item)),
  );
}

function matchesLanguageExclusion(
  value: string | undefined,
  excluded: string[] | undefined,
) {
  if (!excluded?.length) {
    return true;
  }

  return !excluded.includes(normalize(value));
}

function matchesRelationship(
  asset: Card,
  expected: EligibilityRuleMatcher["relationshipTypeAnyOf"],
) {
  if (!expected?.length) {
    return undefined;
  }

  return expected.includes(asset.identityRelationship?.type ?? "UNKNOWN");
}

function normalize(value: string | undefined) {
  return (value ?? "").trim().toLowerCase();
}

function formatWorkflowLabel(workflow: string) {
  if (workflow === defaultVendorEligibilityProfile.workflow) {
    return VENDOR_WORKSPACE_WORKFLOW_LABEL;
  }

  return workflow;
}
