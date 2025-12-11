"use client";

export function ProgressiveCollapseSimulator({ removed, failed }: { removed?: string; failed?: string[] }) {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800/40 dark:bg-amber-900/30 p-4 shadow-sm text-sm">
      <div className="font-semibold">Progressive Collapse Check</div>
      <div>Removed element: {removed || "—"}</div>
      <div>Failed elements: {failed?.length ? failed.join(", ") : "None"}</div>
    </div>
  );
}
