"use client";

export function CodeSummaryPanel({ summary }: { summary?: Record<string, number> }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm space-y-1 text-sm">
      <div className="text-lg font-semibold text-slate-900 dark:text-white">Summary</div>
      <div>Total: {summary?.total ?? 0}</div>
      <div>High: {summary?.high ?? 0}</div>
      <div>Medium: {summary?.medium ?? 0}</div>
      <div>Low: {summary?.low ?? 0}</div>
    </div>
  );
}
