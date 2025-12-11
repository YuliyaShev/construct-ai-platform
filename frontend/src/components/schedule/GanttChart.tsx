"use client";

type Activity = { id: string; name: string; ES?: number; EF?: number; critical?: boolean; duration_days?: number };

export function GanttChart({ activities }: { activities: Activity[] }) {
  const maxEF = Math.max(...activities.map((a) => a.EF || 0), 1);
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 shadow-sm">
      <div className="space-y-2 min-w-[600px]">
        {activities.map((a) => {
          const startPct = ((a.ES || 0) / maxEF) * 100;
          const widthPct = ((a.duration_days || 0) / maxEF) * 100;
          return (
            <div key={a.id} className="text-xs text-slate-700 dark:text-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-24 shrink-0 font-semibold text-slate-900 dark:text-slate-100">{a.id}</div>
                <div className="flex-1 h-4 bg-slate-100 dark:bg-zinc-800 relative rounded">
                  <div
                    className={`absolute h-4 rounded ${a.critical ? "bg-red-500" : "bg-blue-500"}`}
                    style={{ left: `${startPct}%`, width: `${widthPct}%` }}
                    title={a.name}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
