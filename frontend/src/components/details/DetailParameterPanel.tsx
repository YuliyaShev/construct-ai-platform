"use client";

export function DetailParameterPanel({ metadata }: { metadata?: any }) {
  if (!metadata) return <div className="text-sm text-slate-500">No metadata.</div>;
  return (
    <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm space-y-2 text-sm">
      <div className="text-sm font-semibold text-slate-900 dark:text-white">Parameters</div>
      <pre className="whitespace-pre-wrap text-xs text-slate-700 dark:text-slate-200">{JSON.stringify(metadata.parameters, null, 2)}</pre>
      {metadata.notes?.length ? (
        <div className="space-y-1">
          <div className="text-sm font-semibold text-slate-900 dark:text-white">Notes</div>
          {metadata.notes.map((n: string, idx: number) => (
            <div key={idx} className="text-xs text-slate-600 dark:text-slate-300">
              • {n}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
