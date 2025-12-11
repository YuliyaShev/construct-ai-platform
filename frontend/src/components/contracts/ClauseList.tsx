"use client";

type Clause = { section: string; severity?: string; reason?: string };

export function ClauseList({ items, onSelect }: { items: Clause[]; onSelect?: (c: Clause) => void }) {
  if (!items?.length) return <div className="text-sm text-slate-500">No clauses found.</div>;
  return (
    <div className="space-y-2">
      {items.map((c, idx) => (
        <button
          key={idx}
          onClick={() => onSelect?.(c)}
          className="w-full text-left rounded-lg border border-slate-200 dark:border-zinc-800 px-3 py-2 hover:border-blue-500"
        >
          <div className="font-semibold text-slate-900 dark:text-white">{c.section}</div>
          <div className="text-xs text-slate-500">{c.reason}</div>
          <div className="text-xs text-red-600">{c.severity}</div>
        </button>
      ))}
    </div>
  );
}
