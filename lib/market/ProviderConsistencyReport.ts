export interface ProviderConsistencyReport {
  matchedAsset: boolean;
  matchedCondition: boolean;
  matchedFinish: boolean;
  matchedGame: boolean;
  matchedLanguage: boolean;
  matchedPrinting: boolean;
  matchedProductIdentifier: boolean;
  providerTimestampValid: boolean;
  rejectedFields: string[];
  warnings: string[];
}
