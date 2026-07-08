export type ReadinessStatus =
  | "READY"
  | "PARTIAL"
  | "WAITING_FOR_CONFIGURATION"
  | "WAITING_FOR_PROVIDER"
  | "WAITING_FOR_MARKET_DATA"
  | "INVALID"
  | "ERROR";

export type ReadinessIssueType =
  | "Configuration Problem"
  | "Missing Data"
  | "Business Rule Failure"
  | "Calculation Failure"
  | "Internal Error";

