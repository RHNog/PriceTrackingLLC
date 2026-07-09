import type { ReplayMode } from "@/lib/providers/replay/ReplayMode";

export type ReplaySessionStatus =
  | "LIVE_REQUEST"
  | "REPLAY_HIT"
  | "REPLAY_MISS"
  | "RECORDED"
  | "FAILED";

export type ReplaySession = {
  asset: string;
  fixtureAgeMs: number | null;
  fixtureLoaded: boolean;
  fixturePath: string | null;
  liveRequestSkipped: boolean;
  mode: ReplayMode;
  provider: string;
  quotaSaved: boolean;
  recordedAt: string | null;
  recordedFrom: string | null;
  sdkVersion: string | null;
  startedAt: string;
  status: ReplaySessionStatus;
};

export function createReplaySession(input: {
  asset: string;
  mode: ReplayMode;
  provider: string;
}): ReplaySession {
  return {
    asset: input.asset,
    fixtureAgeMs: null,
    fixtureLoaded: false,
    fixturePath: null,
    liveRequestSkipped: false,
    mode: input.mode,
    provider: input.provider,
    quotaSaved: false,
    recordedAt: null,
    recordedFrom: null,
    sdkVersion: null,
    startedAt: new Date().toISOString(),
    status: "LIVE_REQUEST",
  };
}
