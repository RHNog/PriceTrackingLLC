export type ReplayMode = "LIVE" | "REPLAY" | "AUTO";

export const PROVIDER_REPLAY_MODES: ReplayMode[] = ["LIVE", "REPLAY", "AUTO"];

export function resolveReplayMode(input?: string | null): ReplayMode {
  if (process.env.NODE_ENV === "production") {
    return "LIVE";
  }

  const requested = (input ?? process.env.PROVIDER_MODE ?? "LIVE").toUpperCase();

  return PROVIDER_REPLAY_MODES.includes(requested as ReplayMode)
    ? requested as ReplayMode
    : "LIVE";
}

export function shouldRecordReplayFixture() {
  if (process.env.NODE_ENV === "production") {
    return false;
  }

  return process.env.PROVIDER_RECORD_FIXTURES === "true" ||
    process.env.PROVIDER_RECORD_FIXTURES === "1";
}
