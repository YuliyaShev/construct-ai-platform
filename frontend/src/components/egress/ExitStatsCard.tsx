"use client";

export function ExitStatsCard({ summary }: { summary?: any }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm space-y-1 text-sm">
      <div className="text-lg font-semibold text-slate-900 dark:text-white">Evacuation Summary</div>
      <div>Total time: {summary?.total_time ?? "—"} s</div>
      <div>Time for 90%: {summary?.time_90_percent ?? "—"} s</div>
      <div>Bottlenecks: {summary?.bottlenecks?.join(", ") || "None"}</div>
    </div>
  );
}
