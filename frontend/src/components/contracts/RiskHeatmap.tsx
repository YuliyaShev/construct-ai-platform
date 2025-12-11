"use client";

type Risk = { section: string; severity?: string };

export function RiskHeatmap({ risks }: { risks: Risk[] }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 shadow-sm text-sm">
      <div className="flex gap-2 flex-wrap">
        {risks.map((r, idx) => (
          <span
            key={idx}
            className={`px-2 py-1 rounded-full text-xs ${
              r.severity === "high" ? "bg-red-500/20 text-red-700" : "bg-amber-200/40 text-amber-800"
            }`}
          >
            {r.section}
          </span>
        ))}
      </div>
    </div>
  );
}
