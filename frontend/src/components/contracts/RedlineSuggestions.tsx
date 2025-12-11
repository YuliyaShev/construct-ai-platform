"use client";

export function RedlineSuggestions({ items }: { items?: string[] }) {
  if (!items?.length) return <div className="text-sm text-slate-500">No redline suggestions.</div>;
  return (
    <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm text-sm space-y-2">
      <div className="font-semibold text-slate-900 dark:text-white">Redline Suggestions</div>
      <ul className="list-disc pl-4 space-y-1">
        {items.map((i, idx) => (
          <li key={idx} className="text-xs text-slate-700 dark:text-slate-200">
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}
