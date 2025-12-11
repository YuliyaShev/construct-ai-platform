"use client";

const materials = [
  { label: "Aluminum", color: "#9ca3af" },
  { label: "Glass", color: "#60a5fa" },
  { label: "Insulation", color: "#fcd34d" },
  { label: "Sealant", color: "#f97316" },
];

export function MaterialTagLegend() {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 shadow-sm space-y-2 text-sm">
      <div className="text-sm font-semibold text-slate-900 dark:text-white">Material Tags</div>
      <div className="grid grid-cols-2 gap-2">
        {materials.map((m) => (
          <div key={m.label} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-200">
            <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: m.color }} />
            {m.label}
          </div>
        ))}
      </div>
    </div>
  );
}
