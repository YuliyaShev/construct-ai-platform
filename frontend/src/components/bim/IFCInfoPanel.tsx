"use client";

type Props = {
  counts?: { columns?: number; beams?: number; plates?: number; proxy?: number };
  version?: string;
};

export function IFCInfoPanel({ counts, version }: Props) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/60 p-4 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">BIM Ready Export</p>
      <div className="text-sm text-slate-700 dark:text-slate-200">
        Version: {version || "IFC4"}
      </div>
      <div className="mt-2 text-sm text-slate-700 dark:text-slate-200 space-y-1">
        <div>Columns: {counts?.columns ?? 0}</div>
        <div>Beams: {counts?.beams ?? 0}</div>
        <div>Plates: {counts?.plates ?? 0}</div>
        <div>Proxy: {counts?.proxy ?? 0}</div>
      </div>
    </div>
  );
}
