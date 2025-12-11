"use client";

import { PunchSeverityBadge } from "./PunchSeverityBadge";

type Item = {
  description: string;
  trade?: string;
  severity?: string;
  priority?: string;
  recommended_fix?: string;
  drawing_reference?: string;
  location?: { floor?: number; grid?: string; coords?: { x?: number; y?: number } };
};

export function PunchItemCard({ item }: { item?: Item }) {
  if (!item) return <div className="text-sm text-slate-500">Select an item.</div>;
  return (
    <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm space-y-1 text-sm">
      <div className="flex items-center justify-between">
        <div className="font-semibold text-slate-900 dark:text-white">{item.trade || "General"}</div>
        <PunchSeverityBadge level={item.severity} />
      </div>
      <div>{item.description}</div>
      <div className="text-xs text-slate-500">Priority: {item.priority}</div>
      {item.location ? (
        <div className="text-xs text-slate-500">
          Floor {item.location.floor}, Grid {item.location.grid}
        </div>
      ) : null}
      <div className="text-xs text-slate-500">Ref: {item.drawing_reference || "—"}</div>
      <div className="text-xs text-slate-700 dark:text-slate-200">Fix: {item.recommended_fix}</div>
    </div>
  );
}
