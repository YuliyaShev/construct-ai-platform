"use client";

type Elem = { id: string; failure_mode?: string; risk?: string };

export function FailureModeList({ elements, onSelect }: { elements: Elem[]; onSelect: (id: string) => void }) {
  if (!elements.length) return <div className="text-sm text-slate-500">No elements.</div>;
  return (
    <div className="space-y-1 text-sm">
      {elements.map((e) => (
        <button
          key={e.id}
          onClick={() => onSelect(e.id)}
          className="w-full text-left rounded-lg border border-slate-200 dark:border-zinc-800 px-3 py-2 hover:border-blue-500"
        >
          <div className="font-semibold text-slate-900 dark:text-white">{e.id}</div>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            {e.failure_mode} — {e.risk}
          </div>
        </button>
      ))}
    </div>
  );
}
