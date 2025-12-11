"use client";

export function TenderPackageViewer({ packages }: { packages: any[] }) {
  return (
    <div className="space-y-3">
      {packages.map((p) => (
        <div key={p.name} className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm space-y-2">
          <div className="text-sm font-semibold text-slate-900 dark:text-white">{p.name}</div>
          <div className="text-xs text-slate-500">PDF: {p.pdf}</div>
        </div>
      ))}
    </div>
  );
}
