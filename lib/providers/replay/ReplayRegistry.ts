import path from "node:path";

export const REPLAY_FIXTURE_ROOT = path.join(
  process.cwd(),
  "fixtures",
  "providers",
);

export type ReplayFixtureLocation = {
  asset: string;
  game: string;
  path: string;
  provider: string;
};

export function createReplayFixtureLocation(input: {
  asset: string;
  game: string;
  provider: string;
}): ReplayFixtureLocation {
  const provider = slugifyReplaySegment(input.provider);
  const game = normalizeReplayGame(input.game);
  const asset = slugifyReplaySegment(input.asset);

  return {
    asset,
    game,
    path: path.join(REPLAY_FIXTURE_ROOT, provider, game, `${asset}.json`),
    provider,
  };
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
