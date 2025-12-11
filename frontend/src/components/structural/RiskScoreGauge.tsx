"use client";

export function RiskScoreGauge({ score }: { score?: number }) {
  const val = Math.min(Math.max(score || 0, 0), 100);
  return (
    <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm text-sm space-y-2">
      <div className="font-semibold text-slate-900 dark:text-white">Risk Score</div>
      <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-zinc-800 overflow-hidden">
        <div className="h-3 bg-red-500" style={{ width: `${val}%` }} />
      </div>
      <div className="text-xs text-slate-600 dark:text-slate-300">{val.toFixed(0)} / 100</div>
    </div>
  );
}
