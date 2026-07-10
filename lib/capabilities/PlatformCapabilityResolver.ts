import type {
  GameCapabilityProfile,
  PlatformCapability,
  PlatformCapabilityId,
} from "@/lib/capabilities/PlatformCapability";
import { platformCapabilityProfiles } from "@/lib/capabilities/PlatformCapabilityRegistry";

function normalizeGame(game: string) {
  const normalized = game.trim().toLowerCase();
  if (normalized === "magic" || normalized === "mtg") return "Magic";
  if (normalized === "lorcana") return "Lorcana";
  if (normalized === "pokemon" || normalized === "pokémon") return "Pokemon";
  if (normalized === "one piece" || normalized === "onepiece") return "One Piece";
  if (normalized === "flesh and blood" || normalized === "fab") return "Flesh and Blood";
  return game;
}

export function resolveGameCapabilities(game: string): GameCapabilityProfile {
  const normalized = normalizeGame(game);
  return (
    platformCapabilityProfiles.find((profile) => profile.game === normalized) ?? {
      game: normalized,
      capabilities: [],
    }
  );
}

export function resolveCapability(
  game: string,
  capabilityId: PlatformCapabilityId,
): PlatformCapability {
  return (
    resolveGameCapabilities(game).capabilities.find(
      (capability) => capability.id === capabilityId,
    ) ?? {
      id: capabilityId,
      label: capabilityId,
      reason: `No capability declaration exists for ${game}.`,
      resolution: "Unavailable",
      source: "Platform Capability Registry",
      status: "Unavailable",
    }
  );
}

export function canUseCapability(game: string, capabilityId: PlatformCapabilityId) {
  return resolveCapability(game, capabilityId).status === "Operational";
}

export function resolveFinishDisplay(game: string, finishes: string[]) {
  const known = finishes.filter(
    (finish) => finish.trim() && finish.trim().toLowerCase() !== "unknown",
  );
  return known.length > 0
    ? known.join(", ")
    : resolveCapability(game, "finish").resolution;
}
