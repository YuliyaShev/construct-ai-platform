"use client";

type Props = { svg?: string };

export function DetailViewer({ svg }: Props) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 shadow-sm">
      {svg ? (
        <div className="w-full overflow-auto" dangerouslySetInnerHTML={{ __html: svg }} />
      ) : (
        <div className="text-sm text-slate-500">No detail generated yet.</div>
      )}
    </div>
  );
}
