"use client";

type Markup = { src: string; title?: string };

export function PunchMarkupViewer({ markups }: { markups?: Markup[] }) {
  if (!markups?.length) return <div className="text-sm text-slate-500">No markups available.</div>;
  return (
    <div className="grid grid-cols-2 gap-2">
      {markups.map((m, idx) => (
        <div key={idx} className="rounded-lg overflow-hidden border border-slate-200 dark:border-zinc-800">
          <img src={m.src} alt={m.title || "markup"} className="w-full h-32 object-cover" />
          <div className="text-xs text-slate-600 dark:text-slate-300 px-2 py-1">{m.title}</div>
        </div>
      ))}
    </div>
  );
}
