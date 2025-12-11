"use client";

const library = [
  { id: "curtain_wall_head", title: "Curtain Wall Head" },
  { id: "railing_post", title: "Railing Post" },
  { id: "slab_edge", title: "Slab Edge Insulation" },
  { id: "rebar", title: "Rebar Detail" },
];

export function DetailLibraryGrid({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      {library.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item.id)}
          className="rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-left text-sm hover:border-blue-500"
        >
          <div className="font-semibold text-slate-900 dark:text-white">{item.title}</div>
          <div className="text-xs text-slate-500">{item.id}</div>
        </button>
      ))}
    </div>
  );
}
