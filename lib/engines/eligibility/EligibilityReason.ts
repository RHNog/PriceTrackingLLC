export type EligibilityReasonId =
  | "ARENA_ONLY"
  | "ART_SERIES"
  | "BORDERLESS_CARD"
  | "BUY_A_BOX_PROMO"
  | "CHECKLIST_CARD"
  | "DIGITAL_ONLY_PRODUCT"
  | "EXTENDED_ART"
  | "FOREIGN_LANGUAGE_PRINTING"
  | "JUDGE_PROMO"
  | "MAGIC_ONLINE"
  | "MARKETING_INSERT"
  | "MASTERPIECE"
  | "OVERSIZED_CARD"
  | "PHYSICAL_PROMO"
  | "PHYSICAL_TRADING_CARD"
  | "PLACEHOLDER_OBJECT"
  | "PRERELEASE_PROMO"
  | "RETRO_FRAME_CARD"
  | "SECRET_LAIR_CARD"
  | "SERIALIZED_CARD"
  | "SHOWCASE_CARD"
  | "TEXTLESS_CARD"
  | "TOKEN_OR_EMBLEM"
  | "UNKNOWN_WORKFLOW_SUPPORT";

export type EligibilityReason = {
  description: string;
  id: EligibilityReasonId;
};

export const eligibilityReasons: Record<EligibilityReasonId, EligibilityReason> = {
  ARENA_ONLY: {
    id: "ARENA_ONLY",
    description: "Arena-only product",
  },
  ART_SERIES: {
    id: "ART_SERIES",
    description: "Art Series card",
  },
  BORDERLESS_CARD: {
    id: "BORDERLESS_CARD",
    description: "Borderless card",
  },
  BUY_A_BOX_PROMO: {
    id: "BUY_A_BOX_PROMO",
    description: "Buy-a-Box promo",
  },
  CHECKLIST_CARD: {
    id: "CHECKLIST_CARD",
    description: "Checklist card",
  },
  DIGITAL_ONLY_PRODUCT: {
    id: "DIGITAL_ONLY_PRODUCT",
    description: "Digital-only product",
  },
  EXTENDED_ART: {
    id: "EXTENDED_ART",
    description: "Extended art card",
  },
  FOREIGN_LANGUAGE_PRINTING: {
    id: "FOREIGN_LANGUAGE_PRINTING",
    description: "Foreign-language printing",
  },
  JUDGE_PROMO: {
    id: "JUDGE_PROMO",
    description: "Judge promo",
  },
  MAGIC_ONLINE: {
    id: "MAGIC_ONLINE",
    description: "Magic Online product",
  },
  MARKETING_INSERT: {
    id: "MARKETING_INSERT",
    description: "Marketing insert",
  },
  MASTERPIECE: {
    id: "MASTERPIECE",
    description: "Masterpiece printing",
  },
  OVERSIZED_CARD: {
    id: "OVERSIZED_CARD",
    description: "Oversized card",
  },
  PHYSICAL_PROMO: {
    id: "PHYSICAL_PROMO",
    description: "Physical promo",
  },
  PHYSICAL_TRADING_CARD: {
    id: "PHYSICAL_TRADING_CARD",
    description: "Physical trading card",
  },
  PLACEHOLDER_OBJECT: {
    id: "PLACEHOLDER_OBJECT",
    description: "Placeholder object",
  },
  PRERELEASE_PROMO: {
    id: "PRERELEASE_PROMO",
    description: "Prerelease promo",
  },
  RETRO_FRAME_CARD: {
    id: "RETRO_FRAME_CARD",
    description: "Retro frame card",
  },
  SECRET_LAIR_CARD: {
    id: "SECRET_LAIR_CARD",
    description: "Secret Lair card",
  },
  SERIALIZED_CARD: {
    id: "SERIALIZED_CARD",
    description: "Serialized card",
  },
  SHOWCASE_CARD: {
    id: "SHOWCASE_CARD",
    description: "Showcase card",
  },
  TEXTLESS_CARD: {
    id: "TEXTLESS_CARD",
    description: "Textless card",
  },
  TOKEN_OR_EMBLEM: {
    id: "TOKEN_OR_EMBLEM",
    description: "Token or emblem",
  },
  UNKNOWN_WORKFLOW_SUPPORT: {
    id: "UNKNOWN_WORKFLOW_SUPPORT",
    description: "Workflow support is not configured",
  },
};
