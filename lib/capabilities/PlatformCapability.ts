export type CapabilityStatus =
  | "Operational"
  | "Pending"
  | "Unavailable"
  | "Not Applicable"
  | "Disabled";

export type PlatformStatus =
  | CapabilityStatus
  | "Coming Soon"
  | "Repository"
  | "Replay"
  | "Provider";

export type PlatformCapabilityId =
  | "identity"
  | "artwork"
  | "printings"
  | "finish"
  | "condition"
  | "marketData"
  | "marketIntelligence"
  | "portfolio"
  | "inventory"
  | "watchlists"
  | "purchaseEvaluation"
  | "developerDiagnostics";

export type PlatformCapability = {
  futureProvider?: string;
  id: PlatformCapabilityId;
  label: string;
  provider?: string;
  providerSelected?: string;
  reason: string;
  resolution: string;
  source: string;
  status: CapabilityStatus;
};

export type GameCapabilityProfile = {
  capabilities: PlatformCapability[];
  game: string;
};
