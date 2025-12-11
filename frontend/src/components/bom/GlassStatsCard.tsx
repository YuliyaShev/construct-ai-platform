"use client";

export function GlassStatsCard({ totalSqft, totalSqm }: { totalSqft: number; totalSqm: number }) {
  return (
    <div className="rounded-lg border bg-white dark:bg-zinc-900 p-4 shadow-sm flex gap-6 text-sm">
      <div>
        <div className="text-xs uppercase text-slate-500">Total Area (sqft)</div>
        <div className="text-xl font-semibold text-slate-900 dark:text-white">{totalSqft?.toFixed(1) ?? "0.0"}</div>
      </div>
      <div>
        <div className="text-xs uppercase text-slate-500">Total Area (sqm)</div>
        <div className="text-xl font-semibold text-slate-900 dark:text-white">{totalSqm?.toFixed(1) ?? "0.0"}</div>
      </div>
    </div>
  );
}
