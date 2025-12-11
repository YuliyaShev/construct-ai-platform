"use client";

type Summary = { material?: number; labor?: number; equipment?: number; overhead?: number; markup?: number; contingency?: number };

export function CostBreakdownChart({ summary }: { summary?: Summary }) {
  const parts = [
    { label: "Material", value: summary?.material || 0, color: "#3b82f6" },
    { label: "Labor", value: summary?.labor || 0, color: "#22c55e" },
    { label: "Equipment", value: summary?.equipment || 0, color: "#a855f7" },
    { label: "Overhead", value: summary?.overhead || 0, color: "#f97316" },
    { label: "Markup", value: summary?.markup || 0, color: "#e11d48" },
    { label: "Contingency", value: summary?.contingency || 0, color: "#14b8a6" },
  ].filter((p) => p.value > 0);
  const total = parts.reduce((s, p) => s + p.value, 0);
  return (
    <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm space-y-3">
      <div className="text-sm font-semibold text-slate-900 dark:text-white">Cost Breakdown</div>
      <div className="flex gap-2 items-center">
        {parts.map((p) => (
          <div key={p.label} className="flex-1 space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-200">
              <span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: p.color }} />
              {p.label}
            </div>
            <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-zinc-800">
              <div
                className="h-2 rounded-full"
                style={{ width: `${total ? (p.value / total) * 100 : 0}%`, backgroundColor: p.color }}
              />
            </div>
            <div className="text-xs text-slate-500">${p.value.toFixed(0)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
