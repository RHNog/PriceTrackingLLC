export const REPLAY_FIXTURE_SCHEMA_VERSION = 1;

export type ReplayRecordedFrom = "LIVE_PROVIDER" | "MANUAL_FIXTURE";

export type ReplayFixtureMetadata = {
  asset: string;
  checksum?: string;
  game: string;
  provider: string;
  providerVersion: string;
  recordedAt: string;
  recordedFrom: ReplayRecordedFrom;
  schemaVersion: number;
  sdkVersion: string;
};

export type ReplayFixture<TRaw = unknown, TNormalized = unknown> = {
  metadata: ReplayFixtureMetadata;
  normalized: TNormalized;
  raw: TRaw;
};

export function createReplayMetadata(input: {
  asset: string;
  game: string;
  provider: string;
  providerVersion: string;
  recordedFrom?: ReplayRecordedFrom;
  sdkVersion: string;
}): ReplayFixtureMetadata {
  return {
    asset: input.asset,
    game: input.game,
    provider: input.provider,
    providerVersion: input.providerVersion,
    recordedAt: new Date().toISOString(),
    recordedFrom: input.recordedFrom ?? "LIVE_PROVIDER",
    schemaVersion: REPLAY_FIXTURE_SCHEMA_VERSION,
    sdkVersion: input.sdkVersion,
  };
}
