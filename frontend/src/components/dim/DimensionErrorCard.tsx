"use client";

import { DimensionSeverityBadge } from "./DimensionSeverityBadge";

type DimError = {
  id: string;
  type: string;
  description?: string;
  suggestion?: string;
  severity?: string;
  expected?: string;
  actual?: string;
};

export function DimensionErrorCard({ item }: { item: DimError }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm space-y-2">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.id}</div>
        <DimensionSeverityBadge severity={item.severity} />
      </div>
      <div className="text-sm text-slate-600 dark:text-slate-300">{item.type}</div>
      {item.description && <p className="text-sm text-slate-700 dark:text-slate-200">{item.description}</p>}
      {(item.expected || item.actual) && (
        <div className="text-xs text-slate-500 dark:text-slate-400">
          {item.expected ? `Expected: ${item.expected}` : ""} {item.actual ? `Actual: ${item.actual}` : ""}
        </div>
      )}
      {item.suggestion && (
        <div className="text-sm text-slate-800 dark:text-slate-100 font-medium">Fix: {item.suggestion}</div>
      )}
    </div>
  );
}
