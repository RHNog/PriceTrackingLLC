import {
  defaultBusinessProfileId,
  defaultBusinessProfiles,
} from "@/lib/business/BusinessDefaults";
import type { BusinessProfile } from "@/lib/business/BusinessProfileEngine";

export function getBusinessProfiles() {
  return defaultBusinessProfiles;
}

export function getDefaultBusinessProfile() {
  return (
    defaultBusinessProfiles.find(
      (profile) => profile.id === defaultBusinessProfileId,
    ) ?? defaultBusinessProfiles[0]
  );
}

export function findBusinessProfile(id: string) {
  return defaultBusinessProfiles.find((profile) => profile.id === id);
}

export function duplicateBusinessProfile(
  profile: BusinessProfile,
  id: string,
): BusinessProfile {
  const timestamp = new Date().toISOString();

  return {
    ...profile,
    id,
    name: `${profile.name} Copy`,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

