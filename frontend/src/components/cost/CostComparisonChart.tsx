"use client";

type Scenario = { label: string; total_cost: number };

export function CostComparisonChart({ scenarios }: { scenarios: Scenario[] }) {
  const max = Math.max(...scenarios.map((s) => s.total_cost), 1);
  return (
    <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm space-y-3">
      <div className="text-sm font-semibold text-slate-900 dark:text-white">Scenario Comparison</div>
      <div className="flex gap-3 items-end">
        {scenarios.map((s) => (
          <div key={s.label} className="flex-1 text-center">
            <div
              className="mx-auto w-full max-w-[60px] rounded-t bg-blue-500"
              style={{ height: `${(s.total_cost / max) * 120}px` }}
              title={`${s.total_cost}`}
            />
            <div className="mt-1 text-xs text-slate-700 dark:text-slate-200">{s.label}</div>
            <div className="text-xs text-slate-500">${s.total_cost.toFixed(0)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
