import type { EligibilityProfile } from "@/lib/engines/eligibility/EligibilityProfile";

export const VENDOR_WORKSPACE_ELIGIBILITY_PROFILE_ID =
  "default-vendor-workspace";
export const VENDOR_WORKSPACE_WORKFLOW_ID = "vendor-workspace";
export const VENDOR_WORKSPACE_WORKFLOW_LABEL = "Vendor Workspace";

export const defaultVendorEligibilityProfile: EligibilityProfile = {
  id: VENDOR_WORKSPACE_ELIGIBILITY_PROFILE_ID,
  name: "Default Vendor Workspace",
  workflow: VENDOR_WORKSPACE_WORKFLOW_ID,
  defaultDecision: {
    confidence: 60,
    eligible: true,
    reasonId: "PHYSICAL_TRADING_CARD",
  },
  rules: [
    {
      id: "vendor-magic-online",
      workflow: VENDOR_WORKSPACE_WORKFLOW_ID,
      priority: 1000,
      eligible: false,
      reasonId: "MAGIC_ONLINE",
      confidence: 98,
      matcher: {
        nameIncludesAny: ["magic online"],
        productFamilyIncludesAny: ["magic online", "mtgo"],
        setIncludesAny: ["magic online", "mtgo"],
      },
    },
    {
      id: "vendor-arena-only",
      workflow: VENDOR_WORKSPACE_WORKFLOW_ID,
      priority: 990,
      eligible: false,
      reasonId: "ARENA_ONLY",
      confidence: 98,
      matcher: {
        nameIncludesAny: ["arena only"],
        productFamilyIncludesAny: ["arena", "alchemy"],
        setIncludesAny: ["arena", "alchemy"],
      },
    },
    {
      id: "vendor-digital-only",
      workflow: VENDOR_WORKSPACE_WORKFLOW_ID,
      priority: 980,
      eligible: false,
      reasonId: "DIGITAL_ONLY_PRODUCT",
      confidence: 96,
      matcher: {
        promoTypeIncludesAny: ["digital"],
        sourceGamesIncludesAny: ["arena", "mtgo"],
        sourceGamesExcludesAll: ["paper"],
      },
    },
    {
      id: "vendor-placeholder",
      workflow: VENDOR_WORKSPACE_WORKFLOW_ID,
      priority: 970,
      eligible: false,
      reasonId: "PLACEHOLDER_OBJECT",
      confidence: 95,
      matcher: {
        nameIncludesAny: ["placeholder"],
        productFamilyIncludesAny: ["placeholder"],
        setIncludesAny: ["placeholder"],
        typeLineIncludesAny: ["placeholder"],
      },
    },
    {
      id: "vendor-marketing-insert",
      workflow: VENDOR_WORKSPACE_WORKFLOW_ID,
      priority: 960,
      eligible: false,
      reasonId: "MARKETING_INSERT",
      confidence: 94,
      matcher: {
        nameIncludesAny: ["marketing insert", "insert card"],
        productFamilyIncludesAny: ["marketing insert"],
        setIncludesAny: ["marketing insert"],
        typeLineIncludesAny: ["marketing insert", "insert"],
      },
    },
    {
      id: "vendor-token-emblem",
      workflow: VENDOR_WORKSPACE_WORKFLOW_ID,
      priority: 950,
      eligible: false,
      reasonId: "TOKEN_OR_EMBLEM",
      confidence: 96,
      matcher: {
        relationshipTypeAnyOf: ["EMBLEM", "TOKEN"],
        typeLineIncludesAny: ["emblem", "token"],
      },
    },
    {
      id: "vendor-checklist",
      workflow: VENDOR_WORKSPACE_WORKFLOW_ID,
      priority: 940,
      eligible: false,
      reasonId: "CHECKLIST_CARD",
      confidence: 95,
      matcher: {
        nameIncludesAny: ["checklist"],
        typeLineIncludesAny: ["checklist"],
      },
    },
    {
      id: "vendor-art-series",
      workflow: VENDOR_WORKSPACE_WORKFLOW_ID,
      priority: 930,
      eligible: false,
      reasonId: "ART_SERIES",
      confidence: 95,
      matcher: {
        nameIncludesAny: ["art series"],
        productFamilyIncludesAny: ["art series"],
        setIncludesAny: ["art series"],
        typeLineIncludesAny: ["art card"],
      },
    },
    {
      id: "vendor-oversized",
      workflow: VENDOR_WORKSPACE_WORKFLOW_ID,
      priority: 920,
      eligible: false,
      reasonId: "OVERSIZED_CARD",
      confidence: 95,
      matcher: {
        nameIncludesAny: ["oversized"],
        productFamilyIncludesAny: ["oversized"],
        promoTypeIncludesAny: ["oversized"],
        setIncludesAny: ["oversized"],
        typeLineIncludesAny: ["oversized"],
      },
    },
    {
      id: "vendor-judge-promo",
      workflow: VENDOR_WORKSPACE_WORKFLOW_ID,
      priority: 500,
      eligible: true,
      reasonId: "JUDGE_PROMO",
      confidence: 96,
      matcher: {
        promoTypeIncludesAny: ["judge_gift", "judge"],
        productFamilyIncludesAny: ["judge"],
        setIncludesAny: ["judge"],
      },
    },
    {
      id: "vendor-prerelease-promo",
      workflow: VENDOR_WORKSPACE_WORKFLOW_ID,
      priority: 490,
      eligible: true,
      reasonId: "PRERELEASE_PROMO",
      confidence: 94,
      matcher: {
        promoTypeIncludesAny: ["prerelease", "datestamped"],
      },
    },
    {
      id: "vendor-buy-a-box-promo",
      workflow: VENDOR_WORKSPACE_WORKFLOW_ID,
      priority: 480,
      eligible: true,
      reasonId: "BUY_A_BOX_PROMO",
      confidence: 94,
      matcher: {
        promoTypeIncludesAny: ["buyabox", "buy-a-box"],
      },
    },
    {
      id: "vendor-secret-lair",
      workflow: VENDOR_WORKSPACE_WORKFLOW_ID,
      priority: 470,
      eligible: true,
      reasonId: "SECRET_LAIR_CARD",
      confidence: 95,
      matcher: {
        productFamilyIncludesAny: ["secret lair"],
        setIncludesAny: ["secret lair"],
      },
    },
    {
      id: "vendor-serialized",
      workflow: VENDOR_WORKSPACE_WORKFLOW_ID,
      priority: 460,
      eligible: true,
      reasonId: "SERIALIZED_CARD",
      confidence: 92,
      matcher: {
        nameIncludesAny: ["serialized"],
        productFamilyIncludesAny: ["serialized"],
        promoTypeIncludesAny: ["serialized"],
        treatmentIncludesAny: ["serialized"],
      },
    },
    {
      id: "vendor-masterpiece",
      workflow: VENDOR_WORKSPACE_WORKFLOW_ID,
      priority: 450,
      eligible: true,
      reasonId: "MASTERPIECE",
      confidence: 95,
      matcher: {
        productFamilyIncludesAny: ["masterpiece", "invention", "invocation", "expedition"],
        setIncludesAny: ["masterpiece", "invention", "invocation", "expedition"],
        treatmentIncludesAny: ["masterpiece", "invocation"],
      },
    },
    {
      id: "vendor-showcase",
      workflow: VENDOR_WORKSPACE_WORKFLOW_ID,
      priority: 440,
      eligible: true,
      reasonId: "SHOWCASE_CARD",
      confidence: 90,
      matcher: {
        frameEffectIncludesAny: ["showcase"],
        treatmentIncludesAny: ["showcase"],
      },
    },
    {
      id: "vendor-retro-frame",
      workflow: VENDOR_WORKSPACE_WORKFLOW_ID,
      priority: 430,
      eligible: true,
      reasonId: "RETRO_FRAME_CARD",
      confidence: 90,
      matcher: {
        frameEffectIncludesAny: ["retro"],
        treatmentIncludesAny: ["retro"],
      },
    },
    {
      id: "vendor-textless",
      workflow: VENDOR_WORKSPACE_WORKFLOW_ID,
      priority: 420,
      eligible: true,
      reasonId: "TEXTLESS_CARD",
      confidence: 90,
      matcher: {
        nameIncludesAny: ["textless"],
        treatmentIncludesAny: ["textless"],
        typeLineIncludesAny: ["textless"],
      },
    },
    {
      id: "vendor-extended-art",
      workflow: VENDOR_WORKSPACE_WORKFLOW_ID,
      priority: 410,
      eligible: true,
      reasonId: "EXTENDED_ART",
      confidence: 90,
      matcher: {
        frameEffectIncludesAny: ["extendedart"],
        treatmentIncludesAny: ["extended art"],
      },
    },
    {
      id: "vendor-borderless",
      workflow: VENDOR_WORKSPACE_WORKFLOW_ID,
      priority: 400,
      eligible: true,
      reasonId: "BORDERLESS_CARD",
      confidence: 90,
      matcher: {
        frameEffectIncludesAny: ["borderless"],
        treatmentIncludesAny: ["borderless"],
      },
    },
    {
      id: "vendor-foreign-language",
      workflow: VENDOR_WORKSPACE_WORKFLOW_ID,
      priority: 390,
      eligible: true,
      reasonId: "FOREIGN_LANGUAGE_PRINTING",
      confidence: 88,
      matcher: {
        languageNotAnyOf: ["", "en", "english"],
      },
    },
    {
      id: "vendor-physical-promo",
      workflow: VENDOR_WORKSPACE_WORKFLOW_ID,
      priority: 380,
      eligible: true,
      reasonId: "PHYSICAL_PROMO",
      confidence: 86,
      matcher: {
        promoTypeIncludesAny: ["promo", "promopack", "setpromo", "release"],
      },
    },
    {
      id: "vendor-physical-card",
      workflow: VENDOR_WORKSPACE_WORKFLOW_ID,
      priority: 100,
      eligible: true,
      reasonId: "PHYSICAL_TRADING_CARD",
      confidence: 84,
      matcher: {
        sourceGamesIncludesAny: ["paper"],
      },
    },
  ],
};

export function getEligibilityProfile(profileId: string) {
  if (profileId === VENDOR_WORKSPACE_ELIGIBILITY_PROFILE_ID) {
    return defaultVendorEligibilityProfile;
  }

  return null;
}
