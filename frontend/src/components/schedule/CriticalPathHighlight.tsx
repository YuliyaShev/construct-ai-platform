"use client";

export function CriticalPathHighlight({ activities }: { activities: string[] }) {
  if (!activities?.length) return <div className="text-sm text-slate-500">No critical path calculated.</div>;
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 text-red-800 dark:border-red-800/40 dark:bg-red-900/30 p-3 text-sm">
      <div className="font-semibold mb-1">Critical Path</div>
      <div className="text-xs">{activities.join(" → ")}</div>
    </div>
  );
}
