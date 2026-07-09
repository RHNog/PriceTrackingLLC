import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import {
  REPLAY_FIXTURE_SCHEMA_VERSION,
  type ReplayFixture,
} from "@/lib/providers/replay/ReplayMetadata";
import {
  REPLAY_FIXTURE_ROOT,
  replayIdentitiesMatch,
  type ReplayFixtureLocation,
} from "@/lib/providers/replay/ReplayRegistry";

export type ReplayLoadResult<TRaw = unknown, TNormalized = unknown> = {
  fixture: ReplayFixture<TRaw, TNormalized>;
  fixtureAgeMs: number;
  path: string;
};

export class ReplayFixtureValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ReplayFixtureValidationError";
  }
}

export function replayFixtureExists(location: ReplayFixtureLocation) {
  return fs.existsSync(location.path);
}

export function explainReplayFixtureMiss(location: ReplayFixtureLocation) {
  const identity = location.identity;
  const root = path.join(REPLAY_FIXTURE_ROOT, location.provider, location.game);
  const assetPath = path.join(root, identity.assetKey);
  const printingPath = path.join(assetPath, identity.printingKey);
  const finishPath = path.join(printingPath, identity.finishKey);
  const conditionPath = path.join(finishPath, identity.conditionKey);

  if (!fs.existsSync(assetPath)) {
    return {
      missingComponents: ["Asset Identity"],
      reason: "Replay observation missing: asset identity not recorded.",
    };
  }

  if (!fs.existsSync(printingPath)) {
    return {
      missingComponents: ["Printing"],
      reason: "Replay observation missing: printing not recorded.",
    };
  }

  if (!fs.existsSync(finishPath)) {
    return {
      missingComponents: ["Finish"],
      reason: "Replay observation missing: finish not recorded.",
    };
  }

  if (!fs.existsSync(conditionPath)) {
    return {
      missingComponents: ["Condition"],
      reason: "Replay observation missing: condition not recorded.",
    };
  }

  return {
    missingComponents: ["Language"],
    reason: "Replay observation missing: language not recorded for this identity.",
  };
}

export function loadReplayFixture<TRaw, TNormalized>(
  location: ReplayFixtureLocation,
): ReplayLoadResult<TRaw, TNormalized> {
  const rawText = fs.readFileSync(location.path, "utf8");
  const fixture = JSON.parse(rawText) as ReplayFixture<TRaw, TNormalized>;

  validateReplayFixture(fixture, location);

  return {
    fixture,
    fixtureAgeMs: Date.now() - Date.parse(fixture.metadata.recordedAt),
    path: location.path,
  };
}

export function writeReplayFixture<TRaw, TNormalized>(
  location: ReplayFixtureLocation,
  fixture: ReplayFixture<TRaw, TNormalized>,
) {
  const fixtureWithChecksum = {
    ...fixture,
    metadata: {
      ...fixture.metadata,
      checksum: createReplayChecksum(fixture.raw, fixture.normalized),
    },
  };

  fs.mkdirSync(path.dirname(location.path), { recursive: true });
  fs.writeFileSync(
    location.path,
    `${JSON.stringify(fixtureWithChecksum, null, 2)}\n`,
    "utf8",
  );
}

export function validateReplayFixture<TRaw, TNormalized>(
  fixture: ReplayFixture<TRaw, TNormalized>,
  location: ReplayFixtureLocation,
) {
  if (!fixture || typeof fixture !== "object") {
    throw new ReplayFixtureValidationError("Replay fixture is not an object.");
  }

  if (fixture.metadata.schemaVersion !== REPLAY_FIXTURE_SCHEMA_VERSION) {
    throw new ReplayFixtureValidationError("Replay fixture schema version mismatch.");
  }

  if (fixture.metadata.provider !== location.provider) {
    throw new ReplayFixtureValidationError("Replay fixture provider mismatch.");
  }

  if (fixture.metadata.game !== location.game) {
    throw new ReplayFixtureValidationError("Replay fixture game mismatch.");
  }

  if (fixture.metadata.asset !== location.identity.assetKey) {
    throw new ReplayFixtureValidationError("Replay fixture asset mismatch.");
  }

  if (!fixture.metadata.identity) {
    throw new ReplayFixtureValidationError("Replay fixture identity is missing.");
  }

  if (!replayIdentitiesMatch(fixture.metadata.identity, location.identity)) {
    throw new ReplayFixtureValidationError("Replay fixture identity mismatch.");
  }

  if (!fixture.metadata.sdkVersion) {
    throw new ReplayFixtureValidationError("Replay fixture SDK version is missing.");
  }

  if (Number.isNaN(Date.parse(fixture.metadata.recordedAt))) {
    throw new ReplayFixtureValidationError("Replay fixture timestamp is invalid.");
  }

  if (!("raw" in fixture) || !("normalized" in fixture)) {
    throw new ReplayFixtureValidationError("Replay fixture payload is incomplete.");
  }

  if (
    fixture.metadata.checksum &&
    fixture.metadata.checksum !== createReplayChecksum(fixture.raw, fixture.normalized)
  ) {
    throw new ReplayFixtureValidationError("Replay fixture checksum mismatch.");
  }
}

export function createReplayChecksum(raw: unknown, normalized: unknown) {
  return createHash("sha256")
    .update(JSON.stringify({ normalized, raw }))
    .digest("hex");
}
