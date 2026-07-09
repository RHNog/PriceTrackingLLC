import type { ReplayMode } from "@/lib/providers/replay/ReplayMode";
import type { ReplayIdentity } from "@/lib/providers/replay/ReplayRegistry";

export type ReplaySessionStatus =
  | "LIVE_REQUEST"
  | "REPLAY_HIT"
  | "REPLAY_MISS"
  | "RECORDED"
  | "FAILED";

export type ReplaySession = {
  asset: string;
  exactMatch: boolean;
  fixtureAgeMs: number | null;
  fixtureLoaded: boolean;
  fixturePath: string | null;
  liveRequestSkipped: boolean;
  matchReason: string | null;
  missingComponents: string[];
  mode: ReplayMode;
  provider: string;
  quotaSaved: boolean;
  recordedAt: string | null;
  recordedFrom: string | null;
  replayIdentity: ReplayIdentity | null;
  requestedIdentity: ReplayIdentity;
  sdkVersion: string | null;
  startedAt: string;
  status: ReplaySessionStatus;
};

export function createReplaySession(input: {
  identity: ReplayIdentity;
  mode: ReplayMode;
  provider: string;
}): ReplaySession {
  return {
    asset: input.identity.assetKey,
    exactMatch: false,
    fixtureAgeMs: null,
    fixtureLoaded: false,
    fixturePath: null,
    liveRequestSkipped: false,
    matchReason: null,
    missingComponents: [],
    mode: input.mode,
    provider: input.provider,
    quotaSaved: false,
    recordedAt: null,
    recordedFrom: null,
    replayIdentity: null,
    requestedIdentity: input.identity,
    sdkVersion: null,
    startedAt: new Date().toISOString(),
    status: "LIVE_REQUEST",
  };
}
