"use client";

type Item = { month: string; crane_move?: boolean };

export function LogisticsTimeline({ items }: { items?: Item[] }) {
  if (!items?.length) return <div className="text-sm text-slate-500">No timeline.</div>;
  return (
    <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm space-y-2 text-sm">
      <div className="font-semibold text-slate-900 dark:text-white">4D Logistics Timeline</div>
      <ul className="list-disc pl-4 space-y-1">
        {items.map((i, idx) => (
          <li key={idx}>
            {i.month} — {i.crane_move ? "Crane move/adjust" : "Steady state"}
          </li>
        ))}
      </ul>
    </div>
  );
}
