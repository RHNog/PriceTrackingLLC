export type CardConditionCode = "NM" | "LP" | "MP" | "HP" | "DMG";

export interface ConditionProfile {
  code: CardConditionCode;
  label:
    | "Near Mint"
    | "Lightly Played"
    | "Moderately Played"
    | "Heavily Played"
    | "Damaged";
  marketMultiplier: number;
  offerMultiplier: number;
  confidenceAdjustment: number;
}

export const conditionProfiles: ConditionProfile[] = [
  {
    code: "NM",
    label: "Near Mint",
    marketMultiplier: 1,
    offerMultiplier: 1,
    confidenceAdjustment: 0,
  },
  {
    code: "LP",
    label: "Lightly Played",
    marketMultiplier: 0.84,
    offerMultiplier: 0.82,
    confidenceAdjustment: -4,
  },
  {
    code: "MP",
    label: "Moderately Played",
    marketMultiplier: 0.63,
    offerMultiplier: 0.6,
    confidenceAdjustment: -10,
  },
  {
    code: "HP",
    label: "Heavily Played",
    marketMultiplier: 0.46,
    offerMultiplier: 0.42,
    confidenceAdjustment: -16,
  },
  {
    code: "DMG",
    label: "Damaged",
    marketMultiplier: 0.27,
    offerMultiplier: 0.24,
    confidenceAdjustment: -25,
  },
];

export function findConditionProfile(code: CardConditionCode) {
  return (
    conditionProfiles.find((condition) => condition.code === code) ??
    conditionProfiles[0]
  );
}
