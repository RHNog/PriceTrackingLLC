import {
  loadReplayFixture,
  replayFixtureExists,
  type ReplayLoadResult,
} from "@/lib/providers/replay/ReplayLoader";
import {
  createReplayFixtureLocation,
  type ReplayFixtureLocation,
} from "@/lib/providers/replay/ReplayRegistry";
import {
  resolveReplayMode,
  shouldRecordReplayFixture,
  type ReplayMode,
} from "@/lib/providers/replay/ReplayMode";
import {
  createReplaySession,
  type ReplaySession,
} from "@/lib/providers/replay/ReplaySession";

export type ReplayDecision<TRaw, TNormalized> = {
  fixture?: ReplayLoadResult<TRaw, TNormalized>;
  location: ReplayFixtureLocation;
  mode: ReplayMode;
  recordAfterLive: boolean;
  session: ReplaySession;
  useFixture: boolean;
};

export class ReplayProvider<TRaw, TNormalized> {
  prepare(input: {
    asset: string;
    game: string;
    provider: string;
  }): ReplayDecision<TRaw, TNormalized> {
    const mode = resolveReplayMode();
    const location = createReplayFixtureLocation(input);
    const session = createReplaySession({
      asset: location.asset,
      mode,
      provider: location.provider,
    });
    const hasFixture = replayFixtureExists(location);
    const canUseFixture = mode === "REPLAY" || mode === "AUTO";

    if (canUseFixture && hasFixture) {
      const fixture = loadReplayFixture<TRaw, TNormalized>(location);
      session.fixtureAgeMs = fixture.fixtureAgeMs;
      session.fixtureLoaded = true;
      session.fixturePath = fixture.path;
      session.liveRequestSkipped = true;
      session.quotaSaved = true;
      session.recordedAt = fixture.fixture.metadata.recordedAt;
      session.recordedFrom = fixture.fixture.metadata.recordedFrom;
      session.sdkVersion = fixture.fixture.metadata.sdkVersion;
      session.status = "REPLAY_HIT";

      return {
        fixture,
        location,
        mode,
        recordAfterLive: false,
        session,
        useFixture: true,
      };
    }

    if (mode === "REPLAY") {
      session.status = "REPLAY_MISS";

      return {
        location,
        mode,
        recordAfterLive: false,
        session,
        useFixture: false,
      };
    }

    session.fixturePath = location.path;
    session.status = hasFixture ? "LIVE_REQUEST" : "REPLAY_MISS";

    return {
      location,
      mode,
      recordAfterLive: shouldRecordReplayFixture(),
      session,
      useFixture: false,
    };
  }
}
