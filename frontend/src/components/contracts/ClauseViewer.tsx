"use client";

export function ClauseViewer({ clause }: { clause?: any }) {
  if (!clause) return <div className="text-sm text-slate-500">Select a clause.</div>;
  return (
    <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm text-sm">
      <div className="font-semibold text-slate-900 dark:text-white">{clause.section}</div>
      <div className="text-xs text-slate-600 dark:text-slate-300">{clause.reason}</div>
      <div className="text-xs text-red-600">{clause.severity}</div>
    </div>
  );
}
