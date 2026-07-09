import {
  explainReplayFixtureMiss,
  loadReplayFixture,
  replayFixtureExists,
  type ReplayLoadResult,
} from "@/lib/providers/replay/ReplayLoader";
import {
  createReplayFixtureLocation,
  type ReplayIdentityInput,
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
    game: string;
    identity: ReplayIdentityInput;
    provider: string;
  }): ReplayDecision<TRaw, TNormalized> {
    const mode = resolveReplayMode();
    const location = createReplayFixtureLocation(input);
    const session = createReplaySession({
      identity: location.identity,
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
      session.exactMatch = true;
      session.liveRequestSkipped = true;
      session.matchReason = "Exact replay identity match.";
      session.quotaSaved = true;
      session.recordedAt = fixture.fixture.metadata.recordedAt;
      session.recordedFrom = fixture.fixture.metadata.recordedFrom;
      session.replayIdentity = fixture.fixture.metadata.identity;
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
      const miss = explainReplayFixtureMiss(location);
      session.fixturePath = location.path;
      session.matchReason = miss.reason;
      session.missingComponents = miss.missingComponents;
      session.status = "REPLAY_MISS";

      return {
        location,
        mode,
        recordAfterLive: false,
        session,
        useFixture: false,
      };
    }

    if (!hasFixture) {
      const miss = explainReplayFixtureMiss(location);
      session.matchReason = miss.reason;
      session.missingComponents = miss.missingComponents;
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
