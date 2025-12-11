"use client";

type Element = { id: string; type?: string; D_C_ratio?: number; risk?: string; failure_mode?: string; recommendation?: string };

export function ElementInspector({ element }: { element?: Element }) {
  if (!element) return <div className="text-sm text-slate-500">Select an element.</div>;
  return (
    <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm space-y-1 text-sm">
      <div className="font-semibold text-slate-900 dark:text-white">{element.id}</div>
      <div>Type: {element.type}</div>
      <div>D/C: {element.D_C_ratio}</div>
      <div>Risk: {element.risk}</div>
      <div>Mode: {element.failure_mode}</div>
      <div className="text-xs text-slate-600 dark:text-slate-300">Rec: {element.recommendation}</div>
    </div>
  );
}
