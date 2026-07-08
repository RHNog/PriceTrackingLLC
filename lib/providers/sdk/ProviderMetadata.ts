export type ProviderDomain =
  | "certification"
  | "identity"
  | "market"
  | "playability"
  | "tournament";

export type ProviderLifecycleStatus =
  | "ACTIVE"
  | "PLANNED"
  | "WAITING_FOR_APPROVAL"
  | "DISABLED";

export interface ProviderMetadata {
  id: string;
  name: string;
  domain: ProviderDomain;
  lifecycleStatus: ProviderLifecycleStatus;
  description: string;
  homepage?: string;
  supportedInputs: string[];
  supportedOutputs: string[];
  evidenceTypes: string[];
  version: string;
}
