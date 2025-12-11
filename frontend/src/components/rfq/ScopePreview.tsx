"use client";

export function ScopePreview({ scope }: { scope?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm text-sm whitespace-pre-wrap">
      {scope || "Scope will appear here."}
    </div>
  );
}
