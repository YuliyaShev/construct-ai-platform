"use client";

type Activity = { name: string; resources?: { labor_hours?: number; equipment_hours?: number } };

export function ResourceLoadingChart({ activities }: { activities: Activity[] }) {
  const labor = activities.reduce((s, a) => s + (a.resources?.labor_hours || 0), 0);
  const equip = activities.reduce((s, a) => s + (a.resources?.equipment_hours || 0), 0);
  const total = labor + equip || 1;
  return (
    <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm space-y-2">
      <div className="text-sm font-semibold text-slate-900 dark:text-white">Resource Loading</div>
      <div className="flex gap-2 items-center">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-200">
            <span className="inline-block h-3 w-3 rounded-sm bg-blue-500" />
            Labor Hours
          </div>
          <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-zinc-800">
            <div className="h-2 rounded-full bg-blue-500" style={{ width: `${(labor / total) * 100}%` }} />
          </div>
          <div className="text-xs text-slate-500">{labor.toFixed(1)} hrs</div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-200">
            <span className="inline-block h-3 w-3 rounded-sm bg-amber-500" />
            Equipment Hours
          </div>
          <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-zinc-800">
            <div className="h-2 rounded-full bg-amber-500" style={{ width: `${(equip / total) * 100}%` }} />
          </div>
          <div className="text-xs text-slate-500">{equip.toFixed(1)} hrs</div>
        </div>
      </div>
    </div>
  );
}
