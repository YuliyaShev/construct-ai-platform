"use client";

export function MissingSheetsPanel({ sheets }: { sheets: string[] }) {
  if (!sheets?.length) return <div className="text-sm text-slate-500">All required sheets detected.</div>;
  return (
    <div className="space-y-1 text-sm">
      {sheets.map((s, idx) => (
        <div key={idx} className="rounded-lg border border-red-200 bg-red-50 text-red-700 dark:border-red-800/40 dark:bg-red-900/20 px-3 py-2">
          Missing: {s}
        </div>
      ))}
    </div>
  );
}
