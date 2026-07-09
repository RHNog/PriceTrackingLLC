import {
  createReplayMetadata,
  type ReplayFixture,
} from "@/lib/providers/replay/ReplayMetadata";
import {
  createReplayFixtureLocation,
  type ReplayIdentityInput,
  type ReplayFixtureLocation,
} from "@/lib/providers/replay/ReplayRegistry";
import { writeReplayFixture } from "@/lib/providers/replay/ReplayLoader";

export class ReplayRecorder<TRaw, TNormalized> {
  record(input: {
    game: string;
    identity: ReplayIdentityInput;
    normalized: TNormalized;
    provider: string;
    providerVersion: string;
    raw: TRaw;
    sdkVersion: string;
  }): ReplayFixtureLocation {
    const location = createReplayFixtureLocation({
      game: input.game,
      identity: input.identity,
      provider: input.provider,
    });
    const fixture: ReplayFixture<TRaw, TNormalized> = {
      metadata: createReplayMetadata({
        asset: location.identity.assetKey,
        game: location.game,
        identity: location.identity,
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
