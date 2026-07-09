import type { ReplaySession } from "@/lib/providers/replay/ReplaySession";

export type ReplayDiagnostics = {
  fixtureAge: string | null;
  fixtureAgeMs: number | null;
  fixtureLoaded: boolean;
  fixturePath: string | null;
  liveRequestSkipped: boolean;
  mode: ReplaySession["mode"];
  provider: string;
  quotaSaved: boolean;
  recordedAt: string | null;
  recordedFrom: string | null;
  sdkVersion: string | null;
  status: ReplaySession["status"];
};

export function createReplayDiagnostics(
  session: ReplaySession | null,
): ReplayDiagnostics | null {
  if (!session) {
    return null;
  }

  return {
    fixtureAge: formatFixtureAge(session.fixtureAgeMs),
    fixtureAgeMs: session.fixtureAgeMs,
    fixtureLoaded: session.fixtureLoaded,
    fixturePath: session.fixturePath,
    liveRequestSkipped: session.liveRequestSkipped,
    mode: session.mode,
    provider: session.provider,
    quotaSaved: session.quotaSaved,
    recordedAt: session.recordedAt,
    recordedFrom: session.recordedFrom,
    sdkVersion: session.sdkVersion,
    status: session.status,
  };
}

function formatFixtureAge(ageMs: number | null) {
  if (ageMs === null) {
    return null;
  }

  const minutes = Math.floor(ageMs / 60_000);

  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 48) {
    return `${hours}h`;
  }

  return `${Math.floor(hours / 24)}d`;
}
