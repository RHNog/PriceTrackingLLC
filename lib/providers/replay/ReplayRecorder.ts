import {
  createReplayMetadata,
  type ReplayFixture,
} from "@/lib/providers/replay/ReplayMetadata";
import {
  createReplayFixtureLocation,
  type ReplayFixtureLocation,
} from "@/lib/providers/replay/ReplayRegistry";
import { writeReplayFixture } from "@/lib/providers/replay/ReplayLoader";

export class ReplayRecorder<TRaw, TNormalized> {
  record(input: {
    asset: string;
    game: string;
    normalized: TNormalized;
    provider: string;
    providerVersion: string;
    raw: TRaw;
    sdkVersion: string;
  }): ReplayFixtureLocation {
    const location = createReplayFixtureLocation({
      asset: input.asset,
      game: input.game,
      provider: input.provider,
    });
    const fixture: ReplayFixture<TRaw, TNormalized> = {
      metadata: createReplayMetadata({
        asset: location.asset,
        game: location.game,
        provider: location.provider,
        providerVersion: input.providerVersion,
        sdkVersion: input.sdkVersion,
      }),
      normalized: input.normalized,
      raw: input.raw,
    };

    writeReplayFixture(location, fixture);

    return location;
  }
}
