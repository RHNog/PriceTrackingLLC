"use client";

import { useState } from "react";
import {
  defaultBusinessProfileId,
  defaultBusinessProfiles,
} from "@/lib/business/BusinessDefaults";
import {
  duplicateBusinessProfile,
} from "@/lib/business/BusinessProfileRegistry";
import type { BusinessProfile } from "@/lib/business/BusinessProfileEngine";

function createProfileId(name: string) {
  return `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;
}

export default function BusinessProfilesSettings() {
  const [profiles, setProfiles] = useState<BusinessProfile[]>(defaultBusinessProfiles);
  const [defaultProfileId, setDefaultProfileId] = useState(defaultBusinessProfileId);
  const selectedDefault = profiles.find((profile) => profile.id === defaultProfileId);

  function createProfile() {
    const source = selectedDefault ?? profiles[0];
    const profile = duplicateBusinessProfile(source, createProfileId("business-profile"));

    setProfiles((current) => [...current, { ...profile, name: "New Business Profile" }]);
  }

  function duplicateProfile(profile: BusinessProfile) {
    setProfiles((current) => [
      ...current,
      duplicateBusinessProfile(profile, createProfileId(profile.name)),
    ]);
  }

  function renameProfile(profileId: string, name: string) {
    setProfiles((current) =>
      current.map((profile) =>
        profile.id === profileId
          ? { ...profile, name, updatedAt: new Date().toISOString() }
          : profile,
      ),
    );
  }

  function deleteProfile(profileId: string) {
    setProfiles((current) => {
      if (current.length === 1) {
        return current;
      }

      const nextProfiles = current.filter((profile) => profile.id !== profileId);

      if (defaultProfileId === profileId) {
        setDefaultProfileId(nextProfiles[0].id);
      }

      return nextProfiles;
    });
  }

  function updateCostProfile(
    profileId: string,
    key: keyof BusinessProfile["costProfile"],
    value: number,
  ) {
    setProfiles((current) =>
      current.map((profile) =>
        profile.id === profileId
          ? {
              ...profile,
              costProfile: {
                ...profile.costProfile,
                [key]: value,
              },
              updatedAt: new Date().toISOString(),
            }
          : profile,
      ),
    );
  }

  function updateTarget(
    profileId: string,
    key: "minimumROI" | "minimumProfit" | "targetMargin" | "targetROI",
    value: number,
  ) {
    setProfiles((current) =>
      current.map((profile) =>
        profile.id === profileId
          ? { ...profile, [key]: value, updatedAt: new Date().toISOString() }
          : profile,
      ),
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white">Business Profiles</h3>
          <p className="mt-1 text-sm text-zinc-400">
            Configure how costs, margins, and transaction assumptions affect recommendations.
          </p>
        </div>
        <button
          type="button"
          onClick={createProfile}
          className="rounded-md bg-cyan-400 px-3 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          Create Profile
        </button>
      </div>

      <div className="grid gap-3">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            className="rounded-lg border border-zinc-800 bg-zinc-900 p-4"
          >
            <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
              <label className="space-y-2">
                <span className="block text-xs font-medium text-zinc-500">
                  Profile Name
                </span>
                <input
                  value={profile.name}
                  onChange={(event) => renameProfile(profile.id, event.target.value)}
                  className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
                />
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setDefaultProfileId(profile.id)}
                  className={`rounded-md border px-3 py-2 text-sm font-medium ${
                    defaultProfileId === profile.id
                      ? "border-cyan-400 bg-cyan-400 text-zinc-950"
                      : "border-zinc-700 bg-zinc-950 text-zinc-200"
                  }`}
                >
                  Default
                </button>
                <button
                  type="button"
                  onClick={() => duplicateProfile(profile)}
                  className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm font-medium text-zinc-200"
                >
                  Duplicate
                </button>
                <button
                  type="button"
                  onClick={() => deleteProfile(profile.id)}
                  className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm font-medium text-zinc-200"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              <ProfileMetric label="Marketplace" value={profile.defaultMarketplace} />
              <NumberField
                label="Marketplace Fee %"
                value={profile.costProfile.marketplaceFeePercent}
                onChange={(value) =>
                  updateCostProfile(profile.id, "marketplaceFeePercent", value)
                }
              />
              <NumberField
                label="Payment Fee %"
                value={profile.costProfile.paymentProcessingFeePercent}
                onChange={(value) =>
                  updateCostProfile(profile.id, "paymentProcessingFeePercent", value)
                }
              />
              <NumberField
                label="Packaging"
                value={profile.costProfile.packagingCost}
                onChange={(value) =>
                  updateCostProfile(profile.id, "packagingCost", value)
                }
              />
              <NumberField
                label="Shipping"
                value={profile.costProfile.shippingCost}
                onChange={(value) =>
                  updateCostProfile(profile.id, "shippingCost", value)
                }
              />
              <NumberField
                label="Labor"
                value={profile.costProfile.laborCost}
                onChange={(value) =>
                  updateCostProfile(profile.id, "laborCost", value)
                }
              />
              <NumberField
                label="Miscellaneous"
                value={profile.costProfile.miscellaneousCost}
                onChange={(value) =>
                  updateCostProfile(profile.id, "miscellaneousCost", value)
                }
              />
              <NumberField
                label="Fixed Cost"
                value={profile.costProfile.fixedTransactionCost}
                onChange={(value) =>
                  updateCostProfile(profile.id, "fixedTransactionCost", value)
                }
              />
              <NumberField
                label="Variable Cost %"
                value={profile.costProfile.variableTransactionCostPercent}
                onChange={(value) =>
                  updateCostProfile(
                    profile.id,
                    "variableTransactionCostPercent",
                    value,
                  )
                }
              />
              <NumberField
                label="Minimum ROI %"
                value={profile.minimumROI}
                onChange={(value) => updateTarget(profile.id, "minimumROI", value)}
              />
              <NumberField
                label="Minimum Profit"
                value={profile.minimumProfit}
                onChange={(value) =>
                  updateTarget(profile.id, "minimumProfit", value)
                }
              />
              <NumberField
                label="Max Capital"
                value={profile.maximumCapitalExposure}
                onChange={(value) =>
                  setProfiles((current) =>
                    current.map((item) =>
                      item.id === profile.id
                        ? {
                            ...item,
                            maximumCapitalExposure: value,
                            updatedAt: new Date().toISOString(),
                          }
                        : item,
                    ),
                  )
                }
              />
              <NumberField
                label="Target Margin %"
                value={profile.targetMargin}
                onChange={(value) => updateTarget(profile.id, "targetMargin", value)}
              />
              <NumberField
                label="Target ROI %"
                value={profile.targetROI}
                onChange={(value) => updateTarget(profile.id, "targetROI", value)}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProfileMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-zinc-950/60 px-3 py-2">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-zinc-200">{value}</p>
    </div>
  );
}

function NumberField({
  label,
  onChange,
  value,
}: {
  label: string;
  onChange: (value: number) => void;
  value: number;
}) {
  return (
    <label className="rounded-md bg-zinc-950/60 px-3 py-2">
      <span className="block text-xs text-zinc-500">{label}</span>
      <input
        type="number"
        min="0"
        step="0.1"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-1 w-full rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1 text-sm font-semibold text-zinc-200 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
      />
    </label>
  );
}
