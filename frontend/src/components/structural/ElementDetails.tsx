"use client";

type Node = {
  id: string;
  type: string;
  tributary_area_sqft?: number;
  load_estimate_kN?: number;
  load_path?: string[];
  issues?: { severity: string; message: string }[];
};

export function ElementDetails({ node }: { node?: Node }) {
  if (!node) return <div className="text-sm text-slate-500">Select an element to see details.</div>;
  return (
    <div className="space-y-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold">{node.id}</div>
        <div className="text-xs uppercase text-slate-500">{node.type}</div>
      </div>
      <div className="text-sm text-slate-700 dark:text-slate-200">Tributary area: {node.tributary_area_sqft ?? "—"} sq.ft</div>
      <div className="text-sm text-slate-700 dark:text-slate-200">Load estimate: {node.load_estimate_kN ?? "—"} kN</div>
      <div className="text-sm text-slate-700 dark:text-slate-200">
        Load path: {node.load_path?.join(" → ") || "—"}
      </div>
      {node.issues?.length ? (
        <div className="space-y-1 text-sm">
          {node.issues.map((i, idx) => (
            <div key={idx} className="text-amber-700">
              • {i.message}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
