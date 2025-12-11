"use client";

type Markup = { image?: string; description?: string };

export function PhotoMarkupViewer({ markups }: { markups: Markup[] }) {
  if (!markups?.length) return <div className="text-sm text-slate-500">No markups available.</div>;
  return (
    <div className="space-y-2">
      {markups.map((m, idx) => (
        <div key={idx} className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 shadow-sm text-sm">
          {m.image ? <img src={m.image} alt="markup" className="rounded mb-2" /> : null}
          <div className="text-xs text-slate-600 dark:text-slate-300">{m.description}</div>
        </div>
      ))}
    </div>
  );
}
