"use client";

import { HazardSeverityBadge } from "./HazardSeverityBadge";

type Hazard = { hazard_type: string; risk_rating?: string; risk_score?: number; recommended_action?: string };

export function HazardList({ hazards, onSelect }: { hazards: Hazard[]; onSelect?: (h: Hazard) => void }) {
  if (!hazards.length) return <div className="text-sm text-slate-500">No hazards detected.</div>;
  return (
    <div className="space-y-2">
      {hazards.map((h, idx) => (
        <button
          key={idx}
          onClick={() => onSelect?.(h)}
          className="w-full text-left rounded-lg border border-slate-200 dark:border-zinc-800 px-3 py-2 hover:border-blue-500"
        >
          <div className="flex items-center justify-between">
            <div className="font-semibold text-slate-900 dark:text-white">{h.hazard_type}</div>
            <HazardSeverityBadge level={h.risk_rating} />
          </div>
          <div className="text-xs text-slate-500">Score: {h.risk_score}</div>
          <div className="text-xs text-slate-600 dark:text-slate-300">{h.recommended_action}</div>
        </button>
      ))}
    </div>
  );
}
