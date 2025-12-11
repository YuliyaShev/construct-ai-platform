"use client";

export function BidFormTable({ form }: { form?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm text-sm whitespace-pre-wrap">
      {form || "Bid form will appear here."}
    </div>
  );
}
