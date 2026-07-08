"use client";

import { useState } from "react";
import IntelligenceDetail from "@/components/intelligence/IntelligenceDetail";
import IntelligenceTile from "@/components/intelligence/IntelligenceTile";
import type { CardProfile } from "@/lib/engines/cardIntelligence/models/CardProfile";
import type { IntelligenceModel } from "@/lib/intelligence/framework/IntelligenceModel";

type IntelligenceConsoleProps = {
  cardProfile: CardProfile;
};

function averageIndicatorScore(model: IntelligenceModel) {
  if (model.indicators.length === 0) {
    return 0;
  }

  const total = model.indicators.reduce(
    (sum, indicator) => sum + indicator.score,
    0,
  );

  return Math.round(total / model.indicators.length);
}

export default function IntelligenceConsole({
  cardProfile,
}: IntelligenceConsoleProps) {
  const [expandedModelId, setExpandedModelId] = useState<string | null>(null);

  return (
    <section
      aria-label="Intelligence Console"
      className="rounded-lg border border-zinc-800 bg-zinc-900 p-3"
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-medium text-zinc-200">
          Intelligence Console
        </h3>
        <p className="text-xs text-zinc-500">
          Confidence {cardProfile.overallConfidence}%
        </p>
      </div>

      <div className="mt-3 grid gap-2">
        {cardProfile.intelligenceModels.map((model) => {
          const score = averageIndicatorScore(model);
          const isExpanded = expandedModelId === model.id;

          return (
            <div key={model.id} className="grid gap-2">
              <IntelligenceTile
                isExpanded={isExpanded}
                model={model}
                score={score}
                onToggle={() =>
                  setExpandedModelId((current) =>
                    current === model.id ? null : model.id,
                  )
                }
              />
              {isExpanded ? (
                <IntelligenceDetail
                  cardProfile={cardProfile}
                  model={model}
                  score={score}
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

