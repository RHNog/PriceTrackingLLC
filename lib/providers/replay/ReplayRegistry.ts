import path from "node:path";

export const REPLAY_FIXTURE_ROOT = path.join(
  process.cwd(),
  "fixtures",
  "providers",
);

export type ReplayIdentityInput = {
  assetIdentity: string;
  collectorNumber: string;
  condition: string;
  finish: string;
  language: string;
  printing: string;
  providerProductIdentifier: string;
  providerVariantIdentifier: string;
};

export type ReplayIdentity = ReplayIdentityInput & {
  assetKey: string;
  conditionKey: string;
  finishKey: string;
  languageKey: string;
  printingKey: string;
};

export type ReplayFixtureLocation = {
  game: string;
  identity: ReplayIdentity;
  path: string;
  provider: string;
};

export function createReplayFixtureLocation(input: {
  game: string;
  identity: ReplayIdentityInput;
  provider: string;
}): ReplayFixtureLocation {
  const provider = slugifyReplaySegment(input.provider);
  const game = normalizeReplayGame(input.game);
  const identity = normalizeReplayIdentity(input.identity);

  return {
    game,
    identity,
    path: path.join(
      REPLAY_FIXTURE_ROOT,
      provider,
      game,
      identity.assetKey,
      identity.printingKey,
      identity.finishKey,
      identity.conditionKey,
      `${identity.languageKey}.json`,
    ),
    provider,
  };
}

export function normalizeReplayIdentity(
  input: ReplayIdentityInput,
): ReplayIdentity {
  return {
    assetIdentity: normalizeIdentityValue(input.assetIdentity),
    assetKey: slugifyReplaySegment(input.assetIdentity),
    collectorNumber: normalizeIdentityValue(input.collectorNumber),
    condition: normalizeIdentityValue(input.condition),
    conditionKey: normalizeConditionKey(input.condition),
    finish: normalizeIdentityValue(input.finish),
    finishKey: normalizeFinishKey(input.finish),
    language: normalizeIdentityValue(input.language),
    languageKey: slugifyReplaySegment(input.language),
    printing: normalizeIdentityValue(input.printing),
    printingKey: slugifyReplaySegment(input.printing),
    providerProductIdentifier: normalizeIdentityValue(input.providerProductIdentifier),
    providerVariantIdentifier: normalizeIdentityValue(input.providerVariantIdentifier),
  };
}

export function replayIdentitiesMatch(left: ReplayIdentity, right: ReplayIdentity) {
  return (
    left.assetKey === right.assetKey &&
    left.printingKey === right.printingKey &&
    left.collectorNumber === right.collectorNumber &&
    left.finishKey === right.finishKey &&
    left.conditionKey === right.conditionKey &&
    left.languageKey === right.languageKey &&
    left.providerProductIdentifier === right.providerProductIdentifier &&
    left.providerVariantIdentifier === right.providerVariantIdentifier
  );
}

export function normalizeReplayGame(game: string) {
  const normalized = game.trim().toLowerCase();

  if (normalized === "magic: the gathering" || normalized === "magic") {
    return "magic";
  }

  return slugifyReplaySegment(game);
}

export function slugifyReplaySegment(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeIdentityValue(value: string) {
  return value.trim();
}

function normalizeFinishKey(value: string) {
  const normalized = value.trim().toLowerCase();

  if (["nonfoil", "non-foil", "normal"].includes(normalized)) {
    return "normal";
  }

  return slugifyReplaySegment(value);
}

function normalizeConditionKey(value: string) {
  const normalized = value.trim().toLowerCase();
  const aliases: Record<string, string> = {
    "damaged": "dmg",
    "heavily played": "hp",
    "lightly played": "lp",
    "moderately played": "mp",
    "near mint": "nm",
    "played": "pl",
  };

  return aliases[normalized] ?? slugifyReplaySegment(value);
}
