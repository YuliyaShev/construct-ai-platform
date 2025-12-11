"use client";

import { HazardSeverityBadge } from "./HazardSeverityBadge";

type Hazard = {
  hazard_type: string;
  risk_rating?: string;
  risk_score?: number;
  osha_reference?: string;
  csa_reference?: string;
  recommended_action?: string;
  location?: { x?: number; y?: number; z?: number };
};

export function HazardCard({ hazard }: { hazard?: Hazard }) {
  if (!hazard) return <div className="text-sm text-slate-500">Select a hazard.</div>;
  return (
    <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm space-y-1 text-sm">
      <div className="flex items-center justify-between">
        <div className="font-semibold text-slate-900 dark:text-white">{hazard.hazard_type}</div>
        <HazardSeverityBadge level={hazard.risk_rating} />
      </div>
      <div className="text-xs text-slate-500">Score: {hazard.risk_score}</div>
      {hazard.location ? (
        <div className="text-xs text-slate-500">
          Loc: x {hazard.location.x}, y {hazard.location.y}, z {hazard.location.z}
        </div>
      ) : null}
      <div className="text-xs text-slate-600 dark:text-slate-300">OSHA: {hazard.osha_reference || "—"}</div>
      <div className="text-xs text-slate-600 dark:text-slate-300">CSA: {hazard.csa_reference || "—"}</div>
      <div className="text-xs text-slate-700 dark:text-slate-200">Action: {hazard.recommended_action}</div>
    </div>
  );
}
